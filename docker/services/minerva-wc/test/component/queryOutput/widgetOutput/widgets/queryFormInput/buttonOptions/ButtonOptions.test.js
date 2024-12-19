import { render, fireEvent, screen } from '@testing-library/preact';
import ButtonOptions from '../../../../../../../src/component/queryOutput/widgetOutput/widgets/queryFormInput/buttonOptions/ButtonOptions';

describe('ButtonOptions test', () => {
    const buttonParams1 = {
        buttons: [
            null, {query: "Test1"}, {query: "Test2", variant: "outlined"}, {query: "Test3", variant: "text"}
        ]
    }
    const handleClick = jest.fn();
    test('component should render', () => {
        const { container } = render(<ButtonOptions params={buttonParams1} onClick={handleClick} />);
        expect(container.textContent).toMatch('Test1');
        expect(container.textContent).toMatch('Test2');
        expect(container.textContent).toMatch('Test3');
    });

    test('component click', () => {
        const { container } = render(<ButtonOptions params={buttonParams1} onClick={handleClick} />);
        expect(container.textContent).toMatch('Test1');
        fireEvent.click(screen.getByText("Test1"));
        expect(handleClick).toHaveBeenCalled()
    });
});
