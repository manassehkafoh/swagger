import React from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
/**
 * Plugins
 */
import LayoutPlugin from 'plugins/layout/index.js';
import SplashScreenPlugin from 'plugins/splash-screen/index.js';
import TopBarPlugin from 'plugins/top-bar/index.js';
import ModalsPlugin from 'plugins/modals/index.js';
import DialogsPlugin from 'plugins/dialogs/index.js';
import DropdownMenuPlugin from 'plugins/dropdown-menu/index.js';
import DropzonePlugin from 'plugins/dropzone/index.js';
import VersionsPlugin from 'plugins/versions/index.js';
import EditorTextareaPlugin from 'plugins/editor-textarea/index.js';
import EditorMonacoPlugin from 'plugins/editor-monaco/index.js';
import EditorMonacoLanguageApiDOMPlugin from 'plugins/editor-monaco-language-apidom/index.js';
import EditorPreviewPlugin from 'plugins/editor-preview/index.js';
import EditorPreviewSwaggerUIPlugin from 'plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from 'plugins/editor-preview-asyncapi/index.js';
import EditorPreviewApiDesignSystemsPlugin from 'plugins/editor-preview-api-design-systems/index.js';
import EditorContentReadOnlyPlugin from 'plugins/editor-content-read-only/index.js';
import EditorContentOriginPlugin from 'plugins/editor-content-origin/index.js';
import EditorContentTypePlugin from 'plugins/editor-content-type/index.js';
import EditorContentPersistencePlugin from 'plugins/editor-content-persistence/index.js';
import EditorContentFixturesPlugin from 'plugins/editor-content-fixtures/index.js';
import EditorSafeRenderPlugin from 'plugins/editor-safe-render/index.js';
import SwaggerUIAdapterPlugin from 'plugins/swagger-ui-adapter/index.js';
/**
 * Presets
 */
import TextareaPreset from 'presets/textarea/index.js';
import MonacoPreset from 'presets/monaco/index.js';

import './styles/main.scss';

const SwaggerEditor = React.memo((props) => {
  const mergedProps = deepmerge(SwaggerEditor.defaultProps, props);

  return (
    <div className="swagger-editor">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <SwaggerUI {...mergedProps} />
    </div>
  );
});

SwaggerEditor.plugins = {
  Modals: ModalsPlugin,
  Dialogs: DialogsPlugin,
  DropdownMenu: DropdownMenuPlugin,
  Dropzone: DropzonePlugin,
  Versions: VersionsPlugin,
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorMonacoLanguageApiDOM: EditorMonacoLanguageApiDOMPlugin,
  EditorContentReadOnly: EditorContentReadOnlyPlugin,
  EditorContentOrigin: EditorContentOriginPlugin,
  EditorContentType: EditorContentTypePlugin,
  EditorContentPersistence: EditorContentPersistencePlugin,
  EditorContentFixtures: EditorContentFixturesPlugin,
  EditorPreview: EditorPreviewPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  EditorPreviewApiDesignSystems: EditorPreviewApiDesignSystemsPlugin,
  EditorSafeRender: EditorSafeRenderPlugin,
  TopBar: TopBarPlugin,
  SplashScreenPlugin,
  Layout: LayoutPlugin,
  SwaggerUIAdapter: SwaggerUIAdapterPlugin,
};
SwaggerEditor.presets = {
  textarea: TextareaPreset,
  monaco: MonacoPreset,
  default: MonacoPreset,
};

SwaggerEditor.propTypes = SwaggerUI.propTypes;

SwaggerEditor.defaultProps = {
  ...SwaggerUI.defaultProps,
  layout: 'SwaggerEditorLayout',
  presets: [SwaggerEditor.presets.default],
  showExtensions: true,
};

export default SwaggerEditor;
