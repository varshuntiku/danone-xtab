import { render, screen, fireEvent } from "@testing-library/preact";
import FeedbackComment from "../../../../src/component/shared/feedbackComment/FeedbackComment";
import RootContextProvider from "../../../../src/context/rootContext";

const mockQueryService = {
    updateQueryRecord: jest.fn(),
};
const mockMainService = {
    copilotAppId: {
        value: 'test-app-id'
    }
};

const mockContextValue = {
    queryService: mockQueryService,
    mainService: mockMainService
};

const defaultQuery = {
    id: 'test-query-id',
    comment: {
        type: "Incorrect",
        text: "Initial comment text"
    }
};

describe("FeedbackComment", () => {
    beforeEach(() => {
        mockQueryService.updateQueryRecord.mockClear();
    });

    test("renders feedback comment form correctly", () => {
        render(
            <RootContextProvider value={mockContextValue}>
                <FeedbackComment query={defaultQuery} onCloseComment={jest.fn()} />
            </RootContextProvider>
        );

        expect(screen.getByText("Oh Sorry! Please let us know why did you choose this rating, So we can improve.")).toBeTruthy();
        expect(screen.getByText("Add your comments")).toBeTruthy();
        expect(screen.getByPlaceholderText("Tell us more about what you didn't like...")).toBeTruthy();
    });

    test("submits feedback and shows completed message", () => {
        const onCloseComment = jest.fn();

        render(
            <RootContextProvider value={mockContextValue}>
                <FeedbackComment query={defaultQuery} onCloseComment={onCloseComment} />
            </RootContextProvider>
        );

        fireEvent.submit(screen.getByText("Submit"));

        expect(mockQueryService.updateQueryRecord).toHaveBeenCalledWith('test-query-id', {
            comment: {
                type: "Incorrect",
                text: "Initial comment text"
            }
        });

        expect(screen.getByText("Thanks for your time! Your input helps us improve your copilot experience")).toBeTruthy();
    });

    test("handles close button click", () => {
        const onCloseComment = jest.fn();

        render(
            <RootContextProvider value={mockContextValue}>
                <FeedbackComment query={defaultQuery} onCloseComment={onCloseComment} />
            </RootContextProvider>
        );

        fireEvent.click(screen.getAllByTitle("close")[0]);

        expect(onCloseComment).toHaveBeenCalledTimes(1);
    });

    test("does not render when query ID or copilotAppId is missing", () => {
        const noIdQuery = { ...defaultQuery, id: undefined };

        const { container } = render(
            <RootContextProvider value={mockContextValue}>
                <FeedbackComment query={noIdQuery} onCloseComment={jest.fn()} />
            </RootContextProvider>
        );

        expect(container.firstChild).toBeNull();

        const noAppIdContextValue = {
            ...mockContextValue,
            mainService: { copilotAppId: { value: null } },
        };

        const { container: noAppIdContainer } = render(
            <RootContextProvider value={noAppIdContextValue}>
                <FeedbackComment query={defaultQuery} onCloseComment={jest.fn()} />
            </RootContextProvider>
        );

        expect(noAppIdContainer.firstChild).toBeNull();

    });
});
