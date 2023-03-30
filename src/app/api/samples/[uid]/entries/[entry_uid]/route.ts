import { NextResponse } from 'next/server';
import { fetchData } from '@/app/api/common';
import { compose, } from 'ramda';

export async function POST(req: Request, { params }) {
  const { uid, entry_uid } = params;
  const res = await req.text();
  const json = JSON.parse(res);
  const data = await fetchData('POST', `/samples/${uid}/entries/${entry_uid}`, json);

  return NextResponse.json(data);
}


