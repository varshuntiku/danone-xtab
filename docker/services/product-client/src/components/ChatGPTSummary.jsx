import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import chatGPTSummaryStyle from 'assets/jss/chatGPTSummaryStyle.jsx';

import {
    withStyles,
    Typography,
    Button,
    Tooltip,
    TextField,
    ClickAwayListener
} from '@material-ui/core';

import VerifyIcon from '@material-ui/icons/VerifiedUser';
import RefreshIcon from '@material-ui/icons/Refresh';
import ShareIcon from '@material-ui/icons/ShareOutlined';
import {
    Star,
    StarBorder,
    StarHalf,
    RadioButtonUnchecked,
    RadioButtonChecked,
    VerifiedUserOutlined
} from '@material-ui/icons';

import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appScreenWidgetEditorStyle from 'assets/jss/appScreenWidgetEditorStyle.jsx';

import { getchatgptText } from 'services/chatgpt.js';
import {
    getScreenAIResponse,
    saveScreenAIResponse,
    rateScreenAIResponse,
    getScreenAIResponseRatings
} from 'services/ai_response.js';

import CustomSnackbar from './CustomSnackbar';
import clsx from 'clsx';
import nl2br from 'react-newline-to-break';

import * as _ from 'underscore';
import { ReactComponent as AiInsightsIcon } from 'assets/img/aiInsights.svg';
import { ReactComponent as ExpandIcon } from 'assets/img/expandIcon.svg';
import { ReactComponent as MinimizeIcon } from 'assets/img/Minimize.svg';
import { ReactComponent as CopyIcon } from 'assets/img/content_copy.svg';
import { ReactComponent as CloseIcon } from 'assets/img/Ic_Close.svg';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

// const configAiModelsType = [
//     {
//         value: 'Azure OpenAI',
//         label: 'Azure OpenAI'
//     },
//     {
//         value: 'Meta-Llama-3-8B',
//         label: 'Meta-Llama-3-8B'
//     },
//     {
//         value: 'Mixtral-8x7B-Instruct-v0.1',
//         label: 'Mixtral-8x7B-Instruct-v0.1'
//     }
// ];

class ChatGPTSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show_response: false,
            loading_response: false,
            response_text: false,
            verified: false,
            verified_at: false,
            verified_by: false,
            ratings: false,
            current_user_rating: false,
            show_response_ratings: false,
            config: {
                model_name: 'Azure OpenAI',
                prompt: 'Extract summary, key insights and recommended actions from the charts, insights and metrics provided.',
                max_tokens: '512',
                temperature: '0.3',
                presence_penalty: '1',
                frequency_penalty: '1',
                best_of: '1',
                top_p: '1',
                persona: '',
                context: '',
                instructions:
                    'Answer the question without hallucinations, using deterministic language in a helpful way.'
            },
            snackbar: {
                open: false,
                message: '',
                severity: 'info'
            },
            is_error: false,
            expand: true
        };
    }

    getSummaryText = () => {
        const { app_id, screen_id } = this.props;

        this.setState({
            loading_response: true,
            show_response: true,
            response_text: false
        });

        getScreenAIResponse({
            app_id: app_id,
            screen_id: screen_id,
            callback: this.onGetStoredResponse
        });
    };

    onGetStoredResponse = (response_data) => {
        if (response_data.ai_response && response_data.ai_response.response) {
            this.setState({
                loading_response: false,
                response_text: response_data.ai_response.response,
                verified: true,
                verified_at: response_data.verified_at,
                verified_by: response_data.verified_by_user,
                ratings: response_data.ratings,
                current_user_rating: _.find(response_data.ratings, function (rating_item) {
                    return rating_item.by === sessionStorage.getItem('user_name');
                })
            });
            if (response_data.ai_response.config) {
                this.setState({
                    config: response_data.ai_response.config
                });
            }
        } else {
            // this.onGenerateResponse();
            this.beforeGenerateResponse();
        }
    };

    onResponseText = async (response_data) => {
        const isShowWarningMsg = response_data.message ? true : false;
        const warningMsg = isShowWarningMsg
            ? response_data.message
            : 'Selected Model is inactive, using Azure OpenAI model to generate insight';
        this.setState({
            loading_response: false,
            response_text: response_data.choices[0].message.content,
            verified: false,
            verified_at: false,
            verified_by: false,
            ratings: false,
            current_user_rating: false,
            snackbar: {
                open: isShowWarningMsg,
                message: warningMsg,
                severity: 'warning'
            }
        });
        await this.logInsight();
    };

    onResponseError = async (response_data) => {
        this.setState({
            loading_response: false,
            snackbar: {
                open: true,
                message: response_data?.response?.data?.error || 'Please try again after sometime.',
                severity: 'error'
            },
            response_text: response_data?.response?.data?.message,
            is_error: true
        });

        await this.logInsight();
    };

    onCloseResponse = () => {
        this.setState({
            show_response: false,
            is_error: false
        });
    };

    beforeGenerateResponse = () => {
        this.setState({
            show_prompt_config: true
        });
    };

    onGenerateResponse = () => {
        const { data_items, app_id, screen_id } = this.props;
        this.setState({
            show_prompt_config: false
        });

        getchatgptText({
            app_id: app_id,
            screen_id: screen_id,
            items: data_items,
            config: {
                model_name: this.state.config.model_name,
                prompt: this.state.config.prompt,
                instructions: this.state.config.instructions,
                context: this.state.config.context,
                persona: this.state.config.persona,
                max_tokens: parseInt(this.state.config.max_tokens),
                temperature: parseFloat(this.state.config.temperature),
                presence_penalty: parseInt(this.state.config.presence_penalty),
                frequency_penalty: parseInt(this.state.config.frequency_penalty),
                top_p: parseInt(this.state.config.top_p),
                best_of: parseInt(this.state.config.best_of)
            },
            callback: this.onResponseText,
            failureCallback: this.onResponseError
        });
    };

    onVerifyResponse = () => {
        const { app_id, screen_id } = this.props;

        saveScreenAIResponse({
            app_id: app_id,
            screen_id: screen_id,
            payload: {
                response_text: this.state.response_text,
                config: this.state.config,
                username: sessionStorage.getItem('user_name')
            },
            callback: this.onResponseVerify
        });
    };

    onResponseVerify = () => {
        this.getSummaryText();
    };

    onRateResponse = () => {};

    renderStarsFromRating = (rating) => {
        const { classes } = this.props;

        rating = Math.round(rating * 2) / 2;
        let output = [];

        // Append all the filled whole stars
        for (var i = rating; i >= 1; i--)
            output.push(<Star fontSize="large" className={classes.chatGPTRatingIcon} />);

        // If there is a half a star, append it
        if (i == 0.5)
            output.push(<StarHalf fontSize="large" className={classes.chatGPTRatingIcon} />);

        // Fill the empty stars
        for (let i = 5 - rating; i >= 1; i--)
            output.push(
                <StarBorder fontSize="large" className={classes.chatGPTRatingIconBorder} />
            );

        output.push(<br clear="all" />);

        return output;
    };

    renderRatingStars = () => {
        var avg_rating =
            _.reduce(
                this.state.ratings,
                function (memo, item) {
                    return memo + item.rating;
                },
                0
            ) / (this.state.ratings.length === 0 ? 5 : this.state.ratings.length);

        return this.renderStarsFromRating(avg_rating || 0);
    };

    onShowRatings = () => {
        this.setState({
            show_response_ratings: true
        });
    };

    onCloseRatings = () => {
        this.setState({
            show_response_ratings: false
        });
    };

    onClickRating = (rating) => {
        this.setState({
            current_user_rating: {
                rating: rating,
                by: sessionStorage.getItem('user_name')
            }
        });
    };

    onSaveRatings = () => {
        const { app_id, screen_id } = this.props;

        this.setState({
            loadingRate: true,
            show_response_ratings: false
        });

        rateScreenAIResponse({
            app_id: app_id,
            screen_id: screen_id,
            payload: {
                rating: this.state.current_user_rating.rating,
                username: sessionStorage.getItem('user_name')
            },
            callback: this.onResponseSaveRatings
        });
    };

    onResponseSaveRatings = () => {
        this.setState({
            loadingRate: false,
            show_response_ratings: false
        });

        this.loadRatings();
    };

    loadRatings = () => {
        const { app_id, screen_id } = this.props;

        this.setState({
            loadingRate: true
        });

        getScreenAIResponseRatings({
            app_id: app_id,
            screen_id: screen_id,
            callback: this.onResponseLoadRatings
        });
    };

    onResponseLoadRatings = (response_data) => {
        this.setState({
            loadingRate: false,
            ratings: response_data.ratings
        });
    };

    onRegenerateResponse = () => {
        this.setState({
            loading_response: true,
            response_text: false,
            verified: false,
            verified_at: false,
            verified_by: false,
            ratings: false,
            current_user_rating: false,
            show_prompt_config: true
        });

        // this.onGenerateResponse();
    };

    onHandleFieldChange = (field_value, field_params) => {
        var config = this.state.config;

        if (!config) {
            config = {};
        }

        config[field_params['field_id']] = field_value;

        this.setState({
            config: config
        });
    };

    logInsight = async () => {
        const { app_id, screen_id } = this.props;
        if (
            import.meta.env['REACT_APP_ENABLE_APP_INSIGHTS'] &&
            import.meta.env['REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING']
        ) {
            const { appInsights } = await import('util/appInsightsLogger');
            appInsights.trackEvent({
                name: 'ChatGPT AI Insight',
                properties: {
                    app_id: app_id,
                    screen_id: screen_id,
                    user_email: sessionStorage.getItem('user_email'),
                    event: 'Open AI Insights'
                }
            });
        }
    };

    handleCopy = () => {
        if (!this.state.response_text) {
            this.setState({
                snackbar: {
                    open: true,
                    message: 'No response text to copy.',
                    severity: 'error'
                }
            });
            return;
        }
        navigator.clipboard
            .writeText(this.state.response_text.replace(/[#*]/g, ''))
            .then(() => {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Text copied to clipboard!',
                        severity: 'success'
                    }
                });
            })
            .catch(() => {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Failed to copy response text. Please try again.',
                        severity: 'error'
                    }
                });
            });
    };

    excludeAiIconPath = (pathname) => {
        const excludedPaths = ['admin', 'alerts', 'stories', 'dashboard', 'user-mgmt'];

        return excludedPaths.some((path) => pathname.includes(path));
    };

    render() {
        const { classes } = this.props;
        const pathname = window.location.pathname;
        var saved_user_rating = _.find(this.state.ratings, function (rating_item) {
            return rating_item.by === sessionStorage.getItem('user_name');
        });

        const toggleBody = (val) => {
            this.setState({
                expand: val
            });
        };

        return [
            !this.excludeAiIconPath(pathname) && (
                <div
                    className={classes.aiInsightsContainer}
                    onClick={this.getSummaryText}
                    key={'key'}
                >
                    <AiInsightsIcon className={classes.chatGPTIcon} data-testid="ChatGPT-icon" />
                </div>
            ),
            this.state.show_response &&
                (this.state.loading_response || this.state.response_text) && (
                    <div className={classes.responseOverlay}>
                        <ClickAwayListener onClickAway={this.onCloseResponse}>
                            <Draggable handle="#draggable-chatgpt-title">
                                <div
                                    data-testid="chatgpt-summary-container"
                                    className={
                                        this.state.is_error
                                            ? clsx(
                                                  classes.chatGPTResponseContainer,
                                                  classes.chatGPTErrorContainer
                                              )
                                            : classes.chatGPTResponseContainer
                                    }
                                >
                                    {this.state.show_prompt_config
                                        ? [
                                              <Typography
                                                  variant="h3"
                                                  id="draggable-chatgpt-title"
                                                  className={classes.chatGPTConfigureTitle}
                                                  key="configure-prompt-title"
                                              >
                                                  AI Insights
                                                  <div
                                                      className={classes.chatGptResponseIconHolder}
                                                  >
                                                      {!this.state.expand ? (
                                                          <MinimizeIcon
                                                              className={
                                                                  classes.chatGPTResponseExpand
                                                              }
                                                              onClick={() => toggleBody(false)}
                                                          />
                                                      ) : (
                                                          <ExpandIcon
                                                              className={
                                                                  classes.chatGPTResponseExpand
                                                              }
                                                              onClick={() => toggleBody(true)}
                                                          />
                                                      )}
                                                      <CloseIcon
                                                          fontSize="large"
                                                          className={classes.chatGPTResponseClose}
                                                          onClick={this.onCloseResponse}
                                                          data-testid="close-insight"
                                                      ></CloseIcon>
                                                  </div>
                                              </Typography>,

                                              <div
                                                  className={classes.formContainer}
                                                  key={'Prompt_aiscreen'}
                                              >
                                                  <p className={classes.formTitle}>Configure AI</p>
                                                  {/* <div className={classes.inputContainer}>
                                                    <p>Select Model</p>
                                                    <RadioGroup
                                                        row
                                                        name={'modelGroups'}
                                                        value={this.state.config.model_name}
                                                        onChange={(event) =>
                                                            this.onHandleFieldChange(
                                                                event.target.value,
                                                                {
                                                                    field_id: 'model_name'
                                                                }
                                                            )
                                                        }
                                                    >
                                                        {configAiModelsType.map((item) => {
                                                            return (
                                                                <FormControlLabel
                                                                    value={item.value}
                                                                    key={item.value}
                                                                    control={
                                                                        <Radio
                                                                            className={classes.radio}
                                                                        />
                                                                    }
                                                                    classes={{
                                                                        label: classes.radioText
                                                                    }}
                                                                    label={item.label}
                                                                />
                                                            );
                                                        })}
                                                    </RadioGroup>
                                                </div> */}
                                                  <div className={classes.inputContainer}>
                                                      <p>Write a prompt</p>
                                                      <TextField
                                                          className={classes.textField}
                                                          multiline
                                                          label=""
                                                          variant="outlined"
                                                          placeholder="Ex: Extract summary, key insights and recommended insights"
                                                          key={'prompt_for_genai'}
                                                          id={'prompt_for_genai'}
                                                          value={this.state.config.prompt}
                                                          onChange={(event) =>
                                                              this.onHandleFieldChange(
                                                                  event.target.value,
                                                                  {
                                                                      field_id: 'prompt'
                                                                  }
                                                              )
                                                          }
                                                      />
                                                  </div>
                                                  <div className={classes.inputContainer}>
                                                      <p>Add Persona</p>
                                                      <TextField
                                                          className={classes.textField}
                                                          multiline
                                                          label=""
                                                          variant="outlined"
                                                          key={'persona_for_genai'}
                                                          id={'persona_for_genai'}
                                                          value={this.state.config.persona}
                                                          onChange={(event) =>
                                                              this.onHandleFieldChange(
                                                                  event.target.value,
                                                                  {
                                                                      field_id: 'persona'
                                                                  }
                                                              )
                                                          }
                                                          placeholder="Add Persona"
                                                      />
                                                  </div>
                                                  <div className={classes.inputContainer}>
                                                      <p>Add Context</p>
                                                      <TextField
                                                          className={classes.textField}
                                                          multiline
                                                          label=""
                                                          variant="outlined"
                                                          placeholder="Ex: related to sales"
                                                          key={'context_for_genai'}
                                                          id={'context_for_genai'}
                                                          value={this.state.config.context}
                                                          onChange={(event) =>
                                                              this.onHandleFieldChange(
                                                                  event.target.value,
                                                                  {
                                                                      field_id: 'context'
                                                                  }
                                                              )
                                                          }
                                                      />
                                                  </div>
                                                  <div className={classes.inputContainer}>
                                                      <p>Add Instructions</p>
                                                      <TextField
                                                          className={classes.textField}
                                                          multiline
                                                          label=""
                                                          variant="outlined"
                                                          placeholder="Ex: the question without hallucinations, using deterministic language "
                                                          key={'instructions_for_genai'}
                                                          id={'instructions_for_genai'}
                                                          value={this.state.config.instructions}
                                                          onChange={(event) =>
                                                              this.onHandleFieldChange(
                                                                  event.target.value,
                                                                  {
                                                                      field_id: 'instructions'
                                                                  }
                                                              )
                                                          }
                                                      />
                                                  </div>
                                                  <Button
                                                      variant="contained"
                                                      size="small"
                                                      className={classes.generateInsightsButton}
                                                      onClick={this.onGenerateResponse}
                                                  >
                                                      Generate Insights
                                                  </Button>
                                              </div>
                                          ]
                                        : [
                                              <Typography
                                                  variant="h3"
                                                  id="draggable-chatgpt-title"
                                                  className={classes.chatGPTConfigureTitle}
                                                  key="configure-prompt-title"
                                              >
                                                  AI Insights
                                                  <div
                                                      className={classes.chatGptResponseIconHolder}
                                                  >
                                                      {!this.state.loading_response && (
                                                          <RefreshIcon
                                                              fontSize="large"
                                                              className={
                                                                  classes.chatGPTResponseClose
                                                              }
                                                              onClick={this.onRegenerateResponse}
                                                              data-testid="refresh-insight"
                                                              key="insight-refresh"
                                                          ></RefreshIcon>
                                                      )}
                                                      {this.state.expand ? (
                                                          <MinimizeIcon
                                                              className={
                                                                  classes.chatGPTResponseExpand
                                                              }
                                                              onClick={() => toggleBody(false)}
                                                          />
                                                      ) : (
                                                          <ExpandIcon
                                                              className={
                                                                  classes.chatGPTResponseExpand
                                                              }
                                                              onClick={() => toggleBody(true)}
                                                          />
                                                      )}
                                                      <CloseIcon
                                                          fontSize="large"
                                                          className={classes.chatGPTResponseClose}
                                                          onClick={this.onCloseResponse}
                                                          data-testid="close-insight"
                                                      ></CloseIcon>
                                                  </div>
                                              </Typography>,
                                              <Typography
                                                  variant="h3"
                                                  id="draggable-chatgpt-title"
                                                  className={classes.chatGPTResponseTitle}
                                                  key="insight-response-title"
                                              >
                                                  AI generated summary & insights
                                                  {!this.state.loading_response &&
                                                      (this.state.verified ? (
                                                          <Tooltip
                                                              title={
                                                                  'Verified by ' +
                                                                  this.state.verified_by +
                                                                  ' on ' +
                                                                  this.state.verified_at
                                                              }
                                                              classes={{
                                                                  tooltip: classes.iconTooltip,
                                                                  arrow: classes.arrow
                                                              }}
                                                              placement="bottom-end"
                                                              arrow
                                                          >
                                                              <span
                                                                  onClick={this.onVerifyResponse}
                                                                  data-testid="verify-insight"
                                                                  className={
                                                                      classes.verifyContainer
                                                                  }
                                                              >
                                                                  {' '}
                                                                  <VerifyIcon
                                                                      className={
                                                                          classes.chatGPTResponseVerifiedIcon
                                                                      }
                                                                  />
                                                                  Verified
                                                              </span>
                                                          </Tooltip>
                                                      ) : (
                                                          <span
                                                              onClick={this.onVerifyResponse}
                                                              data-testid="verify-insight"
                                                              className={classes.verifyContainer}
                                                          >
                                                              {' '}
                                                              <VerifiedUserOutlined
                                                                  className={
                                                                      classes.chatGPTResponseVerifyIcon
                                                                  }
                                                              />
                                                              Verify Response
                                                          </span>
                                                      ))}
                                              </Typography>,
                                              this.state.response_text && (
                                                  <div
                                                      className={
                                                          classes.chatGPTResponseRatingContainerRedesign
                                                      }
                                                  >
                                                      {
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingBody
                                                              }
                                                          >
                                                              {
                                                                  <div
                                                                      className={
                                                                          classes.ratingContainer
                                                                      }
                                                                  >
                                                                      <Typography
                                                                          className={
                                                                              classes.ratingHeading
                                                                          }
                                                                          onClick={
                                                                              this.onShowRatings
                                                                          }
                                                                      >
                                                                          Rate Response
                                                                      </Typography>
                                                                      <div
                                                                          onClick={
                                                                              this.onShowRatings
                                                                          }
                                                                      >
                                                                          {' '}
                                                                          {this.renderRatingStars()}{' '}
                                                                      </div>
                                                                      <div
                                                                          className={
                                                                              classes.ratingDivider
                                                                          }
                                                                      ></div>
                                                                      <ShareIcon
                                                                          className={
                                                                              classes.shareIcon
                                                                          }
                                                                      />
                                                                      <CopyIcon
                                                                          className={
                                                                              classes.copyIcon
                                                                          }
                                                                          onClick={this.handleCopy}
                                                                      />
                                                                  </div>
                                                              }
                                                          </div>
                                                      }
                                                      <br clear="all" />
                                                  </div>
                                              ),
                                              <div
                                                  className={
                                                      this.state.loading_response
                                                          ? classes.loadingContainer
                                                          : this.state.expand
                                                          ? classes.chatGPTResponseBody
                                                          : classes.chatGPTResponseBodyMinimize
                                                  }
                                                  id="gptResponseBody"
                                                  key="insight-fetch"
                                              >
                                                  {this.state.loading_response && (
                                                      <div>
                                                          <div className={classes.emptyStateHolder}>
                                                              <Typography
                                                                  className={`${classes.emptyState1} ${classes.loading}`}
                                                              ></Typography>
                                                              <Typography
                                                                  className={`${classes.emptyState2} ${classes.loading}`}
                                                              ></Typography>
                                                              <Typography
                                                                  className={`${classes.emptyState3} ${classes.loading}`}
                                                              ></Typography>
                                                          </div>
                                                          <div
                                                              className={classes.emptyStateHolder2}
                                                          >
                                                              <Typography
                                                                  className={`${classes.emptyState1} ${classes.loading}`}
                                                              ></Typography>
                                                              <Typography
                                                                  className={`${classes.emptyState2} ${classes.loading}`}
                                                              ></Typography>
                                                              <Typography
                                                                  className={`${classes.emptyState3} ${classes.loading}`}
                                                              ></Typography>
                                                          </div>
                                                          Summarizing data for insights...
                                                      </div>
                                                  )}

                                                  {this.state.response_text &&
                                                      nl2br(
                                                          this.state.response_text
                                                              .replace(/[#*]/g, '')
                                                              .trim()
                                                      )}
                                              </div>,
                                              this.state.show_response_ratings && (
                                                  <div
                                                      className={
                                                          classes.chatGPTResponseRatingDetails
                                                      }
                                                  >
                                                      <Typography
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsHeader
                                                          }
                                                      >
                                                          {'Rating Details'}
                                                      </Typography>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 5 ? (
                                                                  <RadioButtonChecked
                                                                      fontSize="large"
                                                                      data-testid="rating-5-checked"
                                                                  />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(5)
                                                                      }
                                                                      data-testid="rating-5-unchecked"
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(5)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  5
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 4 ? (
                                                                  <RadioButtonChecked fontSize="large" />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(4)
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(4)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  4
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 3 ? (
                                                                  <RadioButtonChecked fontSize="large" />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(3)
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(3)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  3
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 2 ? (
                                                                  <RadioButtonChecked fontSize="large" />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(2)
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(2)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  2
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 1 ? (
                                                                  <RadioButtonChecked fontSize="large" />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(1)
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(1)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  1
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsItem
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsCheckbox
                                                              }
                                                          >
                                                              {this.state.current_user_rating &&
                                                              this.state.current_user_rating
                                                                  .rating === 0 ? (
                                                                  <RadioButtonChecked fontSize="large" />
                                                              ) : (
                                                                  <RadioButtonUnchecked
                                                                      fontSize="large"
                                                                      onClick={() =>
                                                                          this.onClickRating(0)
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                          <div
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsItemLabel
                                                              }
                                                          >
                                                              {this.renderStarsFromRating(0)}
                                                          </div>
                                                          {saved_user_rating && (
                                                              <div
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsItemCount
                                                                  }
                                                              >
                                                                  {
                                                                      _.filter(
                                                                          this.state.ratings,
                                                                          function (rating_item) {
                                                                              return (
                                                                                  rating_item.rating ===
                                                                                  0
                                                                              );
                                                                          }
                                                                      ).length
                                                                  }
                                                              </div>
                                                          )}
                                                          <br clear="all" />
                                                      </div>
                                                      <div
                                                          className={
                                                              classes.chatGPTResponseRatingDetailsUserRating
                                                          }
                                                      >
                                                          <Button
                                                              variant="outlined"
                                                              className={
                                                                  classes.chatGPTResponseRatingDetailsUserRatingButton
                                                              }
                                                              onClick={this.onCloseRatings}
                                                              aria-label="Close"
                                                          >
                                                              Close
                                                          </Button>
                                                          {this.state.current_user_rating && (
                                                              <Button
                                                                  variant="contained"
                                                                  className={
                                                                      classes.chatGPTResponseRatingDetailsUserRatingButton
                                                                  }
                                                                  onClick={this.onSaveRatings}
                                                                  aria-label="Submit"
                                                              >
                                                                  Submit
                                                              </Button>
                                                          )}
                                                      </div>
                                                  </div>
                                              )
                                          ]}
                                </div>
                            </Draggable>
                        </ClickAwayListener>
                    </div>
                ),
            <CustomSnackbar
                key="chatgpt-insight"
                message={this.state.snackbar.message}
                open={this.state.snackbar.open}
                autoHideDuration={5000}
                onClose={() => {
                    this.setState({
                        snackbar: {
                            open: false,
                            message: '',
                            severity: 'info'
                        }
                    });
                }}
                severity={this.state.snackbar.severity}
            />
        ];
    }
}

ChatGPTSummary.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...chatGPTSummaryStyle(theme),
        ...customFormStyle(theme),
        ...appScreenWidgetEditorStyle(theme)
    }),
    { withTheme: true }
)(ChatGPTSummary);
