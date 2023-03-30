import { fetchData } from "@/app/api/common";
import { NextResponse } from "next/server";
import {
  apply,
  compose,
  map,
  mergeRight,
  objOf,
  prop,
  juxt,
  identity,
  tap,
} from "ramda";

export async function GET(req: Request, { params }) {
  const { table, column } = params;
  const res = await fetch(
    `http://10.0.1.10:8000/tables/${table}/columns/${column}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  const result = map(
    compose(
      apply(mergeRight),
      juxt([identity, compose(objOf("data"), JSON.parse, prop("data"))])
    ),
    data
  );

  return NextResponse.json(result);
}

export async function POST(req: Request, { params }) {
  const { table, column } = params;
  const res = await req.text();
  const resp = await fetchData(
    "POST",
    `/tables/${table}/columns/${column}`,
    JSON.parse(res)
  );

  const result = compose(
    apply(mergeRight),
    juxt([identity, compose(objOf("data"), JSON.parse, prop("data"))]),
  )(resp);

  return NextResponse.json(result);
}
