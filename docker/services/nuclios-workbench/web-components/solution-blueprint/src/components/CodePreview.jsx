import Editor, { loader } from "@monaco-editor/react";
import PropTypes from "prop-types";

loader.config({
  paths: {
    vs: "/monaco-editor/min/vs",
  },
});

const CodePreview = ({ content, fileType }) => {
  if (fileType && fileType === "ipynb") {
    loader.config({
      paths: {
        vs: "/monaco-editor/vs",
      },
    });
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="python"
      defaultValue={content}
      options={{
        readOnly: true,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};

CodePreview.propTypes = {
  content: PropTypes.any,
  fileType: PropTypes.any,
};

export default CodePreview;
