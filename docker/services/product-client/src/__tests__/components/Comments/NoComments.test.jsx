import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import NoComments from '../../../components/Comments/NoComments';
import NoCommentIcon from '../../../assets/img/NoCommentIcon';

const history = createMemoryHistory();

vi.mock('../../assets/img/NoCommentIcon.jsx', () => ({
    __esModule: true,
    default: () => <svg data-testid="no-comment-icon"></svg>
}));

describe('NoComments Component', () => {
    it('renders "No Comments Added" when filtersApplied is false', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NoComments filtersApplied={false} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('No Comments Added')).toBeInTheDocument();
    });

    it('applies the correct styles from useStyles', () => {
        const { container } = render(<NoComments filtersApplied={false} />);

        const mainDiv = container.firstChild;
        expect(mainDiv).toHaveStyle('display: flex');
        expect(mainDiv).toHaveStyle('flex-direction: column');
        expect(mainDiv).toHaveStyle('justify-content: center');
        expect(mainDiv).toHaveStyle('align-items: center');
    });

    it('renders with default message when filtersApplied is not passed', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NoComments />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('No Comments Added')).toBeInTheDocument();
    });
});
