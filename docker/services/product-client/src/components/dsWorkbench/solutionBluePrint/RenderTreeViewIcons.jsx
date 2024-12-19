import React from 'react';
import { ReactComponent as PythonExtentionIcon } from 'assets/Icons/pythonExtnIcon.svg';
import { ReactComponent as FileIcon } from 'assets/Icons/fileIcon.svg';
import { ReactComponent as ExcelIcon } from 'assets/Icons/excelIcon.svg';
import { ReactComponent as PdfIcon } from 'assets/Icons/pdfIcon.svg';
import { ReactComponent as WordIcon } from 'assets/Icons/wordIcon.svg';
import { ReactComponent as ImageIcon } from 'assets/Icons/imageIcon.svg';
import { ReactComponent as FolderIcon } from 'assets/Icons/folderIcon.svg';
import { ReactComponent as TextIcon } from 'assets/Icons/textIcon.svg';

function RenderTreeViewIcons({ node, classes }) {
    switch (node.icon) {
        case 'notebook':
            return (
                <>
                    <TextIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'folder':
            return (
                <>
                    <FolderIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'python_file':
            return (
                <>
                    <PythonExtentionIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'file':
            return (
                <>
                    <FileIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'excel_file':
            return (
                <>
                    <ExcelIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'pdf_file':
            return (
                <>
                    <PdfIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'image_file':
            return (
                <>
                    <ImageIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'word_file':
            return (
                <>
                    <WordIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        case 'text_file':
            return (
                <>
                    <TextIcon className={classes.imageIcon} /> {node.name}
                </>
            );
        default:
            return (
                <>
                    <TextIcon className={classes.imageIcon} /> {node.name}
                </>
            );
    }
}

export default RenderTreeViewIcons;
