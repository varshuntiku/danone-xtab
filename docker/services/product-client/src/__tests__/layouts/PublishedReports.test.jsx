import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import PublishedReports from '../../layouts/PublishedReports';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { getStory } from '../../services/reports.js';
import { vi } from 'vitest';

vi.mock('../../services/reports.js', () => ({
    getStory: vi.fn()
}));
vi.mock('../../components/AppWidgetPlot', () => {
    return { default: (props) => <div>Mock AppWidgetPlot Component</div> };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts PublishedReports Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PublishedReports match={{ params: { story_id: 1 } }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts PublishedReports Component', () => {
        const props = {
            match: {
                params: {
                    story_id: 1
                }
            },
            report_data: {
                story_id: 2
            }
        };
        getStory.mockImplementation(({ callback }) =>
            callback({
                content: [
                    {
                        value: JSON.stringify('test value 1'),
                        description: {
                            header: 'test header 1'
                        }
                    },
                    {
                        value: JSON.stringify('test value 2'),
                        description: {
                            header: 'test header 2'
                        }
                    },
                    {
                        value: JSON.stringify('test value 3'),
                        description: {
                            header: 'test header 3'
                        }
                    }
                ]
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PublishedReports {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    });
});
