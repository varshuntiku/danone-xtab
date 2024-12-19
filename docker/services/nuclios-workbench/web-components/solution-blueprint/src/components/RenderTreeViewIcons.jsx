import { ReactComponent as PythonExtentionIcon } from "assets/Icons/pythonExtnIcon.svg";
import { ReactComponent as FileIcon } from "assets/Icons/fileIcon.svg";
import { ReactComponent as ExcelIcon } from "assets/Icons/excelIcon.svg";
import { ReactComponent as PdfIcon } from "assets/Icons/pdfIcon.svg";
import { ReactComponent as WordIcon } from "assets/Icons/wordIcon.svg";
import { ReactComponent as ImageIcon } from "assets/Icons/imageIcon.svg";
import { ReactComponent as FolderIcon } from "assets/Icons/folderIcon.svg";
import { ReactComponent as TextIcon } from "assets/Icons/textIcon.svg";
import PropTypes from "prop-types";

function RenderTreeViewIcons({ node, classes }) {
  const fontColor =
    localStorage.getItem("codx-products-theme") === "dark"
      ? "#FFFFFF"
      : "#220047";
  switch (node.icon) {
    case "notebook":
      return (
        <>
          <TextIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "folder":
      return (
        <>
          <FolderIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "python_file":
      return (
        <>
          <PythonExtentionIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "file":
      return (
        <>
          <FileIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "excel_file":
      return (
        <>
          <ExcelIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "pdf_file":
      return (
        <>
          <PdfIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "image_file":
      return (
        <>
          <ImageIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "word_file":
      return (
        <>
          <WordIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    case "text_file":
      return (
        <>
          <TextIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
    default:
      return (
        <>
          <TextIcon className={classes.imageIcon} />{" "}
          <span style={{ color: fontColor }}>{node.name}</span>
        </>
      );
  }
}

RenderTreeViewIcons.propTypes = {
  classes: PropTypes.object,
  node: PropTypes.any,
};

export default RenderTreeViewIcons;
