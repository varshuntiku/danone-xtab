import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NumberRangeSelect from '../../../components/AppWidgetMultiSelect/NumberRangeSelect';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts NumberRangeSelect Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NumberRangeSelect {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
    });

    describe('Test NumberRangeSelect Component for enableInputBox param', () => {
        test('Should not render input box if enableInputBox is false', () => {
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {...props} />
                    </Router>
                </CustomThemeContextProvider>
            );
            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.queryByLabelText('value')).not.toBeInTheDocument();
        });

        test('Should render input box if enableInputBox is true', () => {
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {...props2} />
                    </Router>
                </CustomThemeContextProvider>
            );
            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.getByLabelText('value')).toBeInTheDocument();
        });
    });

    describe('Test NumberRangeSelect Component for different range selectors', () => {
        test('Should render one input box if range is a single value', () => {
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {...props2} />
                    </Router>
                </CustomThemeContextProvider>
            );

            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.queryByLabelText('value')).toBeInTheDocument();
            expect(screen.queryByLabelText('range-max')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('range-min')).not.toBeInTheDocument();
        });

        test('Should render one input box if range is a single value array', () => {
            const _props2 = { ...props2, value: [5] };
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {..._props2} />
                    </Router>
                </CustomThemeContextProvider>
            );

            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.queryByLabelText('value')).toBeInTheDocument();
            expect(screen.queryByLabelText('range-max')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('range-min')).not.toBeInTheDocument();
        });

        test('Should render min and max input boxes if range is an array with 2 values', () => {
            const _props2 = { ...props2, value: [5, 6] };
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {..._props2} />
                    </Router>
                </CustomThemeContextProvider>
            );
            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.queryByLabelText('value')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('range-max')).toBeInTheDocument();
            expect(screen.queryByLabelText('range-min')).toBeInTheDocument();
        });

        test('Should not render input boxes if range is an array with more than 2 values', () => {
            const _props2 = { ...props2, value: [5, 6, 7] };
            const { debug } = render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NumberRangeSelect {..._props2} />
                    </Router>
                </CustomThemeContextProvider>
            );
            expect(screen.getByLabelText('Slider_0')).toBeInTheDocument();
            expect(screen.queryByLabelText('value')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('range-max')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('range-min')).not.toBeInTheDocument();
        });
    });
});

const props = {
    value: 5,
    onChange: () => {},
    params: {
        title: 'Select number range:',
        min: -10,
        max: 20,
        step: 0.01,
        enableInputBox: false
    }
};

const props2 = {
    value: 5,
    onChange: () => {},
    params: {
        title: 'Select number range:',
        min: -10,
        max: 20,
        step: 0.01,
        enableInputBox: true
    }
};
