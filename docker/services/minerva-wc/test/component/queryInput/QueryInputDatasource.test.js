import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import QueryInputDatasourceItem from '../../../src/component/queryInput/QueryInputDatasource';


jest.mock('../../../src/svg/PPTFileIcon', () => ({ className }) => <div className={className}>PPT Icon</div>);
jest.mock('../../../src/svg/PDFFileIcon', () => ({ className }) => <div className={className}>PDF Icon</div>);
jest.mock('../../../src/svg/FileIcon', () => ({ className }) => <div className={className}>File Icon</div>);


jest.mock('../../../src/component/shared/popover/Popover', () => ({ open, onClose, children }) => open ? (
    <div>
        {children}
        <button onClick={onClose}>Close</button>
    </div>
) : null);

global.URL.createObjectURL = jest.fn(() => 'mocked-url');

describe('QueryInputDatasourceItem', () => {
    test('renders image files correctly and shows preview on click', async () => {
        const file = new File([''], 'image.png', { type: 'image/png' });
        const mockData = {
            queryDatasourceList: [file],
            removeDatasource: jest.fn(),
            enablePreview: true
        };

        render(<QueryInputDatasourceItem {...mockData} />);
        const imgElement = screen.getByAltText('image.png');

        fireEvent.click(imgElement);

        await waitFor(() => {
            expect(screen.getByAltText('Full Preview')).toBeTruthy();
        });

        fireEvent.click(screen.getByText('Close'));

        await waitFor(() => {
            expect(screen.queryByAltText('Full Preview')).not.toBeTruthy();
        });
    });

    test('renders non-image files correctly', () => {
        const file = new File([''], 'document.pdf', { type: 'application/pdf' });
        const mockData = {
            queryDatasourceList: [file],
            removeDatasource: jest.fn(),
            enablePreview: true
        };

        render(<QueryInputDatasourceItem {...mockData} />);
        expect(screen.getByText('PDF Icon')).toBeTruthy();
        expect(screen.getByText('document.pdf')).toBeTruthy();
    });

    test('handles file removal', () => {
        const file = new File([''], 'document.pdf', { type: 'application/pdf' });
        const removeDatasource = jest.fn();
        const mockData = {
            queryDatasourceList: [file],
            removeDatasource,
            enablePreview: true
        };

        render(<QueryInputDatasourceItem {...mockData} />);
        fireEvent.click(screen.getByTitle('Remove'));
        expect(removeDatasource).toHaveBeenCalledWith(0);
    });

    test('opens and closes popover', async () => {
        const file = new File([''], 'image.png', { type: 'image/png' });
        const mockData = {
            queryDatasourceList: [file],
            removeDatasource: jest.fn(),
            enablePreview: true
        };

        render(<QueryInputDatasourceItem {...mockData} />);
        fireEvent.click(screen.getByAltText('image.png'));

        await waitFor(() => {
            expect(screen.getByAltText('Full Preview')).toBeTruthy();
        });

        fireEvent.click(screen.getByText('Close'));

        await waitFor(() => {
            expect(screen.queryByAltText('Full Preview')).not.toBeTruthy();
        });
    });

    test('handles file removal in images', () => {
        const file = new File([''], 'image.png', { type: 'image/png' });
        const mockData = {
            queryDatasourceList: [file],
            removeDatasource: jest.fn(),
            allowFileRemove: true,
            enablePreview: true
        };

        render(<QueryInputDatasourceItem {...mockData} />);
        fireEvent.click(screen.getByTitle('Remove'));
        expect(mockData.removeDatasource).toHaveBeenCalledWith(0);
    });
});
