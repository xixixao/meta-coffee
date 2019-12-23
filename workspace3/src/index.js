// @flow

import React from 'react';
import nullthrows from 'nullthrows';
import ReactDOM from 'react-dom';
import './index.css';
import UI, {Editor} from './ui/UI';
import * as serviceWorker from './serviceWorker';
// $FlowFixMe
import TranslationWorker from './translation.worker';
// $FlowFixMe
import RunWorker from './runCode.worker';
import {
  loadFromCrossSessionStorage,
  saveToCrossSessionStorage,
} from './Storage';

function saveLastUsed(code: string): void {
  saveToCrossSessionStorage({lastUsed: code});
}

const translationWorker = new TranslationWorker();
async function translate(value: string): Promise<string> {
  saveLastUsed(value);
  return translationWorker.translate(value);
}

const runWorker = new RunWorker();

async function run(code: string): Promise<string> {
  if (/^\s*$/.test(code)) {
    return '';
  }
  return runWorker.runCode(code);
}

const lastSessionCode = loadFromCrossSessionStorage().lastUsed;

ReactDOM.render(
  <UI translate={translate} run={run}>
    <Editor
      defaultValue={lastSessionCode}
      name="MetaCoffee"
      language="coffeescript"
    />
    <Editor name="JS" language="javascript" />
    <Editor name="Result" />
  </UI>,
  nullthrows(
    document.getElementById('root'),
    'HTML is missing the #root element',
  ),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
