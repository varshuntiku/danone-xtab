import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconRenderer from '../../../../components/gridTable/cell-renderer/iconRenderer';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts IconRenderer Component', () => {
        const params = {
            value: 'close'
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render image when URL is provided', () => {
        const params = {
            value: {
                url: 'https://example.com/image.png',
                text: ''
            },
            iconWidth: '4rem'
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const image = screen.getByAltText('');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.png');
        expect(image).toHaveStyle({ width: '4rem', height: '4rem' });
    });
    test('Should render text when URL is not provided', () => {
        const params = {
            value: {
                text: 'Sample Text'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const text = screen.getByText('Sample Text');
        expect(text).toBeInTheDocument();
    });

    test('Should render both image and text when both are provided', () => {
        const params = {
            value: {
                url: 'https://example.com/image.png',
                text: 'Sample Text'
            },
            iconWidth: '4rem'
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const image = screen.getByAltText('Sample Text');
        const text = screen.getByText('Sample Text');

        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.png');
        expect(image).toHaveStyle({ width: '4rem', height: '4rem' });
        expect(text).toBeInTheDocument();
    });

    test('Should not render image if URL is not provided', () => {
        const params = {
            value: {
                text: 'Sample Text'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const image = screen.queryByAltText('');
        expect(image).not.toBeInTheDocument();
    });

    test('Should render default styles when no iconWidth is provided', () => {
        const params = {
            value: {
                url: 'https://example.com/image.png',
                text: 'Sample Text'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <IconRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );

        const image = screen.getByAltText('Sample Text');
        expect(image).toHaveStyle({ width: '3rem', height: '3rem' });
    });
});
