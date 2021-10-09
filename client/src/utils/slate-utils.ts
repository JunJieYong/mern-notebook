import { Editor } from 'slate';

export function withVerbose(editor: Editor): Editor {
  const {
    isInline,
    isVoid,
    normalizeNode,
    onChange,
    addMark,
    apply,
    deleteBackward,
    deleteForward,
    deleteFragment,
    getFragment,
    insertBreak,
    insertFragment,
    insertNode,
    insertText,
    removeMark,
  } = editor;

  (window as any).verboseEditor = editor;

  editor.isInline = (...args) => {
    console.log(`isInline`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return isInline(...args);
  };

  editor.isVoid = (...args) => {
    console.log(`isVoid`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return isVoid(...args);
  };

  editor.normalizeNode = (...args) => {
    console.log(`normalizeNode`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return normalizeNode(...args);
  };

  editor.onChange = (...args) => {
    console.log(`onChange`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return onChange(...args);
  };

  editor.addMark = (...args) => {
    console.log(`addMark`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return addMark(...args);
  };

  editor.apply = (...args) => {
    console.log(`apply`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return apply(...args);
  };

  editor.deleteBackward = (...args) => {
    console.log(`deleteBackward`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return deleteBackward(...args);
  };

  editor.deleteForward = (...args) => {
    console.log(`deleteForward`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return deleteForward(...args);
  };

  editor.deleteFragment = (...args) => {
    console.log(`deleteFragment`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return deleteFragment(...args);
  };

  editor.getFragment = (...args) => {
    console.log(`getFragment`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return getFragment(...args);
  };

  editor.insertBreak = (...args) => {
    console.log(`insertBreak`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return insertBreak(...args);
  };

  editor.insertFragment = (...args) => {
    console.log(`insertFragment`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return insertFragment(...args);
  };

  editor.insertNode = (...args) => {
    console.log(`insertNode`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return insertNode(...args);
  };

  editor.insertText = (...args) => {
    console.log(`insertText`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return insertText(...args);
  };

  editor.removeMark = (...args) => {
    console.log(`removeMark`, ...args);
    (window as any).verboseArgs = args;
    debugger;
    return removeMark(...args);
  };

  return editor;
}
