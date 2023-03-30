import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');
  console.log('=====================', uid, searchParams);
  const res = await fetch('http://10.0.1.10:8000/tables/founder_features/columns/professor', {
    headers: {
      'Content-Type': 'application/json',
      // 'API-Key': process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();
  console.log('================', data);

  return NextResponse.json({ data })
}
