import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import infPopupStyles from '../../../components/custom/InfoPopupStyles';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

const history = createMemoryHistory();

const mockTheme = {
    palette: {
        primary: {
            contrastText: '#ffffff'
        },
        background: {
            paper: '#f5f5f5',
            plainBtnBg: '#e0e0e0',
            modelBackground: '#ffffff'
        },
        text: {
            default: '#000000',
            titleText: '#333333'
        },
        border: {
            loginGrid: '#dddddd'
        },
        icons: {
            closeIcon: '#999999'
        }
    },
    spacing: (value) => `${value * 8}px`,
    layoutSpacing: (value) => `${value * 8}px`,
    title: {
        h1: {
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.1em'
        }
    }
};

describe('infPopupStyles', () => {
    it('returns correct styles for assumptionsIcon', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.assumptionsIcon).toEqual({
            cursor: 'pointer',
            zIndex: 2,
            height: '2rem !important',
            width: '2rem !important',
            '& svg': {
                fill: `${mockTheme.palette.primary.contrastText} !important`
            }
        });
    });

    it('returns correct styles for iconContainer', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.iconContainer).toEqual({
            position: 'relative',
            width: mockTheme.layoutSpacing(30),
            height: mockTheme.layoutSpacing(30),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            marginLeft: '1rem',
            marginTop: '-1rem',
            '&:hover': {
                backgroundColor: mockTheme.palette.background.plainBtnBg,
                cursor: 'pointer'
            }
        });
    });

    it('returns correct styles for iconActive', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.iconActive).toEqual({
            backgroundColor: mockTheme.palette.background.plainBtnBg
        });
    });

    it('returns correct styles for customIconLarge', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.customIconLarge).toEqual({
            width: '20px',
            height: '20px',
            fill: mockTheme.palette.primary.contrastText
        });
    });

    it('returns correct styles for contentTextNoTitle', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.contentTextNoTitle).toEqual({
            backgroundColor: mockTheme.palette.background.modelBackground,
            padding: 0,
            margin: 0,
            color: mockTheme.palette.text.default,
            maxHeight: mockTheme.spacing(29),
            lineHeight: mockTheme.layoutSpacing(24),
            fontSize: '1.67rem',
            overflow: 'hidden',
            overflowWrap: 'break-word'
        });
    });

    it('returns correct styles for toolTip', () => {
        const styles = infPopupStyles(mockTheme);
        expect(styles.toolTip).toEqual({
            position: 'relative',
            backgroundColor: mockTheme.palette.background.modelBackground,
            border: `1px solid ${mockTheme.palette.border.loginGrid}`,
            color: `${mockTheme.palette.text.default} !important`,
            maxWidth: mockTheme.spacing(60),
            overflowY: 'scroll',
            fontSize: '1.67rem',
            overflowWrap: 'break-word',
            padding: '1.6rem',
            opacity: '1 !important',
            borderRadius: '0 !important',
            '& img': {
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '1rem',
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain'
            },
            '& .MuiTypography-root': {
                fontSize: '1.67rem'
            }
        });
    });
});
