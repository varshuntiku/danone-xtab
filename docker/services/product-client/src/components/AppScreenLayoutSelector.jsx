import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { ImageList, ImageListItem } from '@material-ui/core';

import appScreenLayoutSelectorStyle from 'assets/jss/appScreenLayoutSelectorStyle.jsx';
import AppScreenLayout from './AppScreenLayout';

import * as _ from 'underscore';

class AppScreenLayoutSelector extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        setTimeout(() => {
            const selectedLayout = document.getElementById('selectedLayout');
            if (selectedLayout) {
                window.innerHeight < 600
                    ? selectedLayout.scrollIntoView({ behavior: 'smooth', block: 'end' })
                    : selectedLayout.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
        !this.props?.custom_layout
            ? this.setState({ layout_options: this.getLayoutOptionsArray() })
            : this.setState({
                  layout_options: [
                      {
                          no_labels: 0,
                          no_graphs: 2,
                          graph_type: '1-1',
                          graph_size: '',
                          vertical: true
                      }
                  ]
              });
    }

    getLayoutOptionsArray = () => {
        return this.state?.layout_options;
    };

    onClickLayoutOption = (layout_option) => {
        this.props.onChange(layout_option);
    };
    getCustomOptions = () => {
        return [
            {
                no_labels: Number(this.props?.layout_options.no_labels),
                no_graphs: Number(this.props?.layout_options.no_graphs) || 1,
                graph_type: this.props?.layout_options.graph_type || '1',
                graph_width: this.props?.layout_options.graph_width || '1',
                graph_height: this.props?.layout_options.graph_height || '1',
                horizontal: true
            }
        ];
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.custom_layout != this.props.custom_layout ||
            JSON.stringify(prevProps.layout_options) != JSON.stringify(this.props.layout_options)
        ) {
            this.setState({
                layout_options: JSON.parse(JSON.stringify(this.getCustomOptions()))
            });
        }
    }
    render() {
        const { classes, layout_metrics, layout_visuals, selected_layout } = this.props;
        // !this.props?.custom_layout ? this.state.setState({layout_options: getLayoutOptions()}) :
        // this.state.setState({layout_options:
        //     [{
        //         no_labels: Number(this.props?.layout_options.kpiCount), no_graphs: Number(this.props?.layout_options.graphCount),
        //         graph_type: (this.props?.layout_options.graphType), vertical: true
        //     }]})
        let layout_options = this.props?.layout_options || [];
        return (
            <div className={classes.layoutGridRoot} data-testid="app-screen-layout">
                <ImageList className={classes.layoutGrid}>
                    {_.map(
                        _.filter(
                            this.props?.layout_options || layout_options,
                            function (layout_filtered_option) {
                                if (layout_metrics === false && layout_visuals === false) {
                                    return true;
                                } else {
                                    var matches_metrics = false;
                                    var matches_visuals = false;

                                    if (layout_metrics !== false) {
                                        if (
                                            Number(layout_filtered_option['no_labels']) ===
                                            layout_metrics
                                        ) {
                                            matches_metrics = true;
                                        }
                                    } else {
                                        matches_metrics = true;
                                    }

                                    if (layout_visuals !== false) {
                                        if (
                                            Number(layout_filtered_option['no_graphs']) ===
                                            layout_visuals
                                        ) {
                                            matches_visuals = true;
                                        }
                                    } else {
                                        matches_visuals = true;
                                    }
                                    return matches_metrics && matches_visuals;
                                }
                            }
                        ),
                        function (layout_option, layout_option_index) {
                            let layoutSelected = false;
                            if (
                                selected_layout &&
                                Number(selected_layout['no_labels']) ===
                                    Number(layout_option['no_labels']) &&
                                Number(selected_layout['no_graphs']) ===
                                    Number(layout_option['no_graphs']) &&
                                (selected_layout['graph_type'] || false) ===
                                    (layout_option['graph_type'] || false) &&
                                ((selected_layout['graph_width'] !== 'false' &&
                                    selected_layout['graph_width']) ||
                                    false) === (layout_option['graph_width'] || false) &&
                                ((selected_layout['graph_height'] !== 'false' &&
                                    selected_layout['graph_height']) ||
                                    false) === (layout_option['graph_height'] || false) &&
                                Boolean(selected_layout['horizontal']) ===
                                    Boolean(layout_option['horizontal'])
                            ) {
                                layoutSelected = true;
                            }
                            return (
                                <ImageListItem
                                    id={layoutSelected ? 'selectedLayout' : ''}
                                    key={'layout_option_' + layout_option_index}
                                    className={classes.layoutGridTile}
                                    data-testid={`layout-option-${layout_option_index}`}
                                >
                                    <AppScreenLayout
                                        onClick={() => this.onClickLayoutOption(layout_option)}
                                        layout_option={layout_option}
                                        layoutSelected={layoutSelected}
                                        disabled={this.props.editDisabled || !this.props.editMode}
                                        custom_layout={this.props?.custom_layout}
                                    />
                                </ImageListItem>
                            );
                        },
                        this
                    )}
                </ImageList>
            </div>
        );
    }
}

AppScreenLayoutSelector.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles((theme) => appScreenLayoutSelectorStyle(theme), { withTheme: true })(
    AppScreenLayoutSelector
);
