import deepMerge from "deepmerge"
import SwaggerUI from "swagger-ui"
import EditorLayout from "./layout"
import "swagger-ui/dist/swagger-ui.css"

import EditorPlugin from "./plugins/editor"
import LocalStoragePlugin from "./plugins/local-storage"
import ValidationApiPlugin from "./plugins/validation/apis"
import EditorAutosuggestPlugin from "./plugins/editor-autosuggest"
import EditorAutosuggestSnippetsPlugin from "./plugins/editor-autosuggest-snippets"
import EditorAutosuggestKeywordsPlugin from "./plugins/editor-autosuggest-keywords"
import EditorAutosuggestRefsPlugin from "./plugins/editor-autosuggest-refs"

const plugins = {
  EditorPlugin,
  ValidationApiPlugin,
  LocalStoragePlugin,
  EditorAutosuggestPlugin,
  EditorAutosuggestSnippetsPlugin,
  EditorAutosuggestKeywordsPlugin,
  EditorAutosuggestRefsPlugin,
}

// eslint-disable-next-line no-undef
const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION } = buildInfo

window.versions = window.versions || {}
window.versions.swaggerEditor = `${PACKAGE_VERSION}/${GIT_COMMIT || "unknown"}${GIT_DIRTY ? "-dirty" : ""}`

const defaults = {
  dom_id: "#swagger-editor", // eslint-disable-line camelcase, we have this prop for legacy reasons.
  layout: "EditorLayout",
  presets: [
    SwaggerUI.presets.apis
  ],
  plugins: Object.values(plugins),
  components: {
    EditorLayout
  },
}

module.exports = function SwaggerEditor(options) {
  let mergedOptions = deepMerge(defaults, options)

  mergedOptions.presets = defaults.presets.concat(options.presets || [])
  mergedOptions.plugins = defaults.plugins.concat(options.plugins || [])
  return SwaggerUI(mergedOptions)
}

module.exports.plugins = plugins
