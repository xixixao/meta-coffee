// @flow
import * as React from 'react';
import {forwardRef, useRef, useEffect, useState} from 'react';
import MonacoEditor from 'react-monaco-editor';

function App(props: {
  translate: string => Promise<string>,
  run: ({code: string, input: string}) => Promise<string>,
}): React.Node {
  const [code, setCode] = useState('');
  const [translation, setTranslation] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const {translate, run} = props;
  useEffect(() => {
    (async () => {
      setTranslation(await translate(code));
    })();
  }, [code, setTranslation, translate]);
  useEffect(() => {
    (async () => {
      setResult(await run({code: translation, input}));
    })();
  }, [translation, input, setResult, run]);
  return (
    <Column>
      <Row size={3}>
        <ResizingEditor onChange={setCode} value={code} />
        <ResizingEditor options={{readOnly: true}} value={translation} />
      </Row>
      <Row size={1}>
        <ResizingEditor onChange={setInput} value={input} />
        <ResizingEditor options={{readOnly: true}} value={result} />
      </Row>
    </Column>
  );
}

const ResizingEditor = forwardRef((props, ref: any) => {
  const ownEditorRef = useRef();
  const editorRef = ref ?? ownEditorRef;
  useWindowResize(() => {
    editorRef.current.editor.layout();
  });
  const {options = {}, ...otherProps} = props;
  return (
    <MonacoEditor
      ref={editorRef}
      language=""
      options={{
        fontSize: '14px',
        fontFamily: 'Monaco, Menlo',
        ...options,
      }}
      theme="vs-dark"
      {...otherProps}
    />
  );
});

function useWindowResize(callback: () => void): void {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  });
}

type ContainerComponent = (props: {
  children: React.ChildrenArray<React.Element<any>>,
  size?: number,
}) => React.Node;

function createContainerComponent(
  direction: 'row' | 'column',
): ContainerComponent {
  function isLayoutElement(child: React.Element<any>) {
    return child.type.isLayout;
  }
  const component = props => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: direction,
          flex: props.size ?? 1,
          // justifyContent: 'space-between',
        }}>
        {React.Children.map(props.children, child =>
          isLayoutElement(child) ? child : <div style={{flex: 1}}>{child}</div>,
        )}
      </div>
    );
  };
  component.isLayout = true;
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  component.displayName = capitalize(direction);
  return component;
}

const Row = createContainerComponent('row');
const Column = createContainerComponent('column');

export default App;
