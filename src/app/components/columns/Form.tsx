import React, {
  useEffect,
  useState,
} from "react";
import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Label,
  Badge,
} from "flowbite-react";
import Select from "react-select";
import classNames from "classnames";
import {
  append,
  apply,
  compose,
  filter,
  curryN,
  flip,
  includes,
  without,
  map,
  objOf,
  is,
  prop,
  propEq,
  path,
  pathOr,
  ifElse,
  isNil,
  of,
  pluck,
  lensPath,
  prepend,
  set,
  nthArg,
  juxt,
  when,
  __,
} from "ramda";
import { ColumnDetail } from "@/app/utils/interfaces";
import { tapLog } from "@/app/utils/log";

// interface FormProps {
//   table: string | undefined;
//   column: string | undefined;
//   record: ColumnDetail | undefined;
//   create: (e: MouseEvent) => void;
//   close: (e: MouseEvent) => void;
// }

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const Form = ({ table, column, record, create, close }) => {
  const [cfg, setCfg] = useState<{ res: ColumnDetail | undefined }>({
    res: undefined,
  });
  const setRes = compose(setCfg, objOf("res"));
  const clearRes = () => setRes({});
  useEffect(() => {
    ifElse(isNil, clearRes, setRes)(record);
  }, [prop("uid", record)]);
  const updateAttr = compose(
    setRes,
    apply(set),
    juxt([
      compose(lensPath, prepend("data"), of, nthArg(1)),
      nthArg(2),
      nthArg(0),
    ])
  );
  const updateResAttr = curryN(3, updateAttr)(cfg.res);
  const addKeyword = (e: MouseEvent) => {
    const keywords = pathOr([], ["res", "data", "keywords"], cfg);
    compose(
      updateResAttr("keywords"),
      flip(append)(keywords),
      path(["target", "value"]),
      tapLog("ORIGIN")
    )(e);
    return e;
  };
  const clearInput = (e: MouseEvent) => {
    e.target.value = "";
  };
  const onEnter = when(propEq("key", "Enter"), compose(clearInput, addKeyword));

  const removeKeyword = compose(
    updateResAttr("keywords"),
    apply(without),
    juxt([compose(of, nthArg(1)), path(["res", "data", "keywords"])])
  );

  const toKeywordBadge = (s: string): ReactNode => (
    <Badge color="info" size="sm" key={s}>
      {s}
      <span className="ml-1">
        <a href="#" onClick={() => removeKeyword(cfg, s)}>
          X
        </a>
      </span>
    </Badge>
  );

  const isNewRecord = compose(is(Number), prop("uid"))(record);

  return (
    <Modal show={!isNil(record)} onClose={close}>
      <Modal.Header>Create</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-4">
          <div className={classNames({ hidden: isNewRecord })}>
            <div className="mb-2 block">
              <Label htmlFor="uid" value="UID" />
            </div>
            <TextInput
              type="text"
              disabled={true}
              defaultValue={prop("uid", record)}
              required={true}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="prompt" value="Prompt" />
            </div>
            <Textarea
              placeholder="Prompt"
              required={true}
              defaultValue={path(["res", "data", "prompt"], cfg)}
              onBlur={compose(
                updateResAttr("prompt"),
                path(["target", "value"])
              )}
              rows={4}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="answers" value="Required Answers" />
            </div>
            <Select
              isMulti
              value={filter(
                compose(
                  flip(includes)(pathOr([], ["res", "data", "answers"], cfg)),
                  prop("value")
                )
              )(options)}
              onChange={compose(
                updateResAttr("answers"),
                pluck("value"),
                nthArg(0)
              )}
              options={options}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="keywords" value="Keywords" />
            </div>
            <TextInput type="text" onKeyUp={onEnter} required={true} />
            <div className="flex flex-wrap mt-2 gap-1">
              {compose(
                map(toKeywordBadge),
                pathOr([], ["res", "data", "keywords"])
              )(cfg)}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={flip(create)(cfg.res)}>Create</Button>
        <Button color="gray" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Form;
