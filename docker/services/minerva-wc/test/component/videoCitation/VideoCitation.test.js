import { render, screen, act } from '@testing-library/preact';
import VideoCitation from '../../../src/component/queryCitation/videoCitation/VideoCitation';
import RootContextProvider, { RootContext } from "../../../src/context/rootContext";
import { signal } from '@preact/signals-core';
import { useContext } from 'preact/hooks';

describe('VideoCitation tests', () => {
    const mockGetAuthToken = jest.fn().mockResolvedValue('mocked-token');
    const mockGetPublicURL = jest.fn().mockResolvedValue('http://mocked-public-url');
    const mockServerUrl = signal('http://mocked-server-url');

    const renderComponent = (data) => {
        return render(
            <RootContextProvider value={{ 
                mainService: { getAuthToken: mockGetAuthToken, serverUrl: mockServerUrl },
                queryService: { getPublicURL: mockGetPublicURL }
            }}>
                <VideoCitation data={data} />
            </RootContextProvider>
        );
    };

    test('component should render with video element', () => {
        const data = {
            src: 'video.mp4',
            rangeStart: 10,
            rangeEnd: 20
        };
    
        const { container } = renderComponent(data);
    
        const videoElement = container.querySelector('video');
        expect(videoElement).toBeTruthy();
    });    

    test('should set video time to rangeStart on mount', async () => {
        const data = {
            src: 'video.mp4',
            rangeStart: 10,
            rangeEnd: 20
        };

        const { container } = renderComponent(data);
        const videoElement = container.querySelector('video');

        await act(async () => {
            videoElement.dispatchEvent(new Event('loadedmetadata'));
        });

        expect(videoElement.currentTime).toBe(10);
    });

    test('should pause video when current time reaches rangeEnd', async () => {
        const data = {
            src: 'video.mp4',
            rangeStart: 0,
            rangeEnd: 5
        };

        const { container } = renderComponent(data);
        const videoElement = container.querySelector('video');

        await act(async () => {
            videoElement.currentTime = 6;
            videoElement.dispatchEvent(new Event('timeupdate'));
        });

        expect(videoElement.paused).toBe(true);
    });

    test('should call getPublicURL and getAuthToken on mount', async () => {
        const data = {
            src: 'video.mp4',
            rangeStart: 10,
            rangeEnd: 20
        };

        await act(async () => {
            renderComponent(data);
        });

        expect(mockGetPublicURL).toHaveBeenCalledWith('video.mp4');
        expect(mockGetAuthToken).toHaveBeenCalled();
    });
});
