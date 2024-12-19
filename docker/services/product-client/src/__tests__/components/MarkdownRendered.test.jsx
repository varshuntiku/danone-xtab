import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MarkdownRenderer from '../../components/MarkdownRenderer';

vi.mock('react-syntax-highlighter', () => {
    const SyntaxHighlighter = vi.fn(({ style }) => (
        <div data-testid="syntax-highlighter" style={style}>
            SyntaxHighlighter
        </div>
    ));
    SyntaxHighlighter.registerLanguage = vi.fn();
    return { Light: SyntaxHighlighter, registerLanguage: SyntaxHighlighter.registerLanguage };
});

const history = createMemoryHistory();

describe('MarkdownRenderer Component', () => {
    const mockClasses = {
        markdownBody: 'markdownBody',
        markdownHeader: 'markdownHeader',
        markdownList: 'markdownList',
        codePre: 'codePre',
        copyButton: 'copyButton',
        markdownCode: 'markdownCode'
    };

    afterEach(() => {
        cleanup();
    });

    it('should render markdown content as paragraphs', () => {
        const content = 'This is a paragraph.';
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer classes={mockClasses} markdownContent={content} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('should render markdown headers correctly', () => {
        const content = '# Header 1';
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer classes={mockClasses} markdownContent={content} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Header 1')).toHaveClass(mockClasses.markdownHeader);
    });

    it('should render code blocks with syntax highlighting', () => {
        const codeContent = 'const x = 10;';
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer
                            classes={mockClasses}
                            markdownContent={`\`\`\`js\n${codeContent}\n\`\`\``}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('SyntaxHighlighter')).toBeInTheDocument();
    });

    it('should copy code to clipboard when the copy button is clicked', () => {
        const codeContent = 'const x = 10;';
        navigator.clipboard = { writeText: vi.fn() };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer
                            classes={mockClasses}
                            markdownContent={`\`\`\`js\n${codeContent}\n\`\`\``}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByLabelText('Copy'));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(codeContent);
    });

    it('should apply the dark theme if specified in localStorage', () => {
        localStorage.setItem('codx-products-theme', 'dark');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer
                            classes={mockClasses}
                            markdownContent={`\`\`\`python\nprint("Hello World")\n\`\`\``}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const syntaxHighlighter = screen.getByTestId('syntax-highlighter');
        expect(syntaxHighlighter).toHaveStyle({
            backgroundColor: expect.stringContaining('#0d0d0d')
        });

        localStorage.removeItem('codx-products-theme');
    });

    it('should render images in markdown content correctly', () => {
        const content = '![Alt Text](http://example.com/image.png)';
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer classes={mockClasses} markdownContent={content} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByAltText('Alt Text')).toHaveAttribute(
            'src',
            'http://example.com/image.png'
        );
    });
    it('should initialize props in the constructor', () => {
        const content = 'Sample markdown';
        const wrapper = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer classes={mockClasses} markdownContent={content} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(wrapper).toBeTruthy();
    });
    it('should render markdown content with image replacements', () => {
        const content = 'Here is an image: ![Alt Text](http://example.com/image.png)';
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MarkdownRenderer classes={mockClasses} markdownContent={content} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByAltText('Alt Text')).toHaveAttribute(
            'src',
            'http://example.com/image.png'
        );
    });
});
