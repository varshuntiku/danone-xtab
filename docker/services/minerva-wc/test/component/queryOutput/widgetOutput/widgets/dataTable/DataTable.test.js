import { fireEvent, render, screen, within } from '@testing-library/preact';
import DataTable from '../../../../../../src/component/queryOutput/widgetOutput/widgets/dataTable/DataTable';

describe('DataTable test', () => {
    const params = {
        "values": [
            [
                "sodax",
                "icex",
                "drinksjet",
                "softella",
                "waterhut"
            ],
            [
                769336,
                1276128,
                3834760,
                180672,
                5738560
            ]
        ],
        "columns": [
            "brand",
            "total_sales"
        ]
    }
    test('component should render', () => {
        const { container } = render(<DataTable columns={params.columns} values={params.values} />);
        expect(container.textContent).toMatch('brand');
        expect(container.textContent).toMatch('total_sales');
    });

    test('component should sort column in asc order on column header click', () => {
        const { container } = render(<DataTable columns={params.columns} values={params.values} />);
        fireEvent.click(screen.getByText("brand"))

        const rows = screen.getAllByRole('cell')
        expect(within(rows[0]).queryByText('drinksjet')).toBeTruthy()
        expect(within(rows[2]).queryByText('icex')).toBeTruthy()
        expect(within(rows[4]).queryByText('sodax')).toBeTruthy()
        expect(within(rows[6]).queryByText('softella')).toBeTruthy()
        expect(within(rows[8]).queryByText('waterhut')).toBeTruthy()
    })

    test('component should sort column in desc order on ascending sorted header click', () => {
        const { container } = render(<DataTable columns={params.columns} values={params.values} />);
        fireEvent.click(screen.getByText("brand"))

        fireEvent.click(screen.getByText("brand"))


        const rows = screen.getAllByRole('cell')
        expect(within(rows[0]).queryByText('waterhut')).toBeTruthy()
        expect(within(rows[2]).queryByText('softella')).toBeTruthy()
        expect(within(rows[4]).queryByText('sodax')).toBeTruthy()
        expect(within(rows[6]).queryByText('icex')).toBeTruthy()
        expect(within(rows[8]).queryByText('drinksjet')).toBeTruthy()
    })

    test('component should sort column in initial order on descending sorted header click', () => {
        const { container } = render(<DataTable columns={params.columns} values={params.values} />);

        fireEvent.click(screen.getByText("brand"))
        fireEvent.click(screen.getByText("brand"))
        fireEvent.click(screen.getByText("brand"))


        const rows = screen.getAllByRole('cell')
        expect(within(rows[0]).queryByText('sodax')).toBeTruthy()
        expect(within(rows[2]).queryByText('icex')).toBeTruthy()
        expect(within(rows[4]).queryByText('drinksjet')).toBeTruthy()
        expect(within(rows[6]).queryByText('softella')).toBeTruthy()
        expect(within(rows[8]).queryByText('waterhut')).toBeTruthy()
    })
});
