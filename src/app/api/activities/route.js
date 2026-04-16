import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import ActivityLog from '@/app/models/ActivityLog';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchGeminiActivityEstimation(prompt) {
  try {
    const formattedPrompt = `${prompt}. Estimate the total calories burned using the provided user body metrics exactly. Provide the result strictly as a valid JSON object with the key "calories" (number). No markdown or other text. Example: {"calories": 300}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: formattedPrompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API Error:', await response.text());
      return 150; // Fallback
    }

    const data = await response.json();
    const textRes = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textRes) {
      const parsed = JSON.parse(textRes);
      return parsed.calories || 150;
    }
  } catch (error) {
    console.error('Gemini parsing error', error);
  }
  return 150; // Fallback
}

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    const activities = await ActivityLog.find({ user: decoded.id }).sort({ date: -1 });
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching activities', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    const { type, durationMinutes, exerciseName, weightLifted, sets, reps, description, notes } = await req.json();

    if (!type || !durationMinutes) {
      return NextResponse.json({ message: 'Please provide activity type and duration' }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    const userWeight = user?.weight || 70;
    const userHeight = user?.height || 170;
    const userAge = user?.age || 25;
    const userGender = user?.gender || 'male';

    let calculatedCalories = 0;

    // Build the robust bio-metric context for Gemini
    const bodyContext = `The user is a ${userAge} year old ${userGender}, weighing ${userWeight}kg with a height of ${userHeight}cm.`;

    if (['Running', 'Cycling', 'Yoga', 'Swimming'].includes(type)) {
      const metValues = { 'Running': 9.8, 'Cycling': 8.0, 'Yoga': 2.5, 'Swimming': 7.0 };
      const met = metValues[type];
      // Basic math wrapper
      calculatedCalories = Math.round(met * userWeight * (durationMinutes / 60) * (1 + (Math.random() * 0.1 - 0.05)));
    } 
    else if (type === 'Weightlifting') {
      const prompt = `${bodyContext} They performed weightlifting for ${durationMinutes} minutes. Specifically, they did the exercise: "${exerciseName}", lifting ${weightLifted}kg for ${sets} sets of ${reps} reps.`;
      calculatedCalories = await fetchGeminiActivityEstimation(prompt);
    } 
    else if (type === 'Other') {
      const prompt = `${bodyContext} They performed an activity for ${durationMinutes} minutes described exactly as: "${description}".`;
      calculatedCalories = await fetchGeminiActivityEstimation(prompt);
    }

    const activity = await ActivityLog.create({
      user: decoded.id,
      type,
      durationMinutes,
      exerciseName: type === 'Weightlifting' ? exerciseName : undefined,
      weightLifted: type === 'Weightlifting' ? Number(weightLifted) : undefined,
      sets: type === 'Weightlifting' ? Number(sets) : undefined,
      reps: type === 'Weightlifting' ? Number(reps) : undefined,
      description: type === 'Other' ? description : undefined,
      caloriesBurned: calculatedCalories,
      notes
    });

    return NextResponse.json({ message: 'Activity logged successfully', activity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error logging activity', error: error.message }, { status: 500 });
  }
}
