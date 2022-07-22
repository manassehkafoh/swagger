import { useImperativeHandle, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';

import ConvertToJSONMenuItemHandler from './items/ConvertToJSONMenuItemHandler.jsx';
import ConvertToYAMLMenuItemHandler from './items/ConvertToYAMLMenuItemHandler.jsx';
import CovertToOpenAPI30xMenuItemHandler from './items/ConvertToOpenAPI30xMenuItemHandler.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const EditMenuHandler = forwardRef((props, ref) => {
  const { editorActions, editorContentFixturesSelectors } = props;
  const convertToJSONMenuItemHandler = useRef(null);
  const convertToYAMLMenuItemHandler = useRef(null);
  const convertToOpenAPI30xMenuItemHandler = useRef(null);

  useImperativeHandle(ref, () => ({
    clear() {
      editorActions.clearContent();
    },
    async convertToJSON() {
      await convertToJSONMenuItemHandler.current.convertToJSON();
    },
    async convertToYAML() {
      await convertToYAMLMenuItemHandler.current.convertToYAML();
    },
    async convertOpenAPI20ToOpenAPI30xClick() {
      await convertToOpenAPI30xMenuItemHandler.current.convert();
    },
    loadOpenAPI20Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI20JSON();
      editorActions.setContent(content, 'fixture-load');
    },
    loadOpenAPI30Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI303JSON();
      editorActions.setContent(content, 'fixture-load');
    },
    loadOpenAPI31Fixture() {
      const content = editorContentFixturesSelectors.selectOpenAPI310JSON();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI24Fixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI240JSON();
      editorActions.setContent(content, 'fixture-load');
    },
    loadAsyncAPI24PetstoreFixture() {
      const content = editorContentFixturesSelectors.selectAsyncAPI240PetstoreJSON();
      editorActions.setContent(content, 'fixture-load');
    },
  }));

  return (
    <>
      <ConvertToJSONMenuItemHandler ref={convertToJSONMenuItemHandler} {...props} />
      <ConvertToYAMLMenuItemHandler ref={convertToYAMLMenuItemHandler} {...props} />
      <CovertToOpenAPI30xMenuItemHandler ref={convertToOpenAPI30xMenuItemHandler} {...props} />
    </>
  );
});

EditMenuHandler.propTypes = {
  editorActions: PropTypes.shape({
    clearContent: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
  }).isRequired,
  editorContentFixturesSelectors: PropTypes.shape({
    selectOpenAPI20JSON: PropTypes.func.isRequired,
    selectOpenAPI303JSON: PropTypes.func.isRequired,
    selectOpenAPI310JSON: PropTypes.func.isRequired,
    selectAsyncAPI240JSON: PropTypes.func.isRequired,
    selectAsyncAPI240PetstoreJSON: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditMenuHandler;
