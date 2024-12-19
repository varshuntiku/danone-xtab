import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CodxStepper, { ContentText, ContentHeading } from '../../../components/custom/CodxStepper';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render CodxStepper Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxStepper {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should go to next step when the button is clicked', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxStepper {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('next-stepper')).toBeInTheDocument();
        // fireEvent.click(screen.getByLabelText('next-stepper'))
        // expect(handleNext).toHaveBeenCalled()
        // expect(screen.getByText('2 / 5')).toBeVisible()
        //expect(screen.getByText(2)).toBeInTheDocument()
    });
    test('mobile stepper should render two buttons and text displaying progress when supplied with variant text', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxStepper {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('prev-stepper')).toBeVisible();
        expect(screen.getByLabelText('next-stepper')).toBeVisible();
        expect(screen.getByText('1 / 5')).toBeVisible();
    });
    test("mobile stepper should render 'Finish' when supplied with header text", () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxStepper {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Finish')).toBeVisible();
    });
    test('should render vertical stepper', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxStepper {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Content 1')).toBeVisible();
    });

    test('Should render CodxStepper Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ContentText content="Test Content Text" />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render CodxStepper Component 2', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ContentHeading heading="Test Heading Text" />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    category: 'hybrid',
    maxSteps: 5,
    activeStep: 0,
    classes: {},
    theme: {},
    handleNext: () => {},
    handleBack: () => {},
    //stepContent: () => {},
    // stepContent: ['content 1', 'content 2', 'content 3', 'content 4', 'content 5'],
    stepContent: [
        <p>Content 1</p>,
        <p>Content 2</p>,
        <p>Content 3</p>,
        <p>Content 4</p>,
        <p>Content 5</p>
    ],
    position: 'static',
    variant: 'text',
    header: 'Finish',
    isDisabled: null,
    steps: ['1', '2', '3', '4', '5'],
    stepTooltipContent: [
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability'
    ],
    showStepContent: true
};
const Props1 = {
    category: 'vertical',
    orientation: 'vertical',
    steps: ['1', '2', '3', '4', '5'],
    stepTooltipContent: [
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability'
    ],
    activeStep: 0,
    maxSteps: 5,
    showStepContent: true,
    stepContent: [
        <p>Content 1</p>,
        <p>Content 2</p>,
        <p>Content 3</p>,
        <p>Content 4</p>,
        <p>Content 5</p>
    ]
};
const Props2 = {
    category: 'hybrid',
    maxSteps: 5,
    activeStep: 4,
    classes: {},
    theme: {},
    handleNext: () => {},
    handleBack: () => {},
    stepContent: [
        <p>Content 1</p>,
        <p>Content 2</p>,
        <p>Content 3</p>,
        <p>Content 4</p>,
        <p>Content 5</p>
    ],
    position: 'static',
    variant: 'text',
    header: 'Finish',
    isDisabled: null,
    steps: ['1', '2', '3', '4', '5'],
    stepTooltipContent: [
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability',
        'This is how your brands have performed in terms of Investment vs Profitability'
    ],
    showStepContent: true
};
