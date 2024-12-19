import { render } from '@testing-library/preact';
import CardView from '../../../../../../src/component/queryOutput/widgetOutput/widgets/cardView/CardView';

describe('CardView test', () => {
    test('component should render', () => {
        const params = {
            "data": {
              "values": [
                [0],
                [2012]
              ],
              "columns": [
                "AVERAGE SALES",
                "year"
              ]
            },
            "layout": {}
          }
        const { container } = render(<CardView graphData={params}  />);
        expect(container.textContent).toMatch('AVERAGE SALES');
        expect(container.textContent).toMatch('year');
        expect(container.textContent).toMatch('2012');
    });
});
