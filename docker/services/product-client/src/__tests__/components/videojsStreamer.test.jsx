import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';
import { expect, vi } from 'vitest';
import VideoJS from '../../components/videojsStreamer';

const history = createMemoryHistory();

describe('VideoJS Component', () => {
    const defaultOptions = {
        autoplay: false,
        controls: true,
        sources: [{ src: 'https://example.com/video.mp4', type: 'video/mp4' }]
    };

    test('renders the VideoJS component without crashing', () => {
        render(<VideoJS options={defaultOptions} />);

        const videoContainer = screen.getByRole('region');
        expect(videoContainer).toBeInTheDocument();
    });

    test('disposes the player on unmount', () => {
        const { unmount } = render(<VideoJS options={defaultOptions} />);

        const videoContainer = screen.getByRole('region');

        expect(videoContainer).toBeInTheDocument();

        unmount();

        expect(videoContainer).not.toBeInTheDocument();
    });
});
