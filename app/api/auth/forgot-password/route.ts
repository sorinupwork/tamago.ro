import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordAction } from '@/actions/auth/forgot-password';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await forgotPasswordAction(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
