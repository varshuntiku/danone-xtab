import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import TextAnimation from '../../../components/animation/textanimation.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts TextAnimation Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <TextAnimation {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    text: 'Text animation test'
};
