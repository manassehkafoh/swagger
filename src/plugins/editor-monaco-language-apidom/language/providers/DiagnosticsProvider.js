import * as monaco from 'monaco-editor';
import { languages as vscodeLanguages } from 'vscode';
import { onExtHostInitialized } from 'vscode/extensions';

import Provider from './Provider.js';
import * as apidom from '../apidom.js';

class DiagnosticsProvider extends Provider {
  #listener = [];

  #disposables = [];

  #diagnosticCollection = null;

  constructor(...args) {
    super(...args);

    const onModelAdded = (model) => {
      if (model.getLanguageId() !== apidom.languageId) {
        return;
      }

      let handle;
      const changeSubscription = model.onDidChangeContent(() => {
        /**
         * Here we are Debouncing the user changes, so everytime a new change is done,
         * we wait some time before validating, otherwise if the user is still typing, we cancel the change.
         */
        clearTimeout(handle);
        handle = setTimeout(() => this.#validate(model), 300);
      });

      this.#listener[model.uri.toString()] = {
        dispose() {
          changeSubscription.dispose();
          clearTimeout(handle);
        },
      };

      this.#validate(model);
    };

    const onModelRemoved = (model) => {
      this.#diagnosticCollection.set(model.uri, []);
      const key = model.uri.toString();
      if (this.#listener[key]) {
        this.#listener[key].dispose();
        delete this.#listener[key];
      }
    };

    const onModelLanguageChanged = (model) => {
      const key = model.uri.toString();
      const hasChangedToApiDOM = model.getLanguageId() === apidom.languageId;
      const isModelSubscribed = !!this.#listener[key];

      if (!isModelSubscribed && hasChangedToApiDOM) {
        onModelAdded(model);
      } else if (isModelSubscribed && !hasChangedToApiDOM) {
        onModelRemoved(model);
      }
    };

    const onVscodeExtensionsInitialized = () => {
      this.#diagnosticCollection = vscodeLanguages.createDiagnosticCollection(apidom.languageId);
      this.#disposables.push(this.#diagnosticCollection);
    };

    this.#disposables.push(monaco.editor.onDidCreateModel(onModelAdded));
    this.#disposables.push(monaco.editor.onDidChangeModelLanguage(onModelLanguageChanged));
    this.#disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
    onExtHostInitialized(onVscodeExtensionsInitialized);
  }

  async #getDiagnostics(model) {
    const worker = await this.worker(model.uri);

    if (model.isDisposed()) {
      // model was disposed in the meantime
      return undefined;
    }

    try {
      return await worker.doValidation(model.uri.toString());
    } catch {
      return undefined;
    }
  }

  async #validate(model) {
    const diagnostics = await this.#getDiagnostics(model);

    this.#diagnosticCollection.set(
      model.uri,
      await this.protocolConverter.asDiagnostics(diagnostics)
    );
  }

  dispose() {
    super.dispose();
    this.#disposables.forEach((disposable) => disposable?.dispose());
    this.#disposables = [];
  }
}

export default DiagnosticsProvider;
