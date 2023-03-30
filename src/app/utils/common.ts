
import { anyPass, isNil, isEmpty } from 'ramda';

const isBlank = anyPass([isNil, isEmpty]);

export {
  isBlank
};
