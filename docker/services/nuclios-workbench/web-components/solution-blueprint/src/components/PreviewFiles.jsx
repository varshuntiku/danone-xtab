import { useEffect, useState } from "react";
import CodePreview from "src/components/CodePreview";
import { previewFile } from "src/services/util";
import sanitizeHtml from "sanitize-html-react";
import PropTypes from "prop-types";
import CodxCircularLoader from "src/components/CodxCircularLoader";
const PreviewComponent = ({ fileShare, filePath, file }) => {
  const [localFile, setLocalFile] = useState(file || {});
  const [loading, setLoading] = useState(true);

  const previewFileFunc = async () => {
    setLoading(true);
    try {
      const response = await previewFile({
        filePath: filePath,
        fileShare: fileShare,
      });
      const file_data = response?.file_content;
      setLoading(false);
      if (!file_data?.data) {
        setLocalFile({
          name: response?.file_name,
          content: sanitizeHtml(file_data),
        });
        return;
      }
      setLocalFile({
        name: response?.file_name,
        content: sanitizeHtml(file_data.data),
      });
    } catch (error) {
      console.error(error);
      setLocalFile({
        name: "Error",
        content: "Error fetching file content",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (fileShare && filePath) {
      previewFileFunc();
    }
  }, [fileShare, filePath]);

  if (loading) {
    return (
      <div className="loading">
        <CodxCircularLoader size={25} />
        Loading...
      </div>
    );
  }

  const getFileExtension = (filename) =>
    filename?.split(".").pop().toLowerCase();

  const stripText = (text) => text.replace(/[^a-zA-Z0-9-/,.]/g, "");

  const renderPreview = () => {
    const extension = getFileExtension(localFile?.name);

    switch (extension) {
      case "ipynb": {
        return <CodePreview content={localFile?.content} />;
      }
      case "csv": {
        const rows = localFile.content.split("\n").map((row, index) => (
          <tr key={index}>
            {row.split(",").map((cell, cellIndex) => (
              <td key={cellIndex}>{stripText(cell)}</td>
            ))}
          </tr>
        ));
        return (
          <table>
            <thead>
              <tr>
                {rows[0] &&
                  rows[0].props.children.map((_, index) => (
                    <th key={index}>{rows[0].props.children[index]}</th>
                  ))}
              </tr>
            </thead>
            <tbody>{rows.slice(1)}</tbody>
          </table>
        );
      }
      case "png":
      case "jpg":
      case "jpeg": {
        return (
          <img
            style={{ maxWidth: "50vw", maxHeight: "50vh" }}
            src={`${localFile?.content}`}
            alt="preview"
          />
        );
      }
      default: {
        return <CodePreview content={localFile?.content} />;
      }
    }
  };

  return <div>{renderPreview()}</div>;
};

{
  /*
    Sample Usage:
    <PreviewComponent
fileShare = {"file-repository"}
filePath = {"dummy/1/Root/My_Files/image (1) 1.png"}
/> */
}

PreviewComponent.propTypes = {
  fileShare: PropTypes.any,
  filePath: PropTypes.any,
  file: PropTypes.any,
};

export default PreviewComponent;
