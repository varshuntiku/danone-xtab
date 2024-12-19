import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import AppSystemWidgetInfo from '../../components/AppSystemWidgetInfo';
import { Provider } from 'react-redux';
import store from 'store/store';
import { getSystemWidgetDocumentation } from '../../services/screen.js';
import CodxCircularLoader from '../../components/CodxCircularLoader';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const history = createMemoryHistory();
vi.mock('../../services/screen.js', () => ({
    getSystemWidgetDocumentation: vi.fn()
}));

vi.mock('../../components/CodxCircularLoader', () => ({
    __esModule: true,
    default: () => <div>Loading...</div>
}));

vi.mock('../../components/MarkdownRenderer', () => ({
    __esModule: true,
    default: ({ markdownContent }) => <div>{markdownContent}</div>
}));

describe('AppSystemWidgetInfo Component', () => {
    const defaultProps = {
        classes: {
            widgetInfoTitle: 'widgetInfoTitle',
            widgetInfoHeading: 'widgetInfoHeading',
            widgetInfoActionIcon: 'widgetInfoActionIcon',
            widgetInfoContainer: 'widgetInfoContainer',
            widgetInfoContainerGrid: 'widgetInfoContainerGrid',
            markdownWrapper: 'markdownWrapper',
            widgetInfoPaper: 'widgetInfoPaper'
        },
        widget_info: { name: 'Test Widget', information_doc: 'info.md', doc: 'doc.md' },
        parent_obj: { closeCallback: vi.fn() },
        closeCallback: 'closeCallback',
        isDialog: true
    };

    it('renders dialog with correct header text', () => {
        render(<AppSystemWidgetInfo {...defaultProps} />);

        expect(screen.getByText('Widget Documentation - Test Widget')).toBeInTheDocument();
    });

    it('renders MarkdownRenderer with documentation', async () => {
        getSystemWidgetDocumentation.mockImplementationOnce(({ callback }) => {
            callback({ data: 'Test documentation' });
        });

        render(<AppSystemWidgetInfo {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText('Test documentation')).toBeInTheDocument();
        });
    });

    it('renders CodxCircularLoader while loading', () => {
        render(<AppSystemWidgetInfo {...defaultProps} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('calls closeCallback on dialog close button click', () => {
        render(<AppSystemWidgetInfo {...defaultProps} />);

        fireEvent.click(screen.getByTitle('Close'));
        expect(defaultProps.parent_obj.closeCallback).toHaveBeenCalled();
    });

    it('renders content without dialog when isDialog is false', () => {
        const props = {
            ...defaultProps,
            isDialog: false,
            dataProps: { headerText: 'Non-dialog Header' }
        };
        render(<AppSystemWidgetInfo {...props} />);

        expect(screen.getByText('Non-dialog Header')).toBeInTheDocument();
    });
});
