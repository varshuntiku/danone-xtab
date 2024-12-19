import { render } from '@testing-library/preact';
import { GridContainer, GridItem } from '../../../../src/component/shared/grid/Grid';

describe('GridContainer test', () => {
    test('component should render', () => {
        const { container } = render(<GridContainer  />);
        expect(container.querySelector(".MinervaGridContainer")).toBeTruthy();
    });
});

describe('GridItem test', () => {
    test('component should render', () => {
        const { container } = render(<GridItem  />);
        expect(container.querySelector(".MinervaGridItem ")).toBeTruthy();
    });

    test("component should render: typeof(xs) === 'number'", () => {
        const { container } = render(<GridItem xs={1}  />);
        expect(container.querySelector(".MinervaGridItem-xs")).toBeTruthy();
    });

    test("component should render: xs === 'auto'", () => {
        const { container } = render(<GridItem xs="auto"  />);
        expect(container.querySelector(".MinervaGridItem-xs-auto")).toBeTruthy();
    });

    test("component should render: xs === true", () => {
        const { container } = render(<GridItem xs  />);
        expect(container.querySelector(".MinervaGridItem-xs-grow")).toBeTruthy();
    });

    test("component should render: xs === 'hide'", () => {
        const { container } = render(<GridItem xs="hide"  />);
        expect(container.querySelector(".MinervaGridItem-xs-hide")).toBeTruthy();
    });
});
