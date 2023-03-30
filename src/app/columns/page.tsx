"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import {
  addIndex,
  append,
  applySpec,
  compose,
  curry,
  head,
  equals,
  map,
  keys,
  prop,
  propOr,
  flip,
  mergeLeft,
  path,
  isNil,
  __,
} from "ramda";
import Table from "@/app/components/columns/Table";
import { ColumnDetail } from "@/app/utils/interfaces";
import styles from "./page.module.css";
import FloatingMenu from "@/app/components/FloatMenu";

const Columns = () => {
  const [tables, setTables] = useState({});
  const [editing, setEditing] = useState<ColumnDetail | undefined>(undefined);
  const [selectedTable, setSelectedTable] = useState<string | undefined>(
    undefined
  );
  const [selectedColumn, setSelectedColumn] = useState<string | undefined>(
    undefined
  );
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await fetch(
        `/api/tables/${selectedTable}/columns/${selectedColumn}`
      ).then((res) => res.json());
      setRecords(res);
    };
    if (!isNil(selectedTable) && !isNil(selectedColumn)) {
      fetchRecords();
    }
  }, [selectedTable, selectedColumn]);

  useEffect(() => {
    const initial = async () => {
      const res = await fetch("/api/tables").then((res) => res.json());
      const data = prop("data", res);
      setTables(data);
      const table: string = compose(head, keys)(data);
      setSelectedTable(table);
      const column: string = compose(head, prop(table))(data);
      setSelectedColumn(column);
    };
    initial();
  }, []);

  const create = async (e: MouseEvent, record: ColumnDetail) => {
    e.preventDefault();
    const data = prop("data")(record);
    const res = await fetch(
      `/api/tables/${selectedTable}/columns/${selectedColumn}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());
    compose(setRecords, flip(append)(records))(res);
    setEditing(undefined);
  };

  console.log("------------", tables);

  const toTableEntry = (tableName: string): ReactNode => (
    <li key={tableName} className="mr-2">
      <a
        href="#"
        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      >
        {tableName}
      </a>
    </li>
  );

  const changeColumn = (e: MouseEvent) => {
    e.preventDefault();

    compose(setSelectedColumn, path(["target", "dataset", "column"]))(e);
  };

  // "w-full px-4 py-2 font-medium text-left border-b border-gray-200 rounded-t-lg cursor-pointer focus:outline-none dark:bg-gray-800 dark:border-gray-600"
  // "w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
  const isSelectedColumn = equals(selectedColumn);
  const toColumnEntry = (columnName: string, index: integer): ReactNode => (
    <button
      key={columnName}
      aria-current={`${isSelectedColumn(columnName)}`}
      type="button"
      data-column={columnName}
      className={classNames(
        "w-full px-4 py-2 font-medium text-left border-b border-gray-200 cursor-pointer focus:outline-none dark:bg-gray-800 dark:border-gray-600",
        applySpec({
          "text-white": isSelectedColumn,
          "bg-blue-700": isSelectedColumn,
        })(columnName),
        { "rounded-t-lg": false, "rounded-b-lg": false }
      )}
      onClick={changeColumn}
    >
      {columnName}
    </button>
  );

  const add = (e: MouseEvent) => {
    e.preventDefault();
    setEditing({
      uid: new Date().getTime(),
    });
  };

  const addFrom = (e: MouseEvent, record: ColumnDetail) => {
    e.preventDefault();
    compose(setEditing, mergeLeft({ uid: new Date().getTime() }))(record);
  };

  const tableList = compose(map(toTableEntry), keys)(tables);

  const columnList = compose(addIndex(map)(toColumnEntry), curry(propOr)([]))(
    selectedTable,
    tables
  );

  return (
    <div className="min-h-full">
      <div className="p-5 bg-white">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">{tableList}</ul>
        </div>
        <div className="flex py-4">
          <div
            className={classNames(
              styles.columns,
              "w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            )}
          >
            {columnList}
          </div>
          <div className="flex-1 ml-4 relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table
              table={selectedTable}
              column={selectedColumn}
              records={records}
              addFrom={addFrom}
            />
          </div>
        </div>
      </div>
      <FloatingMenu handleClick={add} />
    </div>
  );
};

export default Columns;
