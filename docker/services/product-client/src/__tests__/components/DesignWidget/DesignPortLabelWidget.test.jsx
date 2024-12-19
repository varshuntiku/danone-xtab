import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { DesignPortLabel } from '../../../components/DesignWidget/DesignPortLabelWidget.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DesignPortLabel Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignPortLabel {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    classes: {},
    model: {
        getParent: () => ({
            getID: () => 1
        }),
        name: ''
    }
};
