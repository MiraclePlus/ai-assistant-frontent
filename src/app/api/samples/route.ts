import { NextResponse } from 'next/server';
import { fetchData } from '../common';

export async function GET(req: Request, { params }) {
  const data = await fetchData('GET', '/samples')

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const res = await req.text();
  const data = await fetchData(
    "POST",
    "/samples",
    JSON.parse(res)
  );

  return NextResponse.json(data);
}
