import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import KpiWidget from '../../../../components/createStory/dialog/kpiWidget';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    const defaultProps = {
        params: {
            extra_label: 'Extra Label',
            extra_value: '10',
            extra_dir: 'up',
            variant_color: 'blue',
            extra_dir_color: 'green',
            extra_title: 'Extra Title',
            extra_value_color: 'red'
        },
        item: {
            name: 'KPI Name',
            value: 75,
            variant: 'default'
        },
        classes: {
            graphDataExtraLabelUp: 'up',
            graphDataExtraLabelDown: 'down',
            kpiTitle: 'kpiTitle',
            graphLabelContainer: 'graphLabelContainer',
            kpiGrpahCont: 'kpiGrpahCont',
            percentageVariantKpi: 'percentageVariantKpi',
            circularProgress: 'circularProgress',
            variantPercentageValue: 'variantPercentageValue',
            variantPercentageProgress: 'variantPercentageProgress'
        }
    };

    test('Should render layouts KpiWidget Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget
                        params={{ extra_label: 'test_extra_label', extra_dir: 'up' }}
                        item={{ name: '' }}
                        classes={{}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts KpiWidget Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget
                        params={{ extra_label: 'test_extra_label', extra_dir: 'down' }}
                        item={{ name: '' }}
                        classes={{}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts KpiWidget Component 2', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget params={{ extra_dir: 'up' }} item={{ name: '' }} classes={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts KpiWidget Component 3', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget params={{ extra_dir: 'down' }} item={{ name: '' }} classes={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('renders without extra label or direction', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget
                        params={{ extra_label: 'test_extra_label', extra_dir: 'down' }}
                        item={{ name: '' }}
                        classes={{}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('test_extra_label')).toBeInTheDocument();
        expect(screen.queryByTestId('ArrowUpwardIcon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ArrowDownwardIcon')).not.toBeInTheDocument();
    });

    test('renders percentage variant', () => {
        const props = {
            ...defaultProps,
            item: { ...defaultProps.item, variant: 'percentage' }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <KpiWidget {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('KPI Name')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
    });
});
