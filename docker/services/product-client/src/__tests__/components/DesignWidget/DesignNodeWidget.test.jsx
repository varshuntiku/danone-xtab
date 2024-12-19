import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DesignNodeWidget from '../../../components/DesignWidget/DesignNodeWidget.jsx';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

vi.mock('./CodxCircularLoader', () => ({
    default: vi.fn(() => <div>Loading...</div>)
}));

vi.mock('./ConfirmPopup', () => ({
    default: vi.fn(({ children }) => <div>{children(vi.fn())}</div>)
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render the toolbar when show_toolbar is true', () => {
        const toolbarProps = {
            ...Props,
            node: {
                ...Props.node,
                show_toolbar: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...toolbarProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const toolbarElement = screen.getByLabelText('Inputs');
        expect(toolbarElement).toBeInTheDocument();
    });

    test('Should render the correct execution status icon for FINISHED', () => {
        const statusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'FINISHED',
                execution_updated_at: '2023-08-07T12:34:56Z'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...statusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const finishedIcon = screen.getByLabelText('SUCCESS');
        expect(finishedIcon).toBeInTheDocument();
    });

    test('Should render the correct execution status icon for QUEUED', () => {
        const statusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'QUEUED'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...statusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const queuedIcon = screen.getByLabelText('QUEUED');
        expect(queuedIcon).toBeInTheDocument();
    });

    test('Should render the correct execution status icon for IN-PROGRESS', () => {
        const statusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'IN-PROGRESS'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...statusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const statusDiv = screen.getByTestId('status-in-progress');
        expect(statusDiv).toBeInTheDocument();

        expect(statusDiv).toHaveStyle({
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: '2',
            height: '100%',
            width: '100%'
        });
    });
    test('Should render the correct execution status icon for FINISHED', () => {
        const statusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'FINISHED'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...statusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const statusDiv = screen.getByTestId('status-finished');
        expect(statusDiv).toBeInTheDocument();

        expect(statusDiv).toHaveStyle({
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: '2',
            height: '100%',
            width: '100%'
        });
    });

    test('Should render the correct execution status icon for FAILED', () => {
        const statusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'FAILED'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...statusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const failedIcon = screen.getByLabelText('FAILED');
        expect(failedIcon).toBeInTheDocument();
    });

    test('Should render node label or title based on name prop', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const labelElement = screen.getByText('Test Node');
        expect(labelElement).toBeInTheDocument();
    });

    test('Should handle click events on toolbar buttons', () => {
        const clickProps = {
            ...Props,
            node: {
                ...Props.node,
                show_toolbar: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...clickProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const editButton = screen.getByLabelText('Edit');
        fireEvent.click(editButton);

        const playButton = screen.getByLabelText('Execute');
        expect(playButton).toBeInTheDocument();
    });

    test('Should update node color and size based on props', () => {
        const updatedProps = {
            ...Props,
            node: {
                ...Props.node,
                extras: {
                    node_width: 20,
                    node_height: 20,
                    node_color: 'red'
                }
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...updatedProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const nodeElement = screen.getByTestId('node');
        expect(nodeElement).toHaveStyle({ background: 'red' });
        expect(nodeElement).toHaveStyle({ width: '20px' });
        expect(nodeElement).toHaveStyle({ height: '20px' });
    });

    test('Should handle node click event', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const nodeElement = screen.getByTestId('node');
        fireEvent.click(nodeElement);
    });

    test('Should not render the toolbar when show_toolbar is false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const toolbarElement = screen.queryByLabelText('Inputs');
        expect(toolbarElement).not.toBeInTheDocument();
    });

    test('Should handle updates to node properties dynamically', () => {
        const updatedProps = {
            ...Props,
            node: {
                ...Props.node,
                extras: {
                    node_width: 30,
                    node_height: 30,
                    node_color: 'green'
                }
            }
        };

        const { rerender } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...updatedProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const nodeElement = screen.getByTestId('node');
        expect(nodeElement).toHaveStyle({ background: 'green' });
        expect(nodeElement).toHaveStyle({ width: '30px' });
        expect(nodeElement).toHaveStyle({ height: '30px' });

        const newProps = {
            ...updatedProps,
            node: {
                ...updatedProps.node,
                extras: {
                    node_width: 40,
                    node_height: 40,
                    node_color: 'yellow'
                }
            }
        };

        rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...newProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(nodeElement).toHaveStyle({ background: 'yellow' });
        expect(nodeElement).toHaveStyle({ width: '40px' });
        expect(nodeElement).toHaveStyle({ height: '40px' });
    });

    test('Should render a loading spinner when execution_processing is true', () => {
        const processingProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_processing: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...processingProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const spinnerElement = screen.getByTestId('loading-spinner');
        expect(spinnerElement).toBeInTheDocument();
    });

    test('Should render success icon when execution_success is true', () => {
        const successProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_success: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...successProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const successIcon = screen.getByTestId('success-icon');
        expect(successIcon).toBeInTheDocument();
    });

    test('Should render error icon when execution_failure is true', () => {
        const failureProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_failure: true
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...failureProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const errorIcon = screen.getByTestId('error-icon');
        expect(errorIcon).toBeInTheDocument();
    });

    test('Should handle invalid execution status gracefully', () => {
        const invalidStatusProps = {
            ...Props,
            node: {
                ...Props.node,
                execution_status: 'INVALID_STATUS'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DesignNodeWidget {...invalidStatusProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const statusElement = screen.queryByLabelText('INVALID_STATUS');
        expect(statusElement).not.toBeInTheDocument();
    });
});

const Props = {
    classes: {},
    node: {
        id: 1,
        light_color: '',
        extras: {
            node_width: 12,
            node_height: 12,
            node_color: 'blue'
        },
        getInPorts: () => [],
        getOutPorts: () => [],
        comments_count: 0,
        attachments_count: 0,
        show_toolbar: false,
        show_inputs: false,
        execution_status: '',
        execution_updated_at: '',
        execution_logs: '',
        execution_processing: false,
        execution_success: false,
        execution_failure: false,
        name: 'Test Node'
    },
    design_obj: {
        state: {
            item_selected: { id: 1 }
        }
    },
    notebook_id: 1,
    iteration_id: 1
};
