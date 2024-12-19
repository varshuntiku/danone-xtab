import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import CustomSnackbar from '../../../../src/component/shared/snackbar/CustomSnackbar';
import SnackbarErrorIcon from '../../../../src/svg/SnacbarErrorIcon';
import { h } from 'preact';

// Mock the SVG components
jest.mock('../../../../src/svg/CloseIcon', () => () => <div>CloseIcon</div>);
jest.mock('../../../../src/svg/SnacbarErrorIcon', () => () => <div>SnackbarErrorIcon</div>);
jest.mock('../../../../src/svg/SnackbarSuccessIcon', () => () => <div>SnackbarSuccessIcon</div>);
jest.mock('../../../../src/svg/SnackbarInfoIcon', () => () => <div>SnackbarInfoIcon</div>);
jest.mock('../../../../src/svg/SnackbarWarningIcon', () => () => <div>SnackbarWarningIcon</div>);

describe('CustomSnackbar Component', () => {
    test('renders correctly with required props', () => {
        render(
            <CustomSnackbar
                open={true}
                message="This is a message"
                variant="info"
            />
        );

        expect(screen.getByText('SnackbarInfoIcon')).toBeTruthy();
        expect(screen.getByText('This is a message')).toBeTruthy();
    });

    test('renders with different variants', () => {
        const variants = ['error', 'success', 'info', 'warning'];

        variants.forEach(variant => {
            render(
                <CustomSnackbar
                    open={true}
                    message={`This is a ${variant} message`}
                    variant={variant}
                />
            );

            expect(screen.getByText(`Snackbar${variant.charAt(0).toUpperCase() + variant.slice(1)}Icon`)).toBeTruthy();
            expect(screen.getByText(`This is a ${variant} message`)).toBeTruthy();
        });
    });

    test('renders action button and triggers action click', () => {
        const handleActionClick = jest.fn();
        render(
            <CustomSnackbar
                open={true}
                message="Message with action"
                showActionButton={true}
                actionButtonLabel="Action"
                onActionClick={handleActionClick}
            />
        );

        expect(screen.getByText('Action')).toBeTruthy();

        fireEvent.click(screen.getByText('Action'));
        expect(handleActionClick).toHaveBeenCalled();
    });

    test('renders close button and triggers close click', () => {
        const handleClose = jest.fn();
        render(
            <CustomSnackbar
                open={true}
                message="Message with close"
                showCloseButton={true}
                onClose={handleClose}
            />
        );

        expect(screen.getByTitle('close')).toBeTruthy();

        fireEvent.click(screen.getByTitle('close'));
        expect(handleClose).toHaveBeenCalled();
    });

    test('hides snackbar after autoHideDuration', async () => {
        render(
            <CustomSnackbar
                open={true}
                message="Auto hide message"
                autoHideDuration={1000}
            />
        );

        expect(screen.getByText('Auto hide message')).toBeTruthy();

        await waitFor(() => {
            expect(screen.queryByText('Auto hide message')).not.toBe(true)
        }, { timeout: 1500 });
    });

    test('updates snackbar visibility based on open prop', () => {
        const { rerender } = render(
            <CustomSnackbar
                open={true}
                message="Visible message"
            />
        );

        expect(screen.getByText('Visible message')).toBeTruthy();

        rerender(
            <CustomSnackbar
                open={false}
                message="Visible message"
            />
        );

        expect(screen.queryByText('Visible message')).not.toBe(true);
    });

    test('does not render action button when showActionButton is false', () => {
        render(
            <CustomSnackbar
                open={true}
                message="No action button message"
                showActionButton={false}
            />
        );

        expect(screen.queryByText('Action')).not.toBeTruthy();
    });

    test('does not render close button when showCloseButton is false', () => {
        render(
            <CustomSnackbar
                open={true}
                message="No close button message"
                showCloseButton={false}
            />
        );

        expect(screen.queryByTitle('close')).not.toBeTruthy();
    });

    test('handles type prop correctly', () => {
        const types = ['success', 'error', 'info', 'warning'];

        types.forEach(type => {
            render(
                <CustomSnackbar
                    open={true}
                    message={`Message with type ${type}`}
                    type={type}
                />
            );

            expect(screen.getByText(`Message with type ${type}`)).toBeTruthy();
        });
    });
});
