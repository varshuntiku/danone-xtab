import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ImageTransitions from '../../../../../components/Diagnoseme/components/imagesLayout/ImageTransitions';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

const history = createMemoryHistory();

describe('ImageTransitions Component', () => {
    const mockImageData = ['test-image.jpg', true, 'fade', 'img-class'];

    it('should render the component without crashing', () => {
        render(<ImageTransitions imgData={mockImageData} />);
    });

    it('should render the image with the correct src and class', () => {
        render(<ImageTransitions imgData={mockImageData} />);

        const imgElement = screen.getByRole('img');
        expect(imgElement).toHaveAttribute('src', 'test-image.jpg');
        expect(imgElement).toHaveClass('img-class');
    });

    it('should not render the image when isTrans is false', () => {
        const mockImageDataFalse = ['test-image.jpg', false, 'fade', 'img-class'];

        render(<ImageTransitions imgData={mockImageDataFalse} />);

        const imgElement = screen.queryByRole('img');
        expect(imgElement).not.toBeInTheDocument();
    });
});
