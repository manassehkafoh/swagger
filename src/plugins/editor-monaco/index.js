import MonacoEditorContainer from './components/MonacoEditor/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ValidationTable from './components/ValidationTable/ValidationTable.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import EditorPaneBarTopWrapper from './wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorPaneBarBottomWrapper from './wrap-components/EditorPaneBarBottomWrapper.jsx';
import { appendMarkers } from './actions/append-markers.js';
import { clearMarkers } from './actions/clear-markers.js';
import { setLanguage } from './actions/set-language.js';
import { setMarkers } from './actions/set-markers.js';
import {
  setPosition,
  setPositionStarted,
  setPositionSuccess,
  setPositionFailure,
} from './actions/set-position.js';
import { setTheme } from './actions/set-theme.js';
import reducers from './reducers.js';
import { selectTheme, selectMarkers, selectLanguage, selectEditor } from './selectors.js';
import { registerMarkerDataProvider, waitUntil } from './fn.js';
import { monaco, monacoInitializationDeferred } from './root-injects.js';
import afterLoad from './after-load.js';

const EditorMonacoPlugin = () => ({
  afterLoad,
  rootInjects: {
    monaco,
    monacoInitializationDeferred: () => monacoInitializationDeferred,
  },
  components: {
    Editor: MonacoEditorContainer,
    MonacoEditor: MonacoEditorContainer,
    ValidationPane,
    ValidationTable,
    ThemeSelection: ThemeSelectionIcon,
  },
  wrapComponents: {
    EditorPaneBarTop: EditorPaneBarTopWrapper,
    EditorPaneBarBottom: EditorPaneBarBottomWrapper,
  },
  statePlugins: {
    editor: {
      actions: {
        setTheme,
        setMarkers,
        appendMarkers,
        clearMarkers,
        setLanguage,

        setPosition,
        setPositionStarted,
        setPositionSuccess,
        setPositionFailure,
      },
      reducers,
      selectors: {
        selectTheme,
        selectMarkers,
        selectLanguage,
        selectEditor,
      },
    },
  },
  fn: {
    registerMarkerDataProvider,
    waitUntil,
  },
});

export default EditorMonacoPlugin;
