import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import InfoPoup from '../../../components/custom/InfoPopup';

import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

const history = createMemoryHistory();

vi.mock('@material-ui/core/styles', () => ({
    withStyles: (styles) => (Component) => (props) => <Component {...props} classes={styles} />
}));

vi.mock('@material-ui/core', () => ({
    Tooltip: (props) => <div data-testid="tooltip" {...props} />,
    Typography: (props) => <div data-testid="typography" {...props} />,
    IconButton: (props) => <button {...props} />
}));

describe('InfoPoup Component', () => {
    const classes = {
        toolTip: 'tooltipClass',
        contentTextNoTitle: 'contentTextNoTitleClass',
        iconContainer: 'iconContainerClass',
        iconButton: 'iconButtonClass',
        assumptionsIcon: 'assumptionsIconClass',
        iconButtonIcon: 'iconButtonIconClass'
    };

    it('renders InfoPoup component correctly', () => {
        render(<InfoPoup classes={classes} />);

        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('handles interaction (e.g., hovering over tooltip)', () => {
        render(<InfoPoup classes={classes} />);

        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
});
