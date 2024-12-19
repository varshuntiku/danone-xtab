import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
// import configureMockStore from "redux-mock-store";
import TabView from '../../../components/minerva/tabView';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../components/CreateStoriesActionPanel', () => {
    return {
        default: (props) => (
            <div>
                Mock CreateStoriesActionPanel Component
                <button
                    aria-label="onResponseAddORCreateStory"
                    onClick={props.onResponseAddORCreateStory}
                >
                    Test onResponseAddORCreateStory
                </button>
            </div>
        )
    };
});

vi.mock('../../../components/minerva/graphView', () => {
    return {
        default: (props) => (
            <>
                <div>Mock graph view component</div>
                <button aria-label="updateStoriesCount" onClick={props.updateStoriesCount}>
                    Test stories count
                </button>
            </>
        )
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts TabView Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Provider store={store}>
                        <TabView
                            vizMetaData={[
                                { chart: { title: '' }, chartObject: [{ title: 'tab 1' }] }
                            ]}
                            app_info={{ screens: [], modules: { minerva: {} } }}
                        />
                    </Provider>
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts TabView Component', () => {
        const props = {
            vizMetaData: [
                {
                    chart: {
                        title: 'test tab 1'
                    },
                    chartObject: [{ title: 'tab 1' }]
                },
                {
                    chart: {
                        title: 'test tab 2'
                    },
                    chartObject: [{ title: 'tab 2' }]
                }
            ],
            deleteViz: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Provider store={store}>
                        <TabView {...props} />
                    </Provider>
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('tab', { name: 'tab 1' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('tab', { name: 'tab 1' }));
        fireEvent.click(screen.getByLabelText('onResponseAddORCreateStory'));
        fireEvent.click(screen.getByLabelText('updateStoriesCount'));
        fireEvent.click(screen.getByRole('tab', { name: 'tab 1' }));
        fireEvent.click(screen.getAllByLabelText('close')[1]);
    });
});
