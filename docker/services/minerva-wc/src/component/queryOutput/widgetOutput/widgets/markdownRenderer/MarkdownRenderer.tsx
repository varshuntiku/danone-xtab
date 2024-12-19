import Markdown from "markdown-to-jsx";
import "./markdownRenderer.scss"
import ImageView from "../imageView/ImageView";
import ImageRenderer from "../imageRenderer/ImageRenderer";
import CitationController from "../../citationController/CitationController";
import CodeBlockWrapper, { CodeBlock } from "../../../../shared/codeBlockWrapper/CodeBlockWrapper";
import Cursor from "../../../../shared/cursor/Cursor";

export default function MarkdownRenderer({ className = "", children }) {
	const PreBlock = ({ children, ...rest }) => {
		if ('type' in children && children['type'] === 'code') {
			return <CodeBlock {...children['props']} />;
		}
		return <pre {...rest}>{children}</pre>;
	};

	const customImage = (props) => {
		return ImageBlock(props)
	}

	const customImageList = (props) => {
		const imageListData = JSON.parse(decodeURIComponent(props.params)) || []

		return <div className="MinervaMarkdownCustom"><ImageView data={imageListData} width={props.width} height={props.height} /></div>
	}

	const citationController = ({citation, children, ...props}) => {
		const _citation = citation? JSON.parse(decodeURIComponent(citation)) : null
		return <CitationController citation={_citation} content={children} contentType="markdown" Component="span">
			{children}
		</CitationController>
	}

	const renderers = {
		pre: PreBlock,
		img: customImage,
		ImageList: customImageList,
		CitationController: citationController,
		CodeBlockWrapper: CodeBlockWrapper,
		Cursor: Cursor
	};
	const content = children || '';
	const regex = /!\[(.*?)\]\((.*?)\)/g;
	const replacedContent = content.replace(regex, '<img alt="$1" src="$2" />');
	return (
		<Markdown
			options={{
				overrides: renderers
			}}
			className={"MinervaMarkdownRenderer " + className}
		>
			{replacedContent || ""}
		</Markdown>
	);
}

const privateImageUrlMapping = {}

const ImageBlock = ({ src, width, height, ...props }) => {

	const ImageData = {
		'url': src,
		'caption': props.alt,
		'width': width,
		'height': height
	}

	return <ImageRenderer data={ImageData} {...props}/>
}