import { uuid } from 'uuidv4';

export const createUid = (): string => {
  return uuid().split('-', 1)[0];
};
