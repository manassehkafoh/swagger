import EditorPreviewPane from './components/EditorPreviewPane.jsx';
import EditorPreviewFallback from './components/EditorPreviewFallback.jsx';

const EditorPreviewPlugin = () => ({
  components: {
    EditorPreviewPane,
    EditorPreview: EditorPreviewFallback,
  },
});

export default EditorPreviewPlugin;
