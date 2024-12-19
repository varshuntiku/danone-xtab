import {useEffect, useState } from "preact/hooks"
import './codeBlockRenderer.scss'
import Select from "../../../../shared/gridTable/cellEditors/select/Select"
import MarkdownRenderer from "../markdownRenderer/MarkdownRenderer"
import { createElement } from "preact"
import CodeBlockWrapper from "../../../../shared/codeBlockWrapper/CodeBlockWrapper"

type CodeBlockData = {
    content: string,
	props:{
		lang: string,
		label: string,
    	enableCopy?: boolean,
	}
}

type CodeBlockList = {
    data: {
		items: Array<CodeBlockData>,
		props?: {
			height?: string,
			maxHeight?: string
		}
	}
}

export default function CodeBlockRenderer({data}: Readonly<CodeBlockList>) {

	const {items, props} = data

	const codeBlocksChildren = items?.map((el) => {
		return createElement("CodeBlockItem", {...el.props}, [createElement(null, {}, createElement("code", {class: `lang-${el.props.lang}`, className: `lang-${el.props.lang}`}, el.content) )])
	})

    return (
		<CodeBlockWrapper {...props}>
			{codeBlocksChildren}
		</CodeBlockWrapper>
    )
}