import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import { Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FileCopy } from '@material-ui/icons';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { python } from 'react-syntax-highlighter/dist/cjs/languages/hljs';
import markdownRendererStyle from 'assets/jss/markdownRendererStyle.jsx';
SyntaxHighlighter.registerLanguage('python', python);

class MarkdownRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    // override components
    markdownParagraph = ({ children }) => {
        return (
            <Typography variant="body1" className={this.props.classes.markdownBody}>
                {children}
            </Typography>
        );
    };

    markdownH1Tag = ({ children }) => {
        return (
            <Typography variant="h3" className={this.props.classes.markdownHeader}>
                {children}
            </Typography>
        );
    };

    markdownH2Tag = ({ children }) => {
        return (
            <Typography variant="h4" className={this.props.classes.markdownHeader}>
                {children}
            </Typography>
        );
    };

    markdownH3Tag = ({ children }) => {
        return (
            <Typography variant="h5" className={this.props.classes.markdownHeader}>
                {children}
            </Typography>
        );
    };

    markdownH4Tag = ({ children }) => {
        return (
            <Typography variant="h6" className={this.props.classes.markdownHeader}>
                {children}
            </Typography>
        );
    };

    markdownListItem = ({ children }) => {
        return (
            <li>
                <Typography className={this.props.classes.markdownList} component="span">
                    {children}
                </Typography>
            </li>
        );
    };

    markdownOrderedListItem = ({ children }) => {
        return (
            <li>
                <Typography className={this.props.classes.markdownList} component="span">
                    {children}
                </Typography>
            </li>
        );
    };

    markdownCodePre = ({ children }) => {
        return (
            <div className={this.props.classes.codePre}>
                <IconButton
                    aria-label="Copy"
                    onClick={() => this.handleCodeCopy(children)}
                    className={this.props.classes.copyButton}
                >
                    <FileCopy />
                </IconButton>
                <SyntaxHighlighter
                    language={children?.props?.className?.substr(5) || 'python'}
                    className={this.props.classes.markdownCode}
                    style={this.getTheme()}
                >
                    {children.props.children}
                </SyntaxHighlighter>
            </div>
        );
    };

    handleCodeCopy = (children) => {
        navigator.clipboard.writeText(children.props.children);
    };

    getTheme = () => {
        let theme = localStorage.getItem('codx-products-theme');
        if (theme && theme === 'dark') {
            return atomOneDark;
        } else {
            return docco;
        }
    };

    render() {
        const { classes } = this.props;
        const renderers = {
            h1: this.markdownH1Tag,
            h2: this.markdownH2Tag,
            h3: this.markdownH3Tag,
            h4: this.markdownH4Tag,
            p: this.markdownParagraph,
            li: this.markdownListItem,
            pre: this.markdownCodePre
        };
        const content = this.props.markdownContent || '';
        const regex = /!\[(.*?)\]\((.*?)\)/g;
        const replacedContent = content.replace(regex, '<img alt="$1" src="$2" />');
        return (
            <Markdown
                className={classes.markdownComponent}
                options={{
                    overrides: renderers
                }}
                id="markdownRenderer"
            >
                {replacedContent}
            </Markdown>
        );
    }
}

MarkdownRenderer.propTypes = {
    classes: PropTypes.object.isRequired,
    markdownContent: PropTypes.string.isRequired
};

export default withStyles(
    (theme) => ({
        ...markdownRendererStyle(theme)
    }),
    { withTheme: true }
)(MarkdownRenderer);
