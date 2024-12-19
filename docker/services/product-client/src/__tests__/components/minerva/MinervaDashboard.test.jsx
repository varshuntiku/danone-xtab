import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MinervaDashboard from '../../../components/minerva/MinervaDashboard';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/minerva/tabView', () => {
    return {
        default: (props) => (
            <div>
                Mock TabView Component
                <button aria-label="deleteViz" onClick={props.deleteViz}>
                    Test deleteViz handler
                </button>
            </div>
        )
    };
});

vi.mock('../../../components/minerva/chatView', () => {
    return {
        default: (props) => (
            <div>
                Mock Chat View Component
                <button aria-label="setVizMetaData" onClick={props.setVizMetaData}>
                    Test setVizMetaData Handler
                </button>
            </div>
        )
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts MinervaDashboard.jsx Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <MinervaDashboard
                        match={{ params: { story_id: 1 } }}
                        location={{ state: { appId: 1, vizMetaData: ['data1', 'data2', 'data3'] } }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('deleteViz'));
        fireEvent.click(screen.getByLabelText('setVizMetaData'));
    });
});
