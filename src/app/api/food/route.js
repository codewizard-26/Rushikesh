import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import FoodLog from '@/app/models/FoodLog';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function fetchGeminiFoodEstimation(mealDescription) {
  try {
    const prompt = `Analyze this meal description: "${mealDescription}". Estimate the total calories and total macros in grams. Provide the result strictly as a valid JSON object with the keys "calories" (number), "protein" (number), "carbs" (number), and "fats" (number). No markdown. Example: {"calories": 300, "protein": 25, "carbs": 30, "fats": 10}`;
    
    const response = await fetch(`http://127.0.0.1:8000/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meal: mealDescription,
      })
    });

    if (!response.ok) {
      console.error('FastAPI Error', await response.text());
      return { calories: 240, protein: 10, carbs: 30, fats: 8 }; // Fallback
    }

    const data = await response.json();

      return { 
        calories: data.calories || 240, 
        protein: data.protein || 10,
        carbs: data.carbs || 30,
        fats: data.fats || 8
      };
    }
  catch (error) {
    console.error('FastAPI Error', error);
  }
  return { calories: 240, protein: 10, carbs: 30, fats: 8 }; // Fallback
}

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    const foods = await FoodLog.find({ user: decoded.id }).sort({ date: -1 });
    return NextResponse.json({ foods }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching foods', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    const { mealDescription } = await req.json();

    if (!mealDescription) {
      return NextResponse.json({ message: 'Please provide meal description' }, { status: 400 });
    }

    const aiResult = await fetchGeminiFoodEstimation(mealDescription);

    const food = await FoodLog.create({
      user: decoded.id,
      mealName: mealDescription,
      calories: aiResult.calories,
      protein: aiResult.protein,
      carbs: aiResult.carbs,
      fats: aiResult.fats
    });

    return NextResponse.json({ message: 'Food logged safely with AI estimation', food }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error logging food', error: error.message }, { status: 500 });
  }
}
