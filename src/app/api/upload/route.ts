import { NextResponse } from 'next/server';

if (!process.env.IMGBB_API_KEY) {
  throw new Error('IMGBB_API_KEY is not defined in environment variables');
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert File to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    // Create form data for ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64File);

    // Upload to ImgBB
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: imgbbFormData
    });

    if (!response.ok) {
      console.error('ImgBB API Error:', await response.text());
      throw new Error('Failed to upload to ImgBB');
    }

    const result = await response.json();

    return NextResponse.json(
      { url: result.data.url },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 