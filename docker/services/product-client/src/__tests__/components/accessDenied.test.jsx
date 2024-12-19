import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AccessDenied from '../../components/AccessDenied';

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render Cpdex Product Component', () => {
        const { getByText, debug } = render(<AccessDenied />);
    });
});
