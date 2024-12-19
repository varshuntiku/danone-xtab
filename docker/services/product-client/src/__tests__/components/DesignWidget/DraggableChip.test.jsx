import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DraggableChip from '../../../components/DesignWidget/DraggableChip.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DraggableChip  Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DraggableChip {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('draggable-chip')).toBeInTheDocument();
        fireEvent.dragStart(screen.getByLabelText('draggable-chip'), {
            dataTransfer: { setData: () => {} }
        });
    });
});

const Props = {
    classes: {},
    lable: 'test label',
    color: '',
    widget_type: 'widget',
    widget_id: 1
};
