"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { Alert } from "flowbite-react";
import classNames from "classnames";
import dayjs from "dayjs";
import {
  addIndex,
  anyPass,
  append,
  applySpec,
  apply,
  compose,
  curry,
  flip,
  head,
  isEmpty,
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
import Link from "next/link";
import { ColumnDetail, ColumnSample } from "@/app/utils/interfaces";
import { isBlank } from "@/app/utils/common";

interface TableProps {
  evaluate: (record: ColumnSample) => void;
  payloads: ColumnSample[];
}

const Table = ({ payloads, evaluate }) => {
  const toRecordEntry = (record: ColumnDetail) => {
    const attr = flip(prop)(record);
    return (
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        key={record.uid}
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {attr("uid")}
        </th>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {attr("table")}
        </th>
        <td className="px-6 py-4">{attr("column")}</td>
        <td className="px-6 py-4">{attr("count")}</td>
        <td className="px-6 py-4">
          {dayjs(attr("created_at") * 1000).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="px-6 py-4 text-right">
          <Link
            passHref
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            href={`/samples/${attr('uid')}`}
          >
            Evaluate
          </Link>
        </td>
      </tr>
    );
  };

  const toRecordEntries = unless(isBlank, map(toRecordEntry));
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            UID
          </th>
          <th scope="col" className="px-6 py-3">
            Table
          </th>
          <th scope="col" className="px-6 py-3">
            Column
          </th>
          <th scope="col" className="px-6 py-3">
            Count
          </th>
          <th scope="col" className="px-6 py-3">
            Created At
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>{toRecordEntries(payloads)}</tbody>
    </table>
  );
};

export default Table;
