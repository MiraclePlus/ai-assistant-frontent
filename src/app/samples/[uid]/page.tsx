"use client";

import React, { useEffect, useState } from "react";
import { ColumnSampleEntry } from "@/app/utils/interfaces";
import { Accordion, Progress } from "flowbite-react";
import {
  compose,
  mapObjIndexed,
  propOr,
  values,
  map,
  unless,
  multiply,
  invoker,
  flip,
  when,
  propEq,
  always,
  path,
  tap,
  juxt,
  apply,
  divide,
  prop,
  filter,
  includes,
  length,
  isNil,
  ifElse,
} from "ramda";
import { isBlank } from "@/app/utils/common";
import { log, tapLog } from "@/app/utils/log";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import styled from "styled-components";

const Synced = styled.div`
  display: contents;
  color: #8bc34a;
`;

const Title = styled(Accordion.Title)`
  > h2 {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
`;

const Actions = styled.div`
  margin: 1rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Action = styled.a`
  display: flex;
  cursor: pointer;
  font-size: 4rem;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`;

const PositiveAction = styled(Action)`
  color: #00c853;
`;

const NegativeAction = styled(Action)`
  color: #d50000;
`;

const ProgressContainer = styled.div`
  position: fixed;
  bottom: 4rem;
  width: -webkit-fill-available;
  z-index: 999;
`;

const Page = ({ params }) => {
  const { uid } = params;
  const [data, setData] = useState<ColumnSampleEntry[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [evaluating, setEvaluating] = useState<Set<string>>(new Set());
  const initial = async () => {
    const res = await fetch(`/api/samples/${uid}/entries`).then((res) =>
      res.json()
    );

    updateData(res);
  };

  const nextAvailable = () =>
    document.querySelector(
      "div[data-testid=flowbite-accordion-content][data-judged=false]"
    );
  const next = (direction: string = "nextElementSibling") => {
    console.log('-----------------', direction);
    
    compose(
      unless(
        isNil,
        compose(
          unless(
            isNil,
            compose(invoker(0, "click"), tap(invoker(0, "scrollIntoView")))
          ),
          prop(direction)
        )
      ),
      tapLog("target"),
      nextAvailable
    )()
  }

  useEffect(() => {
    initial();
    setTimeout(() => {
      console.log("==================================", nextAvailable());
      next("previousElementSibling");
    }, 4000);
  }, [uid]);

  const judged = compose(flip(includes)([0, 1]), prop("judgement"));

  const calculateProgress = compose(
    setProgress,
    apply(divide),
    juxt([compose(parseFloat, length, filter(judged)), length])
  );

  const updateData = compose(setData, tap(calculateProgress));

  const judge = async (entryUid: string, judgement: number) => {
    await fetch(`/api/samples/${uid}/entries/${entryUid}`, {
      method: "POST",
      body: JSON.stringify({ judgement }),
    })
      .then((res) => res.json())
      .then((entry) => {
        compose(
          updateData,
          map(when(propEq("uid", entryUid), always(entry)))
        )(data);
      });
  };

  // console.log("====================", progress);

  const positive = (e: MouseEvent, entryUid: string) => {
    e.preventDefault();
    judge(entryUid, 1);
  };

  const negative = (e: MouseEvent, entryUid: string) => {
    e.preventDefault();
    judge(entryUid, 0);
  };

  const doJudge = (
    fn: (e: MouseEvent, entryUid: string) => void,
    entry: ColumnSampleEntry
  ) => compose(flip(fn)(entry.uid), tap(() => next()));

  const toAnswer = (answer: string, question: string) => (
    <div className="mb-2" key={`${question}-${new Date().getTime()}`}>
      <p className="mb-2 font-semibold text-gray-500 dark:text-gray-400">
        {question}:
      </p>
      <p className="text-gray-500 dark:text-gray-400">{answer}</p>
    </div>
  );

  const synced = ifElse(
    judged,
    () => (
      <Synced>
        <CloudDoneIcon fontSize="small" color="inherit" />
      </Synced>
    ),
    always(undefined)
  );

  const toEntry = (entry: ColumnSampleEntry) => (
    <Accordion.Panel key={entry.uid}>
      <Title>
        <div>{entry.pk_id}</div>
        {synced(entry)}
      </Title>
      <Accordion.Content data-pkid={entry.pk_id} data-judged={judged(entry)}>
        {compose(values, mapObjIndexed(toAnswer), propOr({}, "answers"))(entry)}

        <Actions>
          <PositiveAction onClick={doJudge(positive, entry)}>
            <CheckCircleIcon fontSize="inherit" color="inherit" />
          </PositiveAction>
          <NegativeAction onClick={doJudge(negative, entry)}>
            <CancelIcon fontSize="inherit" color="inherit" />
          </NegativeAction>
        </Actions>
      </Accordion.Content>
    </Accordion.Panel>
  );

  const progressPercentage = compose(invoker(1, "toFixed")(2), multiply(100));
  // console.log("-------------", progressPercentage(progress));

  const ProgressNode = () => (
    <ProgressContainer className="mx-4">
      <Progress
        progress={progressPercentage(progress)}
        labelProgress={true}
        progressLabelPosition="inside"
        size="lg"
      />
    </ProgressContainer>
  );

  return (
    <div className="min-h-full">
      <div id="judgements-container" className="p-5 bg-white">
        <Accordion flush={true}>
          {unless(isBlank, map(toEntry))(data)}
        </Accordion>
      </div>
      <ProgressNode />
    </div>
  );
};

export default Page;
