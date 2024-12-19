import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import PreviewReports from '../../layouts/PreviewReports';
import { getStory } from '../../services/reports';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import AppWidgetPlot from '../../components/AppWidgetPlot';
import { vi } from 'vitest';

vi.mock('../../services/reports', () => ({
    getStory: vi.fn()
}));

vi.mock('../../components/AppWidgetPlot', () => {
    return { default: (props) => <div>Mock AppWidgetPlot Component</div> };
});

const mockLocalStorage = (function () {
    let store = {
        'codx-products-theme': 'dark'
    };

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

describe('Codex previewReports Component test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);

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

    test('Should render layouts PreviewReports Component on light theme', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <PreviewReports match={{ params: { story_id: 1 } }} onClose={() => {}} />
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Download' }));
        fireEvent.click(screen.getByLabelText('close'));
    });

    mockLocalStorage.setItem('codx-products-theme', 'light');

    test('Should render layouts PreviewReports Component on dark theme', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <PreviewReports match={{ params: { story_id: 1 } }} onClose={() => {}} />
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Download' }));
        fireEvent.click(screen.getByLabelText('close'));
    });
});
