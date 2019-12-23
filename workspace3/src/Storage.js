// @flow

import deepmerge from 'deepmerge';

type SavedData = {
  lastUsed: string,
};

const DEFAULT_DATA = {
  lastUsed: '',
};

const DATA_KEY = 'MetaCofeeDATA_KEY_1';

export function loadFromCrossSessionStorage(): SavedData {
  const savedData = window.localStorage.getItem(DATA_KEY);
  if (savedData != null) {
    return JSON.parse(savedData);
  }
  return DEFAULT_DATA;
}

export function saveToCrossSessionStorage(newData: $Shape<SavedData>): void {
  const currentData = loadFromCrossSessionStorage();
  window.localStorage.setItem(
    DATA_KEY,
    JSON.stringify(mergeObjectsReplacingArrays(currentData, newData)),
  );
}

const MERGE_CONFIG = {arrayMerge: (_, newArray) => newArray};
function mergeObjectsReplacingArrays(target, overrides) {
  return deepmerge(target, overrides, MERGE_CONFIG);
}
