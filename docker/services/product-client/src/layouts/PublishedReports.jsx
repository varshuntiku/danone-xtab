import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';

import previewReportsStyle from 'assets/jss/previewReportsStyle.jsx';
import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';
import { ReactComponent as CodxBoxLogo } from 'assets/img/codx-box-new-logo.svg';
import { ReactComponent as KeyInsights } from 'assets/img/key-insights.svg';
import { ReactComponent as ChartUp } from 'assets/img/chart-up.svg';
import { ReactComponent as ChartDown } from 'assets/img/chart-down.svg';
import { ReactComponent as ConclusionImg } from 'assets/img/conclusion-img.svg';
import mathco_darkbg_logo from 'assets/img/mathco-logo-darkbg.png';
import mathco_lightbg_logo from 'assets/img/mathco-logo-lightbg.png';
import cover_page_light from 'assets/img/cover_page.png';
import cover_page_dark from 'assets/img/cover-page-dark.svg';
import LinearProgressBar from 'components/LinearProgressBar.jsx';
import { getStory } from 'services/reports.js';
class PublishedReports extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            report_data: false
        };
    }

    componentDidMount() {
        let storyId = this.props.match.params.story_id;
        if (this.props.report_data) {
            storyId = this.props.report_data.story_id;
        }
        getStory({
            story_id: storyId,
            callback: this.onResponseGetStory
        });
    }

    onResponseGetStory = (response_data) => {
        this.setState({
            report_data: response_data
        });
    };

    download = () => {
        // let clonedElement = document.getElementById('toPdf').cloneNode(true);
        // clonedElement.children[2].children[0].removeChild(clonedElement.getElementsByTagName('header')[0]);
        // var opt = {
        //     margin: 10,
        //     filename: 'Reports',
        //     image: { type: 'jpeg', quality: 1 },
        //     html2canvas: { dpi: 192, letterRendering: true },
        //     jsPDF: { orientation: 'landscape', format: 'a3' },
        //     pageBreak: { mode: 'css', after: '.page', before: '.page' } // { mode: ['avoid-all', 'css'], avoid: ['.pi-row'] },
        // };
        // html2pdf().from(clonedElement.innerHTML).set(opt).toPdf().save();
    };
    render() {
        const { classes } = this.props;
        var localstorage_theme = localStorage.getItem('codx-products-theme');
        var logo = mathco_darkbg_logo;

        if (localstorage_theme && localstorage_theme === 'light') {
            logo = mathco_lightbg_logo;
        }
        return (
            <div>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}></Typography>
                        <Button color="inherit" onClick={this.download} aria-label="Download">
                            Download
                        </Button>
                        {/* <IconButton color="inherit" onClick={this.handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton> */}
                    </Toolbar>
                </AppBar>

                {!this.state.report_data ? <LinearProgressBar /> : null}

                {this.state.report_data ? (
                    <div className={classes.contentWrapper} id="toPdf">
                        <div
                            className={[
                                classes.coverPage,
                                localstorage_theme === 'dark' ? classes.backgroundImage : null
                            ].join(' ')}
                        >
                            <div className={classes.root}>
                                <Grid container spacing={6}>
                                    <Grid item xs={6} style={{ position: 'relative' }}>
                                        <div className={classes.coverPageContent}>
                                            <CodxBoxLogo
                                                alt="codex-logo"
                                                className={classes.codxLogo}
                                            />
                                            <h1 className={classes.snapShot}>
                                                Quarterly Report Snapshot Q2 | 2021
                                            </h1>
                                            <p className={classes.description}>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum is simply dummy
                                                text of the printing and typesetting industry.
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {localstorage_theme !== 'dark' ? (
                                            <img
                                                className={classes.coverImage}
                                                src={cover_page_light}
                                                alt="cover page"
                                            />
                                        ) : (
                                            <img
                                                className={classes.coverImage}
                                                src={cover_page_dark}
                                                alt="cover page"
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </div>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.root}>
                                <div className={classes.overview}>
                                    <Grid container spacing={8}>
                                        <Grid item xs={6}>
                                            <h1 className={classes.heading}>Overview</h1>
                                            <p className={classes.description}>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the
                                                industry&apos;s standard dummy text ever since the
                                                1500s, when an unknown printer took a galley of type
                                                and scrambled it to make a type specimen book. It
                                                has survived not only five centuries, but also the
                                                leap into electronic typesetting, remaining
                                                essentially unchanged. It was popularised in the
                                                1960s with the release of Letraset sheets containing
                                                Lorem Ipsum passages, and more recently with desktop
                                                publishing software like Aldus PageMaker including
                                                versions of Lorem Ipsum.
                                            </p>
                                            <p className={classes.description}>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry.
                                            </p>
                                            <h1 className={classes.heading}>Scope</h1>
                                            <p className={classes.description}>
                                                This report focused on the cost benefit study about
                                                the limited edition accessories and the
                                                corresponding marketing costs that will be
                                                implemented in the last quarter of 2021
                                            </p>

                                            <h1 className={classes.heading}>Methodology</h1>
                                            <p className={classes.description}>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry.
                                            </p>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <h1 className={classes.heading}>Analysis</h1>
                                            <h1 className={classes.subHeading}>Costs</h1>

                                            <table className={classes.table}>
                                                <tr>
                                                    <th>Company</th>
                                                    <th>Contact</th>
                                                    <th>Country</th>
                                                    <th> - </th>
                                                </tr>
                                                <tr>
                                                    <td>Alfreds Futterkiste</td>
                                                    <td>Maria Anders</td>
                                                    <td>Germany</td>
                                                    <td>Germany</td>
                                                </tr>
                                                <tr>
                                                    <td>Centro comercial Moctezuma</td>
                                                    <td>Francisco Chang</td>
                                                    <td>Mexico</td>
                                                    <td>Mexico</td>
                                                </tr>
                                                <tr>
                                                    <td>Ernst Handel</td>
                                                    <td>Roland Mendel</td>
                                                    <td>Austria</td>
                                                    <td>Austria</td>
                                                </tr>
                                                <tr>
                                                    <td>Island Trading</td>
                                                    <td>Helen Bennett</td>
                                                    <td>UK</td>
                                                    <td>UK</td>
                                                </tr>
                                            </table>
                                            <h1 className={classes.subHeading}>Benefits</h1>

                                            <table className={classes.table}>
                                                <tr>
                                                    <th>Company</th>
                                                    <th>Contact</th>
                                                    <th>Country</th>
                                                </tr>
                                                <tr>
                                                    <td>Alfreds Futterkiste</td>
                                                    <td>Maria Anders</td>
                                                    <td>Germany</td>
                                                </tr>
                                                <tr>
                                                    <td>Centro comercial Moctezuma</td>
                                                    <td>Francisco Chang</td>
                                                    <td>Mexico</td>
                                                </tr>
                                            </table>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>01</span>
                                <h1 className={classes.text}>MEDIA SPEND MIX</h1>
                            </div>

                            <Grid container spacing={6}>
                                <Grid item xs={7}>
                                    <AppWidgetPlot
                                        params={JSON.parse(this.state.report_data.content[2].value)}
                                        graph_height={'half'}
                                        size_nooverride={false}
                                        color_nooverride={false}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <p className={classes.description}>
                                        <span className={classes.percentage}>
                                            26% <span className={classes.entity}> Tv</span>{' '}
                                            <span className={classes.repute}>Lead On</span>
                                        </span>
                                        {this.state.report_data.content[2].description.header}
                                    </p>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.keyFindings}>
                                <Grid item xs={7} className={classes.alignCenter}>
                                    <div>
                                        <KeyInsights></KeyInsights>
                                    </div>
                                    <div>
                                        <h1 className={classes.subHeading}>Key Findings</h1>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[2].description.header}{' '}
                                        </p>
                                    </div>
                                </Grid>
                                <Grid item xs={2} className={classes.alignCenter}>
                                    <div className={classes.chartWrapper}>
                                        <ChartUp className={classes.chart}></ChartUp>
                                    </div>
                                </Grid>
                                <Grid item xs={2} className={classes.alignCenter}>
                                    <div className={classes.chartWrapper}>
                                        <ChartDown className={classes.chart}></ChartDown>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={8}>
                                    <div className={classes.heading}>
                                        <span className={classes.number}>02</span>
                                        <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                                    </div>
                                    <Grid container spacing={6}>
                                        <Grid item xs={6}>
                                            <p className={classes.description}>
                                                <span className={classes.percentage}>
                                                    26% <span className={classes.entity}> Tv</span>{' '}
                                                    <span className={classes.repute}>Lead On</span>
                                                </span>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the
                                                industry&apos;s standard dummy text ever since the
                                                1500s, when an unknown printer took a galley of type
                                                and scrambled it to make a type specimen book. It
                                                has survived not only five centuries, but also the
                                                leap into electronic typesetting, remaining
                                                essentially unchanged. It was popularised in the
                                                1960s with the release of Letraset sheets containing
                                                Lorem Ipsum passages, and more recently with desktop
                                                publishing software like Aldus PageMaker including
                                                versions of Lorem Ipsum.
                                            </p>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={classes.plot}>
                                                <AppWidgetPlot
                                                    params={JSON.parse(
                                                        this.state.report_data.content[1].value
                                                    )}
                                                    graph_height={'half'}
                                                    size_nooverride={false}
                                                    color_nooverride={false}
                                                />
                                            </div>

                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.chartWrapperColumn}>
                                            <ChartUp className={classes.chart}></ChartUp>
                                        </div>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}{' '}
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={8}>
                                    <div className={classes.heading}>
                                        <span className={classes.number}>03</span>
                                        <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                                    </div>
                                    <Grid container spacing={6}>
                                        <Grid item xs={6}>
                                            <p className={classes.description}>
                                                <span className={classes.percentage}>
                                                    26% <span className={classes.entity}> Tv</span>{' '}
                                                    <span className={classes.repute}>Lead On</span>
                                                </span>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                            <div className={classes.plot}>
                                                <AppWidgetPlot
                                                    params={JSON.parse(
                                                        this.state.report_data.content[2].value
                                                    )}
                                                    graph_height={'half'}
                                                    size_nooverride={false}
                                                    color_nooverride={false}
                                                />
                                            </div>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.chartWrapperColumn}>
                                            <ChartUp className={classes.chart}></ChartUp>
                                        </div>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}{' '}
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>04</span>
                                <h1 className={classes.text}>MEDIA SPEND MIX</h1>
                            </div>

                            <Grid container spacing={6}>
                                <Grid item xs={7}>
                                    <div className={classes.plot} style={{ height: '400px' }}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[0].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={5} style={{ position: 'relative' }}>
                                    <div className={classes.alignVertical}>
                                        <p className={classes.description}>
                                            <span className={classes.percentage}>
                                                26% <span className={classes.entity}> Tv</span>{' '}
                                                <span className={classes.repute}>Lead On</span>
                                            </span>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum has been the
                                            industry&apos;s standard dummy text ever since the
                                            1500s, when an unknown printer took a galley of type and
                                            scrambled it to make a type
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>04</span>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>

                            <Grid container spacing={6}>
                                <Grid item xs={7}>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[2].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={5}>
                                    <div>
                                        <p className={classes.description}>
                                            <span className={classes.percentage}>01 </span>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum is simply dummy text
                                            of the printing and typesetting industry.
                                        </p>
                                    </div>

                                    <div>
                                        <p className={classes.description}>
                                            <span className={classes.percentage}>02</span>
                                            Lorem Ipsum is simply dummy text of the printing and
                                            typesetting industry. Lorem Ipsum is simply dummy text
                                            of the printing and typesetting industry.
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.keyFindings}>
                                <Grid item xs={7} className={classes.alignCenter}>
                                    <div>
                                        <KeyInsights></KeyInsights>
                                    </div>
                                    <div>
                                        <h1 className={classes.subHeading}>Key Findings</h1>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[2].description.header}{' '}
                                        </p>
                                    </div>
                                </Grid>
                                <Grid item xs={2} className={classes.alignCenter}>
                                    <div className={classes.chartWrapper}>
                                        <ChartUp className={classes.chart}></ChartUp>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={3} style={{ position: 'RELATIVE' }}>
                                    <div
                                        className={[classes.heading, classes.alignVertical].join(
                                            ' '
                                        )}
                                    >
                                        <span className={classes.number}>04</span>
                                        <h1 className={classes.text}>MEDIA SPEND MIX</h1>
                                    </div>
                                </Grid>
                                <Grid item xs={9}>
                                    <Grid container spacing={6}>
                                        <Grid item xs={5}>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[2].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <div className={classes.plot}>
                                                <AppWidgetPlot
                                                    params={JSON.parse(
                                                        this.state.report_data.content[2].value
                                                    )}
                                                    graph_height={'half'}
                                                    size_nooverride={false}
                                                    color_nooverride={false}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.alignCenter}>
                                            <div
                                                className={classes.chartWrapperColumn}
                                                style={{ marginRight: '20px' }}
                                            >
                                                <ChartUp className={classes.chart}></ChartUp>
                                            </div>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>05</span>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>
                            <div className={classes.concisedContent}>
                                <Grid container spacing={6}>
                                    <Grid item xs={7}>
                                        <div className={classes.plot}>
                                            <AppWidgetPlot
                                                params={JSON.parse(
                                                    this.state.report_data.content[2].value
                                                )}
                                                graph_height={'half'}
                                                size_nooverride={false}
                                                color_nooverride={false}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[2].description.header}
                                        </p>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={7} style={{ margin: 'auto' }}>
                                    <div className={classes.heading}>
                                        <span className={classes.number}>05</span>
                                        <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                                    </div>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[1].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>
                                    <p className={classes.description}>
                                        <span className={classes.percentage}>
                                            26% <span className={classes.entity}> Tv</span>{' '}
                                            <span className={classes.repute}>Lead On</span>
                                        </span>
                                        Lorem Ipsum is simply dummy text of the printing and
                                        typesetting industry. Lorem Ipsum has been the
                                        industry&apos;s standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of type and scrambled
                                        it to make a type specimen book. It has survived not only
                                        five centuries, but also the leap into electronic
                                        typesetting, remaining essentially unchanged. It was
                                        popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with
                                        desktop publishing software like Aldus PageMaker including
                                        versions of Lorem Ipsum.
                                    </p>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={8}>
                                    <div className={classes.heading}>
                                        <span className={classes.number}>06</span>
                                        <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                                    </div>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[1].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>
                                    <p
                                        className={classes.description}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <span className={classes.percentage}>
                                            26% <span className={classes.entity}> Tv</span>{' '}
                                            <span className={classes.repute}>Lead On</span>
                                        </span>
                                        Lorem Ipsum is simply dummy text of the printing and
                                        typesetting industry. Lorem Ipsum has been the
                                        industry&apos;s standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of type and scrambled
                                        it to make a type specimen book. It has survived not only
                                        five centuries, but also the leap into electronic
                                        typesetting, remaining essentially unchanged. It was
                                        popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with
                                        desktop publishing software like Aldus PageMaker including
                                        versions of Lorem Ipsum.
                                    </p>
                                </Grid>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={3}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.chartWrapperColumn}>
                                            <ChartUp
                                                className={classes.chart}
                                                style={{ margin: 'auto' }}
                                            ></ChartUp>
                                        </div>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>07</span>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>

                            <Grid container spacing={6}>
                                <Grid item xs={3}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={3}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                            </Grid>

                            <Grid container spacing={6}>
                                <Grid item xs={6}>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[0].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.alignCenter}>
                                            <div className={classes.chartWrapperColumn}>
                                                <ChartUp className={classes.chart}></ChartUp>
                                            </div>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <span className={classes.number}>08</span>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>
                            <Grid container spacing={6}>
                                <Grid item xs={6}>
                                    <AppWidgetPlot
                                        params={JSON.parse(this.state.report_data.content[1].value)}
                                        graph_height={'half'}
                                        size_nooverride={false}
                                        color_nooverride={false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                            </Grid>
                            <Grid container spacing={6}>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <div className={classes.chartWrapperColumn}>
                                            <ChartUp className={classes.chart}></ChartUp>
                                        </div>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>
                            <Grid container spacing={6}>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        <span className={classes.percentage}>
                                            26% <span className={classes.entity}> Tv</span>{' '}
                                            <span className={classes.repute}>Lead On</span>
                                        </span>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[1].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>

                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                    </div>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>
                            <Grid container spacing={6}>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        <span className={classes.percentage}>
                                            26% <span className={classes.entity}> Tv</span>{' '}
                                            <span className={classes.repute}>Lead On</span>
                                        </span>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={8}>
                                    <Grid container spacing={6}>
                                        <Grid item xs={6}>
                                            <div className={classes.plot}>
                                                <AppWidgetPlot
                                                    params={JSON.parse(
                                                        this.state.report_data.content[1].value
                                                    )}
                                                    graph_height={'half'}
                                                    size_nooverride={false}
                                                    color_nooverride={false}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={classes.keyFindings}>
                                                <div className={classes.alignCenter}>
                                                    <KeyInsights></KeyInsights>
                                                    <h1 className={classes.subHeading}>
                                                        Key Findings
                                                    </h1>
                                                </div>
                                                <hr />
                                                <p className={classes.description}>
                                                    {
                                                        this.state.report_data.content[1]
                                                            .description.header
                                                    }
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={6}>
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <div className={classes.heading}>
                                <h1 className={classes.text}>MEDIA PERFORMANCE</h1>
                            </div>
                            <Grid container spacing={6}>
                                <Grid item xs={7}>
                                    <Grid container spacing={6}>
                                        <Grid item xs={6}>
                                            <p className={classes.description}>
                                                <span className={classes.percentage}>
                                                    26% <span className={classes.entity}> Tv</span>{' '}
                                                    <span className={classes.repute}>Lead On</span>
                                                </span>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <p className={classes.description}>
                                                {
                                                    this.state.report_data.content[1].description
                                                        .header
                                                }
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={5}>
                                    <div className={classes.plot}>
                                        <AppWidgetPlot
                                            params={JSON.parse(
                                                this.state.report_data.content[1].value
                                            )}
                                            graph_height={'half'}
                                            size_nooverride={false}
                                            color_nooverride={false}
                                        />
                                    </div>

                                    <div className={classes.keyFindings}>
                                        <div className={classes.alignCenter}>
                                            <KeyInsights></KeyInsights>
                                            <h1 className={classes.subHeading}>Key Findings</h1>
                                        </div>
                                        <hr />
                                        <p className={classes.description}>
                                            {this.state.report_data.content[1].description.header}
                                        </p>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>

                        <div className={classes.page}>
                            <Grid container spacing={6}>
                                <Grid item xs={4}>
                                    <span className={classes.number}>09</span>
                                    <h1 className={classes.text}>Conclusion</h1>
                                    <ConclusionImg style={{ width: '100%' }}></ConclusionImg>
                                </Grid>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p className={classes.description}>
                                        {this.state.report_data.content[1].description.header}
                                    </p>
                                </Grid>
                            </Grid>
                            <div className={classes.footer}>
                                <CodxLogo alt="codex-logo" className={classes.footerLeft} />
                                <p className={classes.pageNumber}>1</p>
                                <img className={classes.footerRight} src={logo} alt="logo" />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default withStyles(
    (theme) => ({
        ...previewReportsStyle(theme)
    }),
    { withTheme: true }
)(PublishedReports);
