import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role, certificateUrl } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please fill all required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    if (role === 'trainer' && !certificateUrl) {
      return NextResponse.json({ message: 'Trainers must provide a certificate URL' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      certificateUrl: role === 'trainer' ? certificateUrl : undefined
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 500 });
  }
}
