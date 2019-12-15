// @flow
import React, {type Node} from 'react';
import Head from 'next/head';
import MonacoEditor from 'react-monaco-editor';

type Props = {
  children: Node,
  title?: string,
};

// onChange={::this.onChange}
// editorDidMount={::this.editorDidMount}

export default ({children, title = 'This is the default title'}: Props) => (
  <section>
    <Head>
      <title>{title}</title>
    </Head>
    <MonacoEditor
      width="800"
      height="600"
      language="javascript"
      theme="vs-dark"
      value="something something"
      options={{
        selectOnLineNumbers: true,
      }}
    />
  </section>
);
