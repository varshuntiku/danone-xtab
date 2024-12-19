import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import LabelSuggestionInfo from '../../../../components/dynamic-form/inputFields/LabelSuggestionInfo';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('LabelSuggestionInfo Component', () => {
    const classes = {
        iconContainer: 'iconContainer',
        iconButton: 'iconButton',
        infoIcon: 'infoIcon',
        popOverPaper: 'popOverPaper',
        popOverContainer: 'popOverContainer',
        popOverTitleWrapper: 'popOverTitleWrapper',
        popOverTitleSet: 'popOverTitleSet',
        bulbIcon: 'bulbIcon',
        popOverTitleText: 'popOverTitleText',
        closeIcon: 'closeIcon',
        contentText: 'contentText'
    };

    const fieldInfo = {
        infoPopover: {
            title: 'Info Title',
            info: 'Some information about the field',
            icon: true
        }
    };

    const anchorOrigin = { vertical: 'bottom', horizontal: 'center' };
    const transformOrigin = { vertical: 'top', horizontal: 'center' };

    it('renders the InfoOutlinedIcon button', () => {
        render(
            <LabelSuggestionInfo
                classes={classes}
                fieldInfo={null}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            />
        );
        const button = screen.getByRole('button', { name: 'nav-info' });
        expect(button).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'nav-info' }).querySelector('svg')
        ).toBeInTheDocument();
    });

    it('opens the popover on button click', () => {
        render(
            <LabelSuggestionInfo
                classes={classes}
                fieldInfo={fieldInfo}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            />
        );
        const button = screen.getByRole('button', { name: 'nav-info' });
        fireEvent.click(button);

        expect(screen.getByText('Info Title')).toBeInTheDocument();
        expect(screen.getByText('Some information about the field')).toBeInTheDocument();
    });

    it('closes the popover on close icon click', () => {
        render(
            <LabelSuggestionInfo
                classes={classes}
                fieldInfo={fieldInfo}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            />
        );
        const button = screen.getByRole('button', { name: 'nav-info' });
        fireEvent.click(button);

        expect(screen.queryByText('Info Title')).toBeInTheDocument();
    });

    it('does not render the popover if fieldInfo is null', () => {
        render(
            <LabelSuggestionInfo
                classes={classes}
                fieldInfo={null}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            />
        );
        const button = screen.getByRole('button', { name: 'nav-info' });
        fireEvent.click(button);

        expect(screen.queryByRole('presentation')).toBeInTheDocument();
    });
});
