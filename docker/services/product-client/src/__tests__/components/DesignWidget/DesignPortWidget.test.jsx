import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { DesignPortWidget } from '../../../components/DesignWidget/DesignPortWidget.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DesignPortWidget Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignPortWidget {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.mouseEnter(screen.getByLabelText('design-port'));
        fireEvent.mouseLeave(screen.getByLabelText('design-port'));
    });
});

const Props = {
    classes: {},
    model: {
        getParent: () => ({}),
        name: ''
    },
    node: {
        getID: () => 1
    }
};
