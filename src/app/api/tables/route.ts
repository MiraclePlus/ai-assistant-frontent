import { NextResponse } from 'next/server';
import { fetchData } from '../common';

export async function GET(req: Request) {
  const data = await fetchData('GET', '/tables')
  // console.log('================ GET', data);

  return NextResponse.json({ data })
}

