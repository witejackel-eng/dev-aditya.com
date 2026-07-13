import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactBody {
  name?: string;
  email?: string;
  project?: string;
  budget?: string;
  timeline?: string;
  _honey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();

    // Honeypot check — if filled, silently accept (spam)
    if (body._honey) {
      return NextResponse.json(
        { success: true, message: 'Message received. I\'ll get back to you soon.' },
        { status: 200 },
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.project) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and project description are required.' },
        { status: 400 },
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    // Log the submission (no email service configured)
    console.log('--- Contact Form Submission ---');
    console.log('Name:', body.name);
    console.log('Email:', body.email);
    console.log('Project:', body.project);
    if (body.budget) console.log('Budget:', body.budget);
    if (body.timeline) console.log('Timeline:', body.timeline);
    console.log('--- End Submission ---');

    return NextResponse.json({
      success: true,
      message: 'Message received. I\'ll get back to you soon.',
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}