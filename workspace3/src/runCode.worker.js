// @flow

import MetaCoffee from './metacoffee/metacoffee';

export async function runCode(code: string): Promise<string> {
  try {
    MetaCoffee.installRuntime(global);
    // eslint-disable-next-line no-eval
    return String(eval(code));
  } catch (e) {
    return e.message;
  }
}
