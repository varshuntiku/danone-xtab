import { fireEvent, render, screen } from '@testing-library/preact';
import ImageView from '../../../../../../src/component/queryOutput/widgetOutput/widgets/imageView/ImageView';
import RootContextProvider, { RootContext } from '../../../../../../src/context/rootContext';
import QueryService from '../../../../../../src/service/queryService';
import MainService from '../../../../../../src/service/mainService';
import { act } from 'preact/test-utils';

describe('ImageView test', () => {

    beforeAll(() => {
        HTMLImageElement.prototype.requestFullscreen = function() {
            return Promise.resolve(undefined)
        };
      });
    test('component should render', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const params = [
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                caption: "blue leaf"
            }
        ]
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <ImageView data={params} />
        </RootContextProvider>);
        expect(container.textContent).toMatch('blue leaf');
    });

    test('component should fetch accessible url when image url is prefixed with private: ', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const params = [
            {
                url: "private:https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                caption: "blue leaf"
            }
        ]
        const fetchBlobSasUrl = jest.fn().mockResolvedValue("https://www.kasandbox.org/programming-images/avatars/leaf-blue.png")
        queryService.fetchBlobSasUrl = fetchBlobSasUrl
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <ImageView data={params} />
        </RootContextProvider>);

        expect(fetchBlobSasUrl).toHaveBeenCalledWith("https://www.kasandbox.org/programming-images/avatars/leaf-blue.png")
    });

    test('component should fetch action buttons when there are more than 1 image ', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const params = [
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                caption: "blue leaf"
            },
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
                caption: "green leaf"
            }
        ]
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <ImageView data={params} />
        </RootContextProvider>);

        expect(container.textContent).toMatch('Prev')
        expect(container.textContent).toMatch('Next')

    });

    test('component should navigate between images through action buttons', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const params = [
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                caption: "blue leaf"
            },
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
                caption: "green leaf"
            }
        ]
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <ImageView data={params} />
        </RootContextProvider>);

        //test if buttons are visible
        expect(container.textContent).toMatch('Prev')
        expect(container.textContent).toMatch('Next')

        //test for first image and action buttons
        expect(container.textContent).toMatch('blue leaf')
        expect(container.textContent).not.toMatch('green leaf')
        expect(container.textContent).toMatch('1 / 2')

        const prevBtn = screen.getByText('Prev')
        const nextBtn = screen.getByText('Next')

        //test for forward navigation
        fireEvent.click(nextBtn)
        expect(container.textContent).not.toMatch('blue leaf')
        expect(container.textContent).toMatch('green leaf')
        expect(container.textContent).toMatch('2 / 2')

        //test for backward navigation
        fireEvent.click(prevBtn)
        expect(container.textContent).toMatch('blue leaf')
        expect(container.textContent).not.toMatch('green leaf')
        expect(container.textContent).toMatch('1 / 2')

    });

    test('component should render image in fullscreen', async () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const params = [
            {
                url: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                caption: "blue leaf"
            }
        ]
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <ImageView data={params} />
        </RootContextProvider>);
        expect(container.textContent).toMatch('blue leaf');

        const fullScreenBtn = screen.getByTitle('Open in full screen')
        act(() => {
            fireEvent.click(fullScreenBtn)
        })
    });

});
