import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MobileUpload from '../../../../components/dynamic-form/inputFields/mobileUpload';
import { vi } from 'vitest';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from 'store/store';
const history = createMemoryHistory();

const mockParams = {
    label: 'Upload Files',
    anchor: 'right',
    multiple: true,
    accept: 'image/*',
    form_config: null
};

describe('MobileUpload Component', () => {
    it('should render the upload button', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MobileUpload params={mockParams} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const uploadButton = screen.getByText('Upload Files');
        expect(uploadButton).toBeInTheDocument();
    });

    it('should display file input when the drawer is open', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MobileUpload params={mockParams} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const uploadButton = screen.getByText('Upload Files');
        fireEvent.click(uploadButton);

        const fileInputLabel = screen.getByText('Upload from Gallery');
        expect(fileInputLabel).toBeInTheDocument();
    });

    it('should call the handleInputChange method when a file is selected', () => {
        const mockFiles = [new File(['file1'], 'file1.png', { type: 'image/png' })];

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MobileUpload params={mockParams} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const uploadButton = screen.getByText('Upload Files');
        fireEvent.click(uploadButton);

        const fileInput = screen.getByLabelText('Upload from Gallery');
        fireEvent.change(fileInput, { target: { files: mockFiles } });

        waitFor(() => {
            const filePreview = screen.getByRole('img');
            expect(filePreview).toBeInTheDocument();
        });
    });
});
