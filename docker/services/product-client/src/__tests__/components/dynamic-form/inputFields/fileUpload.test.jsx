import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FileUpload from '../../../../components/dynamic-form/inputFields/fileUpload.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts FileUpload Component', async () => {
        const props = {
            onChange: () => {},
            fieldInfo: {
                name: 'test name',
                id: 1,
                label: 'upload',
                inputprops: { 'data-testid': 'test upload' }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FileUpload {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
