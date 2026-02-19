import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { SystemState } from '@/models/SystemState'; 

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not defined');
  await mongoose.connect(process.env.MONGODB_URI);
};

// Force dynamic to prevent caching the result
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const state = await SystemState.findOne({ key: 'global_crash' });
    
    return NextResponse.json({ 
      crashed: state ? state.value : false 
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ crashed: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { crashed } = await req.json();

    // Use findOneAndUpdate with upsert: true to Create if not exists, Update if it does
    const state = await SystemState.findOneAndUpdate(
      { key: 'global_crash' },
      { value: crashed },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ 
      crashed: state.value,
      message: "System state updated successfully"
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json({ error: "Failed to update system state" }, { status: 500 });
  }
}
