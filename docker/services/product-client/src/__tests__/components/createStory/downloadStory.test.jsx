import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DownloadStory from '../../../components/createStory/downloadStory.jsx';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DownloadStory Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DownloadStory />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
