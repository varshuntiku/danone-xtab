import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from 'themes/customThemeContext';
import TagsRenderer from '../../components/gridTable/cell-renderer/tagsRenderer.jsx';

const history = createMemoryHistory();
describe('TagRendercomponent renders', () => {
    afterEach(cleanup);
    test('Should render tagsRenderer component', () => {
        const data = [
            { tagName: 'cpg', tagColor: null },
            { tagName: 'retail category', tagColor: null }
        ];
        // getJwtTokenByUser.mockResolvedValue({data:mockeddata})
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TagsRenderer tagData={data} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render tagsRenderer component with actual params', () => {
        const data = [
            { tagName: 'cpg', tagColor: null },
            { tagName: 'retail category', tagColor: null }
        ];
        const paramsdata = {
            tagLimit: 5,
            characterLimit: 3,
            delete: true,
            modify: true
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TagsRenderer tagData={data} params={paramsdata} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
