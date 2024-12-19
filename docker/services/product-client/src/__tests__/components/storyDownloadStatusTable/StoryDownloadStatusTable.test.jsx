import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import StoryDownloadStatusTable from '../../../components/storyDownloadStatusTable/StoryDownloadStatusTable';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { getDownloadStatus } from '../../../services/reports';
import { vi } from 'vitest';

vi.mock('../../../services/reports', () => ({
    getDownloadStatus: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    test('Should render StoryDownloadStatusTable Component and display loading state', () => {
        getDownloadStatus.mockImplementation(({ callback }) => {
            setTimeout(() => callback([]), 1000);
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StoryDownloadStatusTable appId={1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('Should render StoryDownloadStatusTable Component with data', () => {
        getDownloadStatus.mockImplementation(({ callback }) => {
            callback([
                {
                    apps: [{ name: 'App1' }],
                    story_name: 'Story1',
                    triggered_at: '2024-08-08T12:00:00Z',
                    updated_at: '2024-08-08T12:30:00Z',
                    file_type: 'PDF',
                    download_status: 'SUCCESS',
                    link: 'http://example.com/file.pdf',
                    file_name: 'file.pdf'
                }
            ]);
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StoryDownloadStatusTable appId={1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Story1')).toBeInTheDocument();
        expect(screen.getByText('PDF')).toBeInTheDocument();
        expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });

    test('Should handle empty data with a message', () => {
        getDownloadStatus.mockImplementation(({ callback }) => {
            callback([]);
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StoryDownloadStatusTable appId={1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('No recrod found')).toBeInTheDocument();
    });
});
