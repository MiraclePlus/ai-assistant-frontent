"use client";

import React, { useEffect, useState } from "react";
import { ColumnSample } from "@/app/utils/interfaces";
import Table from "./Table";
import Form from "./Form";
import FloatingMenu from "@/app/components/FloatMenu";
import { compose, flip, append, tap } from "ramda";

// const fetcher = (...args) => fetch(...args).then(res => res.json())

const Page = () => {
  const [payloads, setPayloads] = useState<ColumnSample[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const initial = async (page: number = 1) => {
    const res = await fetch(`/api/samples?page=${page}`).then((res) =>
      res.json()
    );
    setPayloads(res);
  };

  useEffect(() => {
    initial();
  }, []);

  const show = () => setVisible(true);
  const close = () => setVisible(false);
  const create = async (e: MouseEvent, record: ColumnSample) => {
    e.preventDefault();
    const payload = await fetch("/api/samples", {
      method: "POST",
      body: JSON.stringify(record),
    }).then((res) => res.json());
    compose(tap(close), setPayloads, flip(append)(payloads))(payload);
  };

  return (
    <div className="min-h-full">
      <div className="p-5 bg-white">
        <Table payloads={payloads} evaluate={console.info} />
      </div>
      <Form show={visible} close={close} create={create} />
      <FloatingMenu handleClick={show} />
    </div>
  );
};

export default Page;
