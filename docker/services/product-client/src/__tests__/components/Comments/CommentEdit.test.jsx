import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import CommentEdit from '../../../components/Comments/CommentEdit.jsx';

const history = createMemoryHistory();
describe('CommentEdit Component', () => {
    const onChangeMock = vi.fn();
    const onSaveMock = vi.fn();
    const onCancelMock = vi.fn();

    it('should render CommentEdit component correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentEdit
                            commentText="Initial comment"
                            onChange={onChangeMock}
                            onSave={onSaveMock}
                            onCancel={onCancelMock}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const textField = screen.getByPlaceholderText('Edit your comment');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveValue('Initial comment');

        expect(screen.getByTestId('attachIcon')).toBeInTheDocument();
        expect(screen.getByTestId('InsertEmotionIcon')).toBeInTheDocument();
        expect(screen.getByTestId('DoneIcon')).toBeInTheDocument();
        expect(screen.getByTestId('cancelIcon')).toBeInTheDocument();
    });

    it('should call onSave handler when save button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentEdit
                            commentText="Some comment"
                            onChange={onChangeMock}
                            onSave={onSaveMock}
                            onCancel={onCancelMock}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const saveButton = screen.getByTestId('DoneIcon');
        fireEvent.click(saveButton);
        expect(onSaveMock).toHaveBeenCalled();
    });

    it('should call onCancel handler when cancel button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CommentEdit
                            commentText="Some comment"
                            onChange={onChangeMock}
                            onSave={onSaveMock}
                            onCancel={onCancelMock}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const cancelButton = screen.getByTestId('cancelIcon');
        fireEvent.click(cancelButton);
        expect(onCancelMock).toHaveBeenCalled();
    });
});
