import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import {
    UserMessage,
    MinervaMessage,
    RecommendationCards
} from '../../../components/minerva/chatMessages';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts UserMessage Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserMessage text="text" icon={true} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts MinervaMessage Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <MinervaMessage text="text" icon={true} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts RecommendationCards Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RecommendationCards recommendations={['text']} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
