import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DesignDroppable from '../../../components/DesignWidget/DesignDroppable';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DesignDroppable Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignDroppable {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('card')).toBeInTheDocument();
        fireEvent.dragOver(screen.getByText('Widget 1'));
        fireEvent.drop(screen.getByText('Widget 1'), {
            dataTransfer: { getData: () => JSON.stringify({ type: 'widget' }) }
        });
        fireEvent.drop(screen.getByText('Widget 1'), {
            dataTransfer: { getData: () => JSON.stringify({}) }
        });
    });
});

const Props = {
    classes: {},
    widgets: [<p>Widget 1</p>],
    parent_obj: {
        onDropWidget: () => {}
    }
};
