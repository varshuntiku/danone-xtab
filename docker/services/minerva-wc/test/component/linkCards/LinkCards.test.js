import { render, screen } from '@testing-library/preact';
import LinkCards from '../../../src/component/queryOutput/widgetOutput/widgets/linkCards/LinkCards';

describe('LinkCards Component', () => {
    const testData = {
        title: 'Test Title',
        items: [
            {
                url: 'https://example.com',
                logo: 'test_logo',
                title: 'Test Item 1',
                desc: 'Test Description 1',
                caption: 'Test Caption 1'
            },
            {
                url: 'https://example.org',
                logo: 'test_logo_2',
                title: 'Test Item 2',
                desc: 'Test Description 2'
            }
        ]
    };

    test('renders with partial data', () => {
        const partialData = {
            title: 'Partial Title',
            items: [
                {
                    url: 'https://example.com',
                    logo: 'test_logo',
                    title: 'Partial Item 1'
                    // missing desc and caption
                }
            ]
        };

        render(<LinkCards data={partialData} />);

        expect(screen.getByText('Partial Title')).toBeTruthy();

        const link = screen.getByRole('link');
        expect(link.getAttribute("href")).toBe('https://example.com');
        expect(screen.getByText('Partial Item 1')).toBeTruthy();
        expect(screen.queryByText('Test Description 1')).not.toBeTruthy();
        expect(screen.queryByText('Test Caption 1')).not.toBeTruthy();
    });

    test('renders without data', () => {
        render(<LinkCards data={{}} />);

        expect(screen.queryByText('Test Title')).not.toBeTruthy();

        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    test('renders with an empty items array', () => {
        const emptyItemsData = {
            title: 'Empty Items Title',
            items: []
        };

        render(<LinkCards data={emptyItemsData} />);

        expect(screen.getByText('Empty Items Title')).toBeTruthy();

        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
});
