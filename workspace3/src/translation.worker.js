// @flow

import MetaCoffee from './metacoffee/metacoffee';

export async function translate(code: string): Promise<string> {
  return MetaCoffee.compile(code, {bare: true});
}
