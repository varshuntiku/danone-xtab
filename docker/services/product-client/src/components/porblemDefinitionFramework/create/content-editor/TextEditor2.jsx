import React from 'react';
import { alpha } from '@material-ui/core';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { withStyles } from '@material-ui/styles';
import {
    amber,
    blue,
    blueGrey,
    brown,
    cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow
} from '@material-ui/core/colors';
import clsx from 'clsx';

const styles = (theme) => ({
    wrapper: {
        // height: "100%",
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    toolbar: {
        position: 'fixed',
        transform: 'translate(0, calc(-100% - 10px))',
        zIndex: 2,
        background: theme.palette.primary.light,
        borderRadius: '4px',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        boxShadow: theme.shadows[2],

        '& img': {
            filter: theme.props?.mode === 'dark' ? 'invert(90%)' : 'none'
        },
        '& .rdw-option-disabled': {
            '&:hover': {
                background: 'none'
            }
        },
        '& .rdw-option-wrapper': {
            border: 'none',
            background: 'none',
            boxShadow: 'none',
            color: alpha(theme.palette.text.default, 0.9),
            '&:hover': {
                background: theme.palette.background.hover
            }
        },
        '& .rdw-dropdown-wrapper': {
            border: `1px solid ${alpha(theme.palette.text.default, 0.1)}`,
            background: 'none',
            boxShadow: 'none',
            color: alpha(theme.palette.text.default, 0.9),
            borderRadius: '4px'
        },
        '& .rdw-dropdown-optionwrapper,.rdw-link-modal': {
            border: `1px solid ${alpha(theme.palette.text.default, 0.1)}`,
            background: theme.palette.primary.light,
            color: alpha(theme.palette.text.default, 0.9),
            borderRadius: '4px',
            boxShadow: theme.shadows[2],
            overflow: 'auto'
        },
        '& .rdw-dropdownoption-active': {
            background: theme.palette.background.selected
        },
        '& .rdw-dropdownoption-highlighted': {
            background: theme.palette.background.hover
        },
        '& .rdw-dropdown-carettoopen': {
            borderTop: `6px solid ${theme.palette.text.default}`
        },
        '& .rdw-dropdown-carettoclose': {
            borderBottom: `6px solid ${theme.palette.text.default}`
        },
        '& .rdw-option-active': {
            background: theme.palette.background.selected,
            boxShadow: '0 0 0 1pt ' + alpha(theme.palette.text.default, 0.1) + ' inset',
            borderRadius: '4px'
        },
        '& .rdw-colorpicker-modal': {
            border: `1px solid ${alpha(theme.palette.text.default, 0.1)}`,
            background: theme.palette.primary.light,
            color: alpha(theme.palette.text.default, 0.9),
            borderRadius: '4px',
            boxShadow: theme.shadows[2],
            '& .rdw-colorpicker-modal-options': {
                overflow: 'auto'
            }
        },
        '& .rdw-link-modal-input': {
            borderRadius: '4px',
            height: '2.6rem',
            marginBottom: '1em',
            width: '100%',
            boxSizing: 'border-box',
            border: 0
        },
        '& .rdw-link-modal-btn': {
            width: 'auto',
            height: 'auto',
            padding: '0.25rem 1rem'
        }
    },
    editor: {
        flex: 1,
        height: 'auto',
        color: theme.palette.text.default,
        zIndex: 0,
        '& .DraftEditor-root': {
            height: '100%'
        },
        '& .public-DraftStyleDefault-block': {
            margin: 0
        },
        '& .public-DraftEditorPlaceholder-root': {
            color: '#9197a3b3'
        }
    }
});

function getEditorState(content) {
    if (content) {
        const blocksFromHTML = htmlToDraft(content);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
        return EditorState.createWithContent(contentState);
    } else {
        return EditorState.createEmpty();
    }
}

class TextEditor2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: getEditorState(props.content),
            content: props.content,
            toolbarStyle: {}
        };
        this.wrapperRef = React.createRef();
    }
    handleEditorStateChange = (editorState) => {
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({ editorState, content });
        this.props.onChange(content);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content && this.props.content !== this.state.content) {
            this.setState({
                editorState: getEditorState(this.props.contnet),
                content: this.props.content
            });
        }
    }

    handleOnfocus = () => {
        if (this.wrapperRef.current) {
            const element = this.wrapperRef.current;
            const rect = element.wrapper.getBoundingClientRect();
            let top = rect.top - 10;
            if (window.innerHeight - rect.top < 250) {
                top = window.innerHeight - 250;
            }
            const style = {
                position: 'fixed',
                top: `${top}px`,
                left: `${rect.x - 8}px`
            };
            this.setState({ toolbarStyle: style });
        }
    };
    render() {
        const { editorState, toolbarStyle } = this.state;
        const {
            placeholder,
            readOnly,
            classes,
            className,
            /*onchange, content, */ toolbar /*, ...otherProps*/
        } = this.props;

        return (
            <Editor
                editorState={editorState}
                wrapperClassName={clsx(classes.wrapper, className)}
                toolbarClassName={classes.toolbar}
                editorClassName={clsx(classes.editor)}
                readOnly={readOnly}
                stripPastedStyles={true}
                placeholder={placeholder}
                onEditorStateChange={this.handleEditorStateChange}
                ref={this.wrapperRef}
                toolbarStyle={toolbarStyle}
                onFocus={this.handleOnfocus}
                toolbarOnFocus
                toolbar={{
                    options: [
                        'fontFamily',
                        'fontSize',
                        'inline',
                        'colorPicker',
                        'link',
                        'list',
                        'textAlign',
                        'remove'
                    ],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                    },
                    fontFamily: {
                        options: [
                            'Arial',
                            'Georgia',
                            'Impact',
                            'Tahoma',
                            'Times New Roman',
                            'Verdana',
                            'Montserrat'
                        ]
                    },
                    colorPicker: {
                        className: undefined,
                        component: undefined,
                        popupClassName: undefined,
                        colors: Colors
                    },
                    ...toolbar
                }}
            />
        );
    }
}
export default withStyles(styles)(TextEditor2);

