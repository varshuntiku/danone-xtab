import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import ChatGPTSummary from '../../components/ChatGPTSummary';
import {
    getScreenAIResponse,
    saveScreenAIResponse,
    rateScreenAIResponse,
    getScreenAIResponseRatings
} from '../../services/ai_response';
import { getchatgptText } from '../../services/chatgpt';
import { vi } from 'vitest';

vi.mock('../../services/ai_response', () => ({
    getScreenAIResponse: vi.fn(),
    saveScreenAIResponse: vi.fn(),
    rateScreenAIResponse: vi.fn(),
    getScreenAIResponseRatings: vi.fn()
}));

vi.mock('../../services/chatgpt', () => ({
    getchatgptText: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test: ChatGPTSummary', () => {
    afterEach(cleanup);

    test('Should render chatgpt blub icon', () => {
        const { getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
    });

    test('Should render draggable insight container on click of bulb icon', () => {
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();

        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('AI generated summary & insights');
        expect(containerTitle).toBeInTheDocument();
    });

    test('Should render saved insight response if any on chatgpt container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: {
                    response:
                        '\n\nSummary: \nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the company. The key insights show that there are areas where improvement can be made in terms of customer satisfaction, operational efficiency and cost savings. Recommended actions include increasing customer engagement through better communication strategies, improving processes and procedures for greater efficiency, and reducing costs by streamlining operations. \n\nKey Insights: \n- Customer satisfaction levels are below average compared to competitors. \n- Operational efficiency needs to be improved in order to reduce costs. \n- Cost savings can be achieved by streamlining operations.  \n\nRecommended Actions: \n1) Increase customer engagement through better communication strategies such as email campaigns or social media outreach.  \n2) Improve processes and procedures for greater operational efficiency which will lead to cost savings over time.  \n3) Reduce costs by streamlining operations such as automating certain tasks or consolidating services when possible.',
                    config: {
                        prompt: 'Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                        max_tokens: '512',
                        temperature: '0.3',
                        presence_penalty: '1',
                        frequency_penalty: '1',
                        best_of: '1',
                        top_p: '1'
                    }
                },
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: [
                    {
                        rating: 4,
                        by: 'Test User'
                    }
                ]
            })
        );
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('The charts, insights and metrics provided', {
            exact: false
        });
        expect(containerTitle).toBeInTheDocument();
    });

    test('Should render prompt form if there is no saved response on chatgpt container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ callback }) =>
            callback({
                id: 'cmpl-7TTPgJHQKU1BM79xqVhauK5isAKbW',
                object: 'text_completion',
                created: 1687258932,
                model: 'text-davinci-003',
                choices: [
                    {
                        text: '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                        index: 0,
                        finish_reason: 'stop',
                        logprobs: null,
                        message: {
                            content: 'Test Content'
                        }
                    }
                ],
                usage: {
                    completion_tokens: 144,
                    prompt_tokens: 38,
                    total_tokens: 182
                }
            })
        );
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        // const containerTitle = getByText('Configure AI prompt');
        // expect(containerTitle).toBeInTheDocument();

        const insightBtn = getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        expect(getByText('AI generated summary & insights')).toBeInTheDocument();
    });

    test('Should render error info when fetch insight api fails and close the insight container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ failureCallback }) => failureCallback());
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const insightBtn = getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        const errorInfo = getByText('Please try again after sometime.');
        expect(errorInfo).toBeInTheDocument();
    });

    test('Should verify the insight and mark it as saved insight', () => {
        getScreenAIResponse.mockImplementationOnce(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ callback }) =>
            callback({
                id: 'cmpl-7TTPgJHQKU1BM79xqVhauK5isAKbW',
                object: 'text_completion',
                created: 1687258932,
                model: 'text-davinci-003',
                choices: [
                    {
                        text: '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                        index: 0,
                        finish_reason: 'stop',
                        logprobs: null,
                        message: {
                            content: 'Test Content'
                        }
                    }
                ],
                usage: {
                    completion_tokens: 144,
                    prompt_tokens: 38,
                    total_tokens: 182
                }
            })
        );
        saveScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                status: 'success'
            })
        );
        getScreenAIResponse.mockImplementationOnce(({ callback }) =>
            callback({
                ai_response:
                    '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: []
            })
        );
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const insightBtn = screen.getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        const verifyBtn = getByTestId('verify-insight');
        expect(verifyBtn).toBeInTheDocument();

        fireEvent.click(verifyBtn);
    });

    test('Should render the AI response rating list', () => {
        getScreenAIResponse.mockImplementationOnce(({ callback }) =>
            callback({
                ai_response: {
                    response:
                        '\n\nSummary: \nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the company. The key insights show that there are areas where improvement can be made in terms of customer satisfaction, operational efficiency and cost savings. Recommended actions include increasing customer engagement through better communication strategies, improving processes and procedures for greater efficiency, and reducing costs by streamlining operations. \n\nKey Insights: \n- Customer satisfaction levels are below average compared to competitors. \n- Operational efficiency needs to be improved in order to reduce costs. \n- Cost savings can be achieved by streamlining operations.  \n\nRecommended Actions: \n1) Increase customer engagement through better communication strategies such as email campaigns or social media outreach.  \n2) Improve processes and procedures for greater operational efficiency which will lead to cost savings over time.  \n3) Reduce costs by streamlining operations such as automating certain tasks or consolidating services when possible.',
                    config: {
                        prompt: 'Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                        max_tokens: '512',
                        temperature: '0.3',
                        presence_penalty: '1',
                        frequency_penalty: '1',
                        best_of: '1',
                        top_p: '1'
                    }
                },
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: []
            })
        );
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        // expect(getByText('No rating')).toBeInTheDocument();
        // fireEvent.click(getByText('No rating'));
        // expect(getByText('Rating Details')).toBeInTheDocument();

        // const closeBtn = getByRole('button', { name: 'Close' });
        // fireEvent.click(closeBtn);
        // expect(getByText('No rating')).toBeInTheDocument();
    });

    test('Should save the AI response rating', () => {
        getScreenAIResponse.mockImplementationOnce(({ callback }) =>
            callback({
                ai_response: {
                    response:
                        '\n\nSummary: \nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the company. The key insights show that there are areas where improvement can be made in terms of customer satisfaction, operational efficiency and cost savings. Recommended actions include increasing customer engagement through better communication strategies, improving processes and procedures for greater efficiency, and reducing costs by streamlining operations. \n\nKey Insights: \n- Customer satisfaction levels are below average compared to competitors. \n- Operational efficiency needs to be improved in order to reduce costs. \n- Cost savings can be achieved by streamlining operations.  \n\nRecommended Actions: \n1) Increase customer engagement through better communication strategies such as email campaigns or social media outreach.  \n2) Improve processes and procedures for greater operational efficiency which will lead to cost savings over time.  \n3) Reduce costs by streamlining operations such as automating certain tasks or consolidating services when possible.',
                    config: {
                        prompt: 'Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                        max_tokens: '512',
                        temperature: '0.3',
                        presence_penalty: '1',
                        frequency_penalty: '1',
                        best_of: '1',
                        top_p: '1'
                    }
                },
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: []
            })
        );
        rateScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                status: 'success'
            })
        );
        getScreenAIResponseRatings.mockImplementation(({ callback }) =>
            callback({
                ratings: [
                    {
                        rating: 5,
                        by: 'Test User'
                    }
                ]
            })
        );
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        // expect(getByText('No rating')).toBeInTheDocument();
        // fireEvent.click(getByText('No rating'));
        // expect(getByText('Rating Details')).toBeInTheDocument();

        // const ratingRadioUnchecked = getByTestId('rating-5-unchecked');
        // expect(ratingRadioUnchecked).toBeInTheDocument();
        // fireEvent.click(ratingRadioUnchecked);
        // const ratingRadioChecked = getByTestId('rating-5-checked');
        // expect(ratingRadioChecked).toBeInTheDocument();
        // expect(ratingRadioUnchecked).not.toBeInTheDocument();

        // const submitBtn = getByRole('button', { name: 'Submit' });
        // expect(submitBtn).toBeInTheDocument();
        // fireEvent.click(submitBtn);
    });

    test('Should regenerate the insight response on click of refresh button', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: {
                    response:
                        '\n\nSummary: \nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the company. The key insights show that there are areas where improvement can be made in terms of customer satisfaction, operational efficiency and cost savings. Recommended actions include increasing customer engagement through better communication strategies, improving processes and procedures for greater efficiency, and reducing costs by streamlining operations. \n\nKey Insights: \n- Customer satisfaction levels are below average compared to competitors. \n- Operational efficiency needs to be improved in order to reduce costs. \n- Cost savings can be achieved by streamlining operations.  \n\nRecommended Actions: \n1) Increase customer engagement through better communication strategies such as email campaigns or social media outreach.  \n2) Improve processes and procedures for greater operational efficiency which will lead to cost savings over time.  \n3) Reduce costs by streamlining operations such as automating certain tasks or consolidating services when possible.',
                    config: {
                        prompt: 'Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                        max_tokens: '512',
                        temperature: '0.3',
                        presence_penalty: '1',
                        frequency_penalty: '1',
                        best_of: '1',
                        top_p: '1'
                    }
                },
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: [
                    {
                        rating: 4,
                        by: 'Test User'
                    }
                ]
            })
        );
        getchatgptText.mockImplementation(({ callback }) =>
            callback({
                id: 'cmpl-7TTPgJHQKU1BM79xqVhauK5isAKbW',
                object: 'text_completion',
                created: 1687258932,
                model: 'text-davinci-003',
                choices: [
                    {
                        text: '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                        index: 0,
                        finish_reason: 'stop',
                        logprobs: null,
                        message: {
                            content: 'Test Content'
                        }
                    }
                ],
                usage: {
                    completion_tokens: 144,
                    prompt_tokens: 38,
                    total_tokens: 182
                }
            })
        );
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('AI generated summary & insights');
        expect(containerTitle).toBeInTheDocument();

        const insightText = getByText('Key Insights:');
        expect(insightText).toBeInTheDocument();

        const regenerateBtn = getByTestId('refresh-insight');
        expect(regenerateBtn).toBeInTheDocument();
        fireEvent.click(regenerateBtn);

        const insightBtn = screen.getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        const verifyBtn = getByTestId('verify-insight');
        expect(verifyBtn).toBeInTheDocument();
    });

    test('Should close draggable insight container on click of close icon', () => {
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();

        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('AI generated summary & insights');
        expect(containerTitle).toBeInTheDocument();

        const closeBtn = getByTestId('close-insight');
        fireEvent.click(closeBtn);
        expect(container).not.toBeInTheDocument();
    });
    test('Should render draggable insight container on click of bulb icon', () => {
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();

        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('AI generated summary & insights');
        expect(containerTitle).toBeInTheDocument();
    });

    test('Should render saved insight response if any on chatgpt container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: {
                    response:
                        '\n\nSummary: \nThe charts, insights and metrics provided indicate that there is a need to improve the overall performance of the company. The key insights show that there are areas where improvement can be made in terms of customer satisfaction, operational efficiency and cost savings. Recommended actions include increasing customer engagement through better communication strategies, improving processes and procedures for greater efficiency, and reducing costs by streamlining operations. \n\nKey Insights: \n- Customer satisfaction levels are below average compared to competitors. \n- Operational efficiency needs to be improved in order to reduce costs. \n- Cost savings can be achieved by streamlining operations.  \n\nRecommended Actions: \n1) Increase customer engagement through better communication strategies such as email campaigns or social media outreach.  \n2) Improve processes and procedures for greater operational efficiency which will lead to cost savings over time.  \n3) Reduce costs by streamlining operations such as automating certain tasks or consolidating services when possible.',
                    config: {
                        prompt: 'Instructions: Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                        max_tokens: '512',
                        temperature: '0.3',
                        presence_penalty: '1',
                        frequency_penalty: '1',
                        best_of: '1',
                        top_p: '1'
                    }
                },
                verified_at: '19 June, 2023 11:30',
                verified_by_email: 'testuser@test.com',
                verified_by_user: 'Test User',
                ratings: [
                    {
                        rating: 4,
                        by: 'Test User'
                    }
                ]
            })
        );
        const { getByTestId, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const containerTitle = getByText('The charts, insights and metrics provided', {
            exact: false
        });
        expect(containerTitle).toBeInTheDocument();
    });

    test('Should render prompt form if there is no saved response on chatgpt container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ callback }) =>
            callback({
                id: 'cmpl-7TTPgJHQKU1BM79xqVhauK5isAKbW',
                object: 'text_completion',
                created: 1687258932,
                model: 'text-davinci-003',
                choices: [
                    {
                        text: '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                        index: 0,
                        finish_reason: 'stop',
                        logprobs: null,
                        message: {
                            content: 'Test Content'
                        }
                    }
                ],
                usage: {
                    completion_tokens: 144,
                    prompt_tokens: 38,
                    total_tokens: 182
                }
            })
        );
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');

        const insightBtn = getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        expect(getByText('AI generated summary & insights')).toBeInTheDocument();
    });

    test('Should render error info when fetch insight api fails and close the insight container', () => {
        getScreenAIResponse.mockImplementation(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ failureCallback }) => failureCallback());
        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const insightBtn = getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        const errorInfo = getByText('Please try again after sometime.');
        expect(errorInfo).toBeInTheDocument();
    });

    test('Should verify the insight and mark it as saved insight', async () => {
        getScreenAIResponse.mockImplementationOnce(({ callback }) =>
            callback({
                ai_response: null,
                verified_at: false,
                verified_by_email: false,
                verified_by_user: false,
                ratings: []
            })
        );
        getchatgptText.mockImplementation(({ callback }) =>
            callback({
                id: 'cmpl-7TTPgJHQKU1BM79xqVhauK5isAKbW',
                object: 'text_completion',
                created: 1687258932,
                model: 'text-davinci-003',
                choices: [
                    {
                        text: '\n\nSummary:\nThe charts, insights and metrics provided give an overview of the performance of a given system. The data shows that the system is performing well overall, but there are some areas that could be improved.\n\nKey Insights:\n- The system is performing well overall, with most metrics showing positive results.\n- There are some areas of improvement, such as increasing the number of users and improving the user experience.\n\nRecommended Actions:\n- Increase the number of users by implementing targeted marketing campaigns.\n- Improve the user experience by making changes to the user interface and adding features that enhance the user experience.\n- Monitor the performance of the system regularly to identify any areas of improvement.',
                        index: 0,
                        finish_reason: 'stop',
                        logprobs: null,
                        message: {
                            content: 'Test Content'
                        }
                    }
                ],
                usage: {
                    completion_tokens: 144,
                    prompt_tokens: 38,
                    total_tokens: 182
                }
            })
        );
        saveScreenAIResponse.mockImplementation(() => Promise.resolve({}));

        const { getByTestId, getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatGPTSummary props={Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const iconBtn = getByTestId('ChatGPT-icon');
        expect(iconBtn).toBeInTheDocument();
        fireEvent.click(iconBtn);

        const insightBtn = getByRole('button', { name: 'Generate Insights' });
        expect(insightBtn).toBeInTheDocument();
        fireEvent.click(insightBtn);

        await waitFor(() => expect(saveScreenAIResponse).toHaveBeenCalled());

        const container = getByTestId('chatgpt-summary-container');
        expect(container).toHaveClass('react-draggable');
    });
});

const Props = {
    app_id: 328,
    screen_id: 13812,
    data_items: [
        {
            data: {
                widget_value_id: 1343845,
                value: {
                    table_headers: ['Name', 'Age'],
                    table_data: [
                        ['tom', 10],
                        ['nick', 15],
                        ['juli', 14]
                    ],
                    show_searchbar: true
                },
                simulated_value: false
            }
        }
    ]
};
