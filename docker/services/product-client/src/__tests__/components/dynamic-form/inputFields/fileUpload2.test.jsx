import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FileUpload2 from '../../../../components/dynamic-form/inputFields/fileUpload2';
import { vi } from 'vitest';
import { ThemeProvider } from '@material-ui/core/styles';
const history = createMemoryHistory();

vi.mock('../../../common/utils', () => ({
    calculateSize: vi.fn(() => 100), // mock the size calculation
    upload_file: vi.fn((file) => Promise.resolve({ data: { name: file.name } })), // mock upload file function
    remove_file: vi.fn() // mock remove file function
}));
vi.mock('../../../assets/Icons/Pdf', () => () => <div>PdfIcon</div>);
vi.mock('../../../assets/Icons/Doc', () => () => <div>DocIcon</div>);
vi.mock('../../../assets/Icons/Csv', () => () => <div>CsvIcon</div>);
vi.mock('../../../assets/Icons/Ppt', () => () => <div>PptIcon</div>);
vi.mock('../../../assets/Icons/Mp4', () => () => <div>Mp4Icon</div>);
vi.mock('../../../assets/Icons/Nofile', () => () => <div>NofileIcon</div>);
vi.mock('../../../components/LinearProgressBar.jsx', () => {
    return {
        default: () => <div>Mocked LinearProgressBar</div>
    };
});
vi.mock('../../../components/LinearProgressBar.jsx', () => {
    return {
        LinearProgressBar: () => <div>Mocked LinearProgressBar</div>
    };
});

describe('FileUpload2 Component', () => {
    const mockOnChange = vi.fn();
    const fieldInfo = {
        value: [],
        max_size: 200,
        multiple: true,
        inputprops: { accept: '.pdf,.doc,.csv,.ppt,.mp4' },
        error: false,
        required: false,
        id: 'testUpload',
        name: 'testUpload',
        fullWidth: true,
        placeholder: 'Upload files...',
        variant: 'outlined',
        margin: 'normal',
        size: 'medium'
    };

    const renderComponent = () =>
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUpload2 onChange={mockOnChange} fieldInfo={fieldInfo} />
                </Router>
            </CustomThemeContextProvider>
        );

    it('should render without crashing', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Upload files...')).toBeInTheDocument();
    });

    it('should handle drag and drop', async () => {
        renderComponent();
        const dropZone = screen.getByText('Drag & Drop your file(s) here');
        const file = new File(['file content'], 'example.csv', { type: 'text/csv' });

        fireEvent.drop(dropZone, {
            dataTransfer: {
                files: [file]
            }
        });

        await waitFor(() => {
            expect(mockOnChange).not.toBeCalled();
        });
    });
});
