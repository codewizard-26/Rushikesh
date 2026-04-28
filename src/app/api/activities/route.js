import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import ActivityLog from '@/app/models/ActivityLog';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;



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
    
    if (userGender.toLowerCase()==="male"){
      bmr = 10*userWeight + 6.25*userHeight - 5*userAge + 5;
    }else{
      bmr = 10*userWeight + 6.25*userHeight - 5*userAge - 161;
    }

    let calculatedCalories = 0;

    // Build the robust bio-metric context for Gemini
    const bodyContext = `The user is a ${userAge} year old ${userGender}, weighing ${userWeight}kg with a height of ${userHeight}cm.`;

    if (['Running', 'Cycling', 'Yoga', 'Swimming'].includes(type)) {
      const metValues = { 'Running': 8, 'Cycling': 6, 'Walking':3.5, 'Yoga': 2.5, 'Swimming': 8, gym:5, weightlifting: 5 };
      const met = metValues[type.toLowerCase()] || 5;

      cont activityCalories = met * userWeight * (durationMinutes / 60);

      const calculatedCalories = Math.round(activityCalories*bmr/1500);
      
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
