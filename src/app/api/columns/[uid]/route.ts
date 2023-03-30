import { NextResponse } from 'next/server';
import { apply, compose, map, mergeRight, objOf, pick, prop, juxt, identity, tap } from 'ramda';
// import formidable from "formidable";

// export const config = {
//   api: {
//     bodyParser: false, // enable form data 
//   },
// };

// const formidableParse = async (req) =>
//   new Promise((resolve, reject) =>
//     new formidable.IncomingForm().parse(req, (err, fields, files) =>
//       err ? reject(err) : resolve([fields, files])
//     )
//   );

export async function GET(req: Request): Promise<NextResponse> {
  const res = await fetch('http://10.0.1.10:8000/columns/professor', {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  console.log('================', data);

  return NextResponse.json({ data })
}

export async function PUT(req: Request, { params }): Promise<NextResponse> {
  const { uid } = params;
  const data = await req.text()
  const json = compose(
    JSON.stringify,
    pick(['active', 'data']),
    JSON.parse
  )(data)
  const content = await fetch(`http://10.0.1.10:8000/columns/${uid}`, {
    cache: 'no-store',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: json,
  });
  const res = await content.json();
  const result = compose(
    apply(mergeRight),
    tap(console.info),
    juxt([
      identity,
      compose(
        objOf('data'),
        JSON.parse,
        prop('data'),
      )
    ]),
    tap(console.info),
  )(res);

  return NextResponse.json(result)
}
