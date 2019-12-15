// @flow
import React from 'react';
import nullthrows from 'nullthrows';
import ReactDOM from 'react-dom';
import './index.css';
import UI from './ui/UI';
import * as serviceWorker from './serviceWorker';
import TranslationWorker from './translation.worker';
import RunWorker from './runCode.worker';

const translationWorker = new TranslationWorker();
async function translate(value: string): Promise<string> {
  return translationWorker.translate(value);
}

const runWorker = new RunWorker();

async function run({
  code,
  input,
}: {
  code: string,
  input: string,
}): Promise<string> {
  if (code === '') {
    return '';
  }
  const codeWithInput = `const $input = eval(${input});\n${code}`;
  return runWorker.runCode(codeWithInput);
}

ReactDOM.render(
  <UI translate={translate} run={run} />,
  nullthrows(
    document.getElementById('root'),
    'HTML is missing the #root element',
  ),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
