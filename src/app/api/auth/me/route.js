import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    // Fetch full user record from DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    await dbConnect();
    
    const body = await req.json();
    
    // Whitelist allowed updates
    const updates = {
      weight: body.weight,
      height: body.height,
      age: body.age,
      gender: body.gender,
      unitPreference: body.unitPreference,
      activityLevel: body.activityLevel,
      goal: body.goal
    };

    const user = await User.findByIdAndUpdate(decoded.id, updates, { new: true }).select('-password');
    
    return NextResponse.json({ message: 'Profile updated', user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
  }
}
