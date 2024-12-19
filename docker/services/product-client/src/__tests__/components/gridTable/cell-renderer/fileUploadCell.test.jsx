import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FileUploadCell from '../../../../components/gridTable/cell-renderer/fileUploadCell';

const history = createMemoryHistory();

describe('Codex Product  file upload test', () => {
    afterEach(cleanup);
    test('Should render layouts fileUpload Component1', () => {
        const params = {
            preview: true,
            accept: '.png',
            readOnly: true,
            multiple: true
        };
        const row = {
            data: {
                Name: 'tom',
                Parent: 'john',
                Age: 10
            }
        };
        const coldef = {
            headerName: 'Age',
            field: 'Age',
            cellParamsField: 'Age_params',
            cellEditor: 'upload',
            cellEditorParams: {
                options: { preview: true, accept: '.png', readOnly: true, multiple: true }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUploadCell params={params} row={row} coldef={coldef} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render 2 image with path', () => {
        const params = {
            preview: true,
            accept: '.png',
            readOnly: true,
            multiple: true
        };
        const row = {
            data: {
                Name: 'tom',
                Parent: 'john',
                Age: [
                    {
                        path: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg',
                        filename: 'image1'
                    }
                ]
            }
        };
        const coldef = {
            headerName: 'Age',
            field: 'Age',
            cellParamsField: 'Age_params',
            cellEditor: 'upload',
            cellEditorParams: {
                options: { preview: true, accept: '.png', readOnly: true, multiple: true }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUploadCell params={params} row={row} coldef={coldef} />
                </Router>
            </CustomThemeContextProvider>
        );
        const img = screen.getByTestId('fileupload_img');

        expect(img).toHaveAttribute(
            'src',
            'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg'
        );
    });
    test('Should trigger file input', () => {
        const params = {
            preview: true,
            accept: '.png',
            readOnly: false,
            multiple: true
        };
        const row = { data: {} };
        const coldef = {
            headerName: 'Age',
            field: 'Age',
            cellParamsField: 'Age_params',
            cellEditor: 'upload',
            cellEditorParams: { options: params }
        };

        const { getByText, getByRole, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUploadCell params={params} row={row} coldef={coldef} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(getByText('Upload'));
    });
    test('Should expand and collapse image preview', () => {
        const params = {
            preview: true,
            accept: '.png',
            readOnly: false,
            multiple: true
        };
        const row = {
            data: {
                Age: [
                    {
                        path: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg',
                        filename: 'image1'
                    },
                    {
                        path: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg',
                        filename: 'image2'
                    },
                    {
                        path: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg',
                        filename: 'image3'
                    },
                    {
                        path: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg',
                        filename: 'image4'
                    }
                ]
            }
        };
        const coldef = {
            headerName: 'Age',
            field: 'Age',
            cellParamsField: 'Age_params',
            cellEditor: 'upload',
            cellEditorParams: { options: params }
        };

        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUploadCell params={params} row={row} coldef={coldef} />
                </Router>
            </CustomThemeContextProvider>
        );

        const expandButton = getByText('+1');
        fireEvent.click(expandButton);
        const images = screen.getAllByTestId('fileupload_img');
        expect(images.length).toBe(4);
        fireEvent.click(expandButton);
        expect(images.length).toBe(4);
    });
});
