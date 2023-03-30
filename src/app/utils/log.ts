import { curryN, tap } from 'ramda';

const log = (identity: string) =>
  curryN(2, console.info)(`--------------------- [${identity}]`);

const tapLog = (identity: string) => tap(log(identity));

export { log, tapLog };
