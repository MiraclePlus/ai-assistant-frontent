"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { Alert } from "flowbite-react";
import classNames from "classnames";
import dayjs from "dayjs";
import {
  ifElse,
  always,
  addIndex,
  append,
  applySpec,
  apply,
  compose,
  curry,
  flip,
  head,
  equals,
  map,
  keys,
  prop,
  propOr,
  path,
  pathOr,
  tap,
  when,
  isNil,
  unless,
  of,
  __,
} from "ramda";
import { info, log } from "console";
import { ColumnDetail } from "@/app/utils/interfaces";
import { tapLog } from "@/app/utils/log";

interface TableProps {
  table: string
  column: string
  records: ColumnDetail[]
  addFrom: (record: ColumnDetail) => void
}

const Table = ({ table, column, records, addFrom }): FC<TableProps> => {
  const setActive = async (uid: string) => {
    const res = await fetch(`/api/columns/${uid}`, {
      method: "PUT",
      body: JSON.stringify({
        active: true,
      }),
    }).then((res) => res.json());
    console.log("-------------", res);
  };

  const setActiveButton = (uid: string) => (
    <a
      href="#"
      className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
      onClick={() => setActive(uid)}
    >
      Activate
    </a>
  );

  const toRecordEntry = (record: ColumnDetail) => {
    const attr = compose(
      tapLog("VALUE"),
      flip(path)(record),
      flip(append)(["data"])
    );
    console.log("----------------------------------", record);
    return (
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        key={record.uid}
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {record.uid}
        </th>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {attr("prompt")}
        </th>
        <td className="px-6 py-4">{attr("answers")}</td>
        <td className="px-6 py-4">{attr("keywords")}</td>
        <td className="px-6 py-4">
          {dayjs(record.created_at * 1000).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="px-6 py-4 text-right">
          {ifElse(
            prop("active"),
            always(undefined),
            compose(apply(setActiveButton), of),
          )(record)}
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={flip(addFrom)(record)}
          >
            Create From
          </a>
        </td>
      </tr>
    );
  };
  const toRecordEntries = map(toRecordEntry);
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr> <th scope="col" className="px-6 py-3">
            UID
          </th>
          <th scope="col" className="px-6 py-3">
            Prompt
          </th>
          <th scope="col" className="px-6 py-3">
            Required answers
          </th>
          <th scope="col" className="px-6 py-3">
            keywords
          </th>
          <th scope="col" className="px-6 py-3">
            Created At
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>{toRecordEntries(records)}</tbody>
    </table>
  );
};

export default Table;
