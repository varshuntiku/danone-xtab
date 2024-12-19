/** @jsx h */
import { h } from 'preact';
import { render } from '@testing-library/preact';
import TextList from '../../../../src/component/queryOutput/widgetOutput/widgets/textList/TextList';


jest.mock('../../../../src/component/queryOutput/widgetOutput/citationController/CitationController', () => ({ citation, content, contentType, children }) => (
    <div data-testid="citation-controller">
        {children}
    </div>
));


describe('TextList Component', () => {

    test('should handle empty data gracefully', () => {
        const { container } = render(<TextList data={{ connecter: ', ', list: [] }} />);

        expect(container.querySelector('pre').textContent).toBe('');
    });

    test('should render without crashing when no data is provided', () => {
        const { container } = render(<TextList data={null} />);

        expect(container.querySelector('pre').textContent).toBe('');
    });
});