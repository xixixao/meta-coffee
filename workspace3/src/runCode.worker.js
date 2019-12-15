export async function runCode(code: string): Promise<string> {
  try {
    // eslint-disable-next-line no-eval
    return String(eval(code));
  } catch (e) {
    return e.message;
  }
}
