// @flow
import * as React from 'react';
import {forwardRef, useRef, useEffect, useState} from 'react';
import MonacoEditor from 'react-monaco-editor';

const EditorConfig = (props: {|
  defaultValue?: string,
  language?: string,
  name: string,
|}) => null;
export const Editor = EditorConfig;

function App(props: {
  children: Array<React.Element<typeof EditorConfig>>,
  translate: string => Promise<string>,
  run: string => Promise<string>,
}): React.Node {
  const [codeEditor, translationEditor, resultEditor] = props.children;
  const [code, setCode] = useState(codeEditor.props.defaultValue ?? '');
  const [translation, setTranslation] = useState(
    translationEditor.props.defaultValue ?? '',
  );
  const [result, setResult] = useState(resultEditor.props.defaultValue ?? '');
  const {translate, run} = props;
  useEffect(() => {
    (async () => {
      setTranslation(await translate(code));
    })();
  }, [code, setTranslation, translate]);
  useEffect(() => {
    (async () => {
      setResult(await run(translation));
    })();
  }, [translation, setResult, run]);
  return (
    <Row>
      <LayoutChild>
        <EditorWithLabel
          onChange={setCode}
          value={code}
          {...codeEditor.props}
        />
      </LayoutChild>
      <Column>
        <LayoutChild size={3}>
          <EditorWithLabel
            options={{readOnly: true}}
            value={translation}
            {...translationEditor.props}
          />
        </LayoutChild>
        <LayoutChild size={1}>
          <EditorWithLabel
            options={{readOnly: true}}
            size={1}
            value={result}
            {...resultEditor.props}
          />
        </LayoutChild>
      </Column>
    </Row>
  );
}

const EditorWithLabel = forwardRef((props, ref) => {
  const {name, ...otherProps} = props;
  return (
    <Column style={{border: '1px solid black'}}>
      <EditorLabel>{props.name}</EditorLabel>
      <ResizingEditor ref={ref} {...otherProps} />
    </Column>
  );
});

function EditorLabel(props) {
  return (
    <div
      style={{
        background: '#666',
        color: 'white',
        padding: 4,
      }}>
      {props.children}
    </div>
  );
}

const ResizingEditor = forwardRef((props, ref: any) => {
  const ownEditorRef = useRef();
  const editorRef = ref ?? ownEditorRef;
  useWindowResize(() => {
    editorRef.current.editor.layout();
  });
  const {options = {}, ...otherProps} = props;
  // return <div style={{width: 500}} />;
  return (
    <MonacoEditor
      ref={editorRef}
      language=""
      options={{
        fontSize: '14px',
        fontFamily: 'Monaco, Menlo',
        minimap: {enabled: false},
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

type LayoutComponent = (props: {
  children: React.Node,
  style?: $Shape<CSSStyleDeclaration>,
  size?: number,
}) => React.Node;

function createLayoutComponent(): LayoutComponent {
  return props => {
    return (
      <div
        style={{
          ...props.style,
          display: 'flex',
          flex: props.size ?? 1,
        }}>
        {props.children}
      </div>
    );
  };
}

type LayoutProps = {|
  style?: $Shape<CSSStyleDeclaration>,
  size?: number,
|};

type ContainerProps = {|
  ...LayoutProps,
  children: React.ChildrenArray<React.Element<any>>,
|};

function Row(props: ContainerProps) {
  return (
    <div style={{...layoutProps(props), flexDirection: 'row'}}>
      {props.children}
    </div>
  );
}

function Column(props: ContainerProps) {
  return (
    <div style={{...layoutProps(props), flexDirection: 'column'}}>
      {props.children}
    </div>
  );
}

function LayoutChild(props: {|...LayoutProps, children: React.Node|}) {
  return <div style={layoutProps(props)}>{props.children}</div>;
}

function layoutProps(props: {...LayoutProps}) {
  return {
    ...props.style,
    display: 'flex',
    overflow: 'auto',
    flex: props.size ?? 1,
  };
}

export default App;
