import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import PreviewPublishedStory from '../../../components/previewPublishedStory/PreviewPublishedStory';
import * as services from 'services/reports';
import { describe, it, expect, afterEach, vi } from 'vitest';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('Should render PreviewPublishedStory component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PreviewPublishedStory
                        match={{ params: { story_id: 1 } }}
                        location={{ state: { appId: 1 } }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    it('Should display loader initially', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PreviewPublishedStory
                        match={{ params: { story_id: 1 } }}
                        location={{ state: { appId: 1 } }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('Should call getPublishedStory on mount', () => {
        const getPublishedStorySpy = vi
            .spyOn(services, 'getPublishedStory')
            .mockImplementation(vi.fn());

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PreviewPublishedStory
                        match={{ params: { story_id: 1 } }}
                        location={{ state: { appId: 1 } }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(getPublishedStorySpy).toHaveBeenCalled();
    });
});
