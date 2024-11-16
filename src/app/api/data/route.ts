import { NextResponse } from 'next/server';
import { getData } from '@/app/api/services/api-service';

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error: any | unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}