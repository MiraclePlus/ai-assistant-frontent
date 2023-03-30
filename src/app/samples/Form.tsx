"use client";

import React, { useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import Select from "react-select";
import { ColumnSample } from "@/app/utils/interfaces";
import { log, tapLog } from "@/app/utils/log";
import {
  compose,
  apply,
  set,
  juxt,
  lensProp,
  path,
  prop,
  nthArg,
  curryN,
  flip,
} from "ramda";

interface FormProps {
  show: boolean;
  create: (e: MouseEvent, sample: ColumnSample) => void;
  close: (e: MouseEvent) => void;
}

const tableOptions = [{ value: "founder_features", label: "founder_features" }];

const columnOptions = [
  { value: "phd", label: "phd" },
  { value: "professor", label: "professor" },
  { value: "top_college", label: "top_college" },
];

const Form = ({ show, close, create }) => {
  const [sample, setSample] = useState<ColumnSample>({});
  const updateAttr = compose(
    setSample,
    apply(set),
    juxt([compose(lensProp, nthArg(1)), nthArg(2), nthArg(0)])
  );
  const updateSampleAttr = curryN(3, updateAttr)(sample);
  return (
    <Modal show={show} onClose={close}>
      <Modal.Header>Create Sample</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="table" value="Table" />
            </div>
            <Select
              onChange={compose(updateSampleAttr("table"), prop("value"))}
              options={tableOptions}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="column" value="Column" />
            </div>
            <Select
              onChange={compose(updateSampleAttr("column"), prop("value"))}
              options={columnOptions}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="count" value="Count" />
            </div>
            <TextInput
              type="number"
              onChange={compose(
                updateSampleAttr("count"),
                path(["target", "value"])
              )}
              required={true}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={flip(create)(sample)}>Create</Button>
        <Button color="gray" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Form;
