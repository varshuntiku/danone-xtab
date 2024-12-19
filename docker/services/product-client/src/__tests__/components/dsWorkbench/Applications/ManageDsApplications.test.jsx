import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import ManageDsApplications from '../../../../components/dsWorkbench/Applications/ManageDsApplications';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom/extend-expect';
import { deleteApp } from '../../../../services/app';

const history = createMemoryHistory();
const mockSetProjectDetailsState = vi.fn();

describe('ManageDsApplications Component', () => {
    beforeEach(() => {
        mockSetProjectDetailsState.mockClear();
    });

    it('should render the EditOutlinedIcon inside the IconButton', () => {
        render(
            <ManageDsApplications
                dsAppConfig={{ setProjectDetailsState: mockSetProjectDetailsState }}
                row={{ id: 1, name: 'Test Application' }}
            />
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call setProjectDetailsState with correct arguments on button click', () => {
        const mockRow = { id: 1, name: 'Test Application' };

        render(
            <ManageDsApplications
                dsAppConfig={{ setProjectDetailsState: mockSetProjectDetailsState }}
                row={mockRow}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(mockSetProjectDetailsState).toHaveBeenCalledWith(expect.any(Function));

        const updaterFunction = mockSetProjectDetailsState.mock.calls[0][0];
        const prevState = { someState: 'value' };
        const updatedState = updaterFunction(prevState);

        expect(updatedState).toEqual({
            ...prevState,
            showAppAdmin: true,
            selectedRow: mockRow
        });
    });
});
