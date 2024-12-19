import { useEffect, useState } from "preact/hooks";
import Select from "../gridTable/cellEditors/select/Select";
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup';
import '../../queryOutput/widgetOutput/widgets/markdownRenderer/prism.scss';
import "../../queryOutput/widgetOutput/widgets/markdownRenderer/prism-light.scss";
import '../../queryOutput/widgetOutput/widgets/markdownRenderer/prism-dark.scss';
import './codeBlockWrapper.scss'
import CopyContentIcon from "../../../svg/CopyContentIcon";
import DoneIcon from "../../../svg/DoneIcon";


export default function CodeBlockWrapper({children, ...props}) {

	const codeLanguageOptions = children?.map?.((el: { props: { label: any; }; }) => el.props?.label)

	const [activeIndex, setActiveIndex] = useState(0)

	const [activeLanguage, setActiveLanguage] = useState(codeLanguageOptions[0])
	const [activeCodeBlock, setActiveCodeBlock] = useState(null)
	const [enableCopyButton, setEnableCopyButton] = useState(false)
	const [copyButtonActive, setCopyButtonActive] = useState(true)

	useEffect(() => {

		let codeBlock = children[activeIndex]?.props?.children[0]
		setEnableCopyButton(children[activeIndex]?.props.enableCopy)

		setActiveCodeBlock(codeBlock)
	},[activeIndex])

	const handleCodeLanguageChange = (val: any) => {
		setActiveLanguage(val)

		const activeLanguageIndex = codeLanguageOptions?.findIndex((item: any) => item === val)
		setActiveIndex(activeLanguageIndex)
	}

	const handleCopyClick = () => {
		navigator.clipboard.writeText(activeCodeBlock?.props?.children?.props?.children)
		setCopyButtonActive(false)
		setTimeout(() => {
			setCopyButtonActive(true)
		}, 1000)
	}


	return (
		<div className="MinervaCodeBlockWrapper">
			<div className="MinervaCodeBlockWrapper-header">
				{codeLanguageOptions.length > 1 ?
					<Select options={codeLanguageOptions} value={activeLanguage} fullWidth={false} onChange={handleCodeLanguageChange} /> :
					<p>{activeLanguage}</p>
				}
				{enableCopyButton ? (
					<button
						className={`MinervaIconButton ${copyButtonActive ? '' : 'MinervaCodeBlockWrapper-noBgHover'}`}
						title={copyButtonActive ? "Copy Code" : ""} onClick={handleCopyClick}>
						{copyButtonActive ? (
							<CopyContentIcon/>
						) : (
							<DoneIcon/>
						)}
						{copyButtonActive ? null : 'Code Copied'}
					</button>
				) : null}
			</div>
			<div className="MinervaCodeBlockWrapper-codeRenderer"  style={{height: props.height, maxHeight: props.maxHeight}}>
				{activeCodeBlock ? <CodeBlock  {...activeCodeBlock.props?.children['props']}/> : null}
			</div>
		</div>
	)
}


export const CodeBlock = ({ className, children }) => {

	let lang = 'text'; // default monospaced text
	if (className && className.startsWith('lang-')) {
		lang = className.replace('lang-', '');
	}
	const html = Prism.highlight(children, Prism.languages[lang] ? Prism.languages[lang] : Prism.languages.text, lang);
	return (
		<pre>
			<code dangerouslySetInnerHTML={{ __html: html }} className={'language-' + lang}>
				{children}
			</code>
		</pre>
	);
}