import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { expect, vi } from 'vitest';

import { Provider } from 'react-redux';
import store from 'store/store';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import '@testing-library/jest-dom/extend-expect';
import ComingSoon from '../../../../components/dsWorkbench/projectDetail/ComingSoon';
import Presentation from '../../../../components/dsWorkbench/projectDetail/Presentation';

const history = createMemoryHistory();

vi.mock('../../../../components/dsWorkbench/projectDetail/ComingSoon', () => ({
    default: () => <div data-testid="comingsoon">Coming Soon Component</div>
}));
describe('Deploy Component', () => {
    test('renders ComingSoon component', () => {
        render(<Presentation />);

        expect(screen.getByTestId('comingsoon')).toBeInTheDocument();
        expect(screen.getByText('Coming Soon Component')).toBeInTheDocument();
    });
});
