import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Databar from '../../../components/dynamic-form/DataBar';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

const history = createMemoryHistory();

describe('Databar Component', () => {
    test('should render linear progress bar when dataBarType is not Circular', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Databar value={50} dataBarType="Linear" color="#f00" />
                </Router>
            </CustomThemeContextProvider>
        );

        const linearProgress = screen.getByRole('progressbar');
        expect(linearProgress).toBeInTheDocument();
    });

    test('should render circular progress bar when dataBarType is Circular', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Databar
                        value={50}
                        dataBarType="Circular"
                        color={{
                            foregroundProgressBarColor: '#f00',
                            backgroundProgressBarColor: '#0f0'
                        }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const circularProgresses = screen.getAllByRole('progressbar');
        expect(circularProgresses.length).toBe(2);
        const [backgroundProgress, foregroundProgress] = circularProgresses;
        expect(backgroundProgress).toHaveStyle({ color: 'rgb(229, 229, 229)' });
        expect(foregroundProgress).toHaveStyle({ color: '#f00' });
    });

    test('should display the correct value inside the circular progress bar', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Databar
                        value={75}
                        dataBarType="Circular"
                        color={{ foregroundProgressBarColor: '#f00' }}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const valueLabel = screen.getByText('75%');
        expect(valueLabel).toBeInTheDocument();
        expect(valueLabel).toHaveStyle({ color: '#000000' });
    });

    test('should display custom max value when provided', () => {
        const maxPercentValue = {
            customMaxValue: { value: 100, color: '#00f' },
            databarLeftLabelPadding: 10
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Databar
                        value={50}
                        dataBarType="Linear"
                        color="#f00"
                        maxPercentValue={maxPercentValue}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const customMaxLabel = screen.getByText('(100%)');
        expect(customMaxLabel).toBeInTheDocument();
        expect(customMaxLabel).toHaveStyle({ color: '#00f' });
    });

    test('should display total value when databarTotalValue is provided', () => {
        const maxPercentValue = {
            databarTotalValue: '200',
            databarTotalValueColor: '#0f0'
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Databar
                        value={50}
                        dataBarType="Linear"
                        color="#f00"
                        maxPercentValue={maxPercentValue}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const totalValue = screen.getByText('200');
        expect(totalValue).toBeInTheDocument();
        expect(totalValue).toHaveStyle({ color: '#0f0' });
    });
});