const Colors = [
    'inherit',
    'white',
    'black',
    '#3277B3',
    '#6DF0C2',
    ...Object.values(red),
    ...Object.values(pink),
    ...Object.values(purple),
    ...Object.values(deepPurple),
    ...Object.values(indigo),
    ...Object.values(blue),
    ...Object.values(lightBlue),
    ...Object.values(cyan),
    ...Object.values(teal),
    ...Object.values(green),
    ...Object.values(lightGreen),
    ...Object.values(lime),
    ...Object.values(yellow),
    ...Object.values(amber),
    ...Object.values(orange),
    ...Object.values(deepOrange),
    ...Object.values(brown),
    ...Object.values(grey),
    ...Object.values(blueGrey)
];

// function FileLinkComopnent({...props}) {
//     const { expanded, onExpandEvent, onChange } = props;

//     const [text, setText] = useState('');
//     const [link, setLink] = useState('');

//     const handleAdd = () => {
//         onChange("link", text, link, "_blank")
//     }

//     return (
//         <div
//         aria-haspopup="true"
//         aria-expanded={expanded}
//         aria-label="rdw-link-wrapper"
//         className='rdw-link-wrapper'
//         >
//             <div className='rdw-option-wrapper' onClick={onExpandEvent}>
//                 <img
//                 src={FileLinkIcon}
//                 alt=""
//                 />
//             </div>

//             {expanded ? <Paper className='rdw-link-modal-custom' style={{position: "fixed", transform: "translate(4px, 60%)", width: "200px", zIndex: 1, padding: "1rem"}} onClick={e => e.stopPropagation()}>
//                 <label>Enter Text:</label>
//                 <input className='rdw-link-modal-input' onChange={e => setText(e.target.value)} />
//                 <label>Select File:</label>
//                 <input type="file" className='rdw-link-modal-input' onChange={e => setLink(e.target.value)} />
//                 <Button  onClick={handleAdd}>Add</Button>
//             </Paper> : null}

//         </div>
//     )
// }

// const FileLinkIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEzLjk2Ny45NUEzLjIyNiAzLjIyNiAwIDAgMCAxMS42Ny4wMDJjLS44NyAwLTEuNjg2LjMzNy0yLjI5Ny45NDhMNy4xMDUgMy4yMThBMy4yNDcgMy4yNDcgMCAwIDAgNi4yNCA2LjI0YTMuMjI1IDMuMjI1IDAgMCAwLTMuMDIyLjg2NUwuOTUgOS4zNzNhMy4yNTMgMy4yNTMgMCAwIDAgMCA0LjU5NCAzLjIyNiAzLjIyNiAwIDAgMCAyLjI5Ny45NDhjLjg3IDAgMS42ODYtLjMzNiAyLjI5OC0uOTQ4TDcuODEyIDExLjdhMy4yNDcgMy4yNDcgMCAwIDAgLjg2NS0zLjAyMyAzLjIyNSAzLjIyNSAwIDAgMCAzLjAyMi0uODY1bDIuMjY4LTIuMjY3YTMuMjUyIDMuMjUyIDAgMCAwIDAtNC41OTV6TTcuMTA1IDEwLjk5M0w0LjgzNyAxMy4yNmEyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LjY1NSAyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LS42NTUgMi4yNTIgMi4yNTIgMCAwIDEgMC0zLjE4bDIuMjY4LTIuMjY4YTIuMjMyIDIuMjMyIDAgMCAxIDEuNTktLjY1NWMuNDMgMCAuODQxLjEyIDEuMTk1LjM0M0w0Ljc3MiA5LjQzOGEuNS41IDAgMSAwIC43MDcuNzA3bDEuOTM5LTEuOTM4Yy41NDUuODY4LjQ0MiAyLjAzLS4zMTMgMi43ODV6bTYuMTU1LTYuMTU1bC0yLjI2OCAyLjI2N2EyLjIzMyAyLjIzMyAwIDAgMS0xLjU5LjY1NWMtLjQzMSAwLS44NDEtLjEyLTEuMTk1LS4zNDNsMS45MzgtMS45MzhhLjUuNSAwIDEgMC0uNzA3LS43MDdMNy40OTkgNi43MWEyLjI1MiAyLjI1MiAwIDAgMSAuMzEzLTIuNzg1bDIuMjY3LTIuMjY4YTIuMjMzIDIuMjMzIDAgMCAxIDEuNTktLjY1NSAyLjIzMyAyLjIzMyAwIDAgMSAyLjI0NiAyLjI0NWMwIC42MDMtLjIzMiAxLjE2OC0uNjU1IDEuNTl6IiBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="
