import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import AttachmentCard from '../../../components/Comments/AttachmentCard';
const history = createMemoryHistory();

describe('AttachmentCard Component', () => {
    const defaultProps = {
        fileUrl: 'http://example.com/file.pdf',
        fileName: 'Example File Name.pdf',
        fileSize: '1.2 MB'
    };

    it('renders the file icon, file name, and file size correctly', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AttachmentCard {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const fileIcon = screen.getByTestId('DescriptionIcon');
        const fileName = screen.getByText('Example File Name.pdf');
        const fileSize = screen.getByText('1.2 MB');

        expect(fileIcon).toBeInTheDocument();
        expect(fileName).toBeInTheDocument();
        expect(fileSize).toBeInTheDocument();
    });

    it('applies the correct styles to elements', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AttachmentCard {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const attachmentCard = screen.getByText('Example File Name.pdf').closest('div');
        expect(attachmentCard).toHaveClass('makeStyles-attachmentCard-6');
    });
});
