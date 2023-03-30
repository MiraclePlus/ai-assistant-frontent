import { NextResponse } from 'next/server';
import { fetchData } from '@/app/api/common';

export async function GET(req: Request, { params }) {
  const { uid, } = params;
  console.log(uid, params);
  
  const data = await fetchData('GET', `/samples/${uid}/entries`);

  return NextResponse.json(data);
}
