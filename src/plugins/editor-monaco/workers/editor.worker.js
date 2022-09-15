import { initialize } from 'monaco-editor/esm/vs/editor/editor.worker.js';

const EditorWorker = null;

const create = () => EditorWorker;

globalThis.onmessage = () => {
  initialize(() => {
    return create();
  });
};

export { create, initialize, EditorWorker };
