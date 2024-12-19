import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import CustomLink from "../../../../src/component/shared/link/CustomLink";
import RootContextProvider from "../../../../src/context/rootContext";

const mockQueryService = {
    fetchBlobSasUrl: jest.fn(),
    getPublicURL: jest.fn().mockReturnValue("")

};

const mockRootContextValue = {
    queryService: mockQueryService,
};

const contextValue = {
    queryService: {
        fetchBlobSasUrl: jest.fn(),
        getPublicURL: jest.fn().mockReturnValue("https://example.com")
    },
};

describe("CustomLink Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the component with a regular URL", () => {
        const url = "https://example.com";

        render(
            <RootContextProvider value={contextValue}>
                <CustomLink url={url}>Click Here</CustomLink>
            </RootContextProvider>
        );
        waitFor(() => {
            const linkElement = screen.getByText("Click Here");
            expect(linkElement).toBeTruthy();
            expect(linkElement.getAttribute("href")).toBe(url);
        }, {mutationObserverOptions: {attributes: true}})
    });

    test("handles error during SAS URL fetch gracefully", async () => {
        const privateUrl = "private:file123";
        mockQueryService.fetchBlobSasUrl.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <RootContextProvider value={mockRootContextValue}>
                <CustomLink url={privateUrl}>Error Link</CustomLink>
            </RootContextProvider>
        );

        const linkElement = screen.getByText("Error Link");
        expect(linkElement.getAttribute("href")).toBe("")

        // await waitFor(() => {
        //     expect(linkElement).toHaveAttribute("href", "");
        // });

        // expect(mockQueryService.fetchBlobSasUrl).toHaveBeenCalledWith("file123");
    });

    test("triggers click event on the link", () => {
        const url = "https://example.com";
        const handleClick = jest.fn();

        render(
            <RootContextProvider value={contextValue}>
                <CustomLink url={url} onClick={handleClick}>Clickable Link</CustomLink>
            </RootContextProvider>
        );

        const linkElement = screen.getByText("Clickable Link");
        fireEvent.click(linkElement);

        expect(handleClick).toHaveBeenCalled();
    });
});
