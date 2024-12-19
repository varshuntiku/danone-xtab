const {
    IMAGE_PATHS
} = require('./enum.js');

const html2pptxgenjs = require("./htmlparser/main");

const htmlParser = (content) => {
    return html2pptxgenjs.htmlToPptxText(content);
}

const createMasterSlides = (pptx) => {
    // Codx Title slide
    pptx.defineSlideMaster({
        title: "Title Slide",
        background: IMAGE_PATHS.titleBkgd,
        objects: [

            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "10%",
                        y: "37%",
                        w: "65%",
                        h: "20%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 32,
                        align: "left",
                        bold: true
                    },
                    text: "CLICK TO EDIT MASTER TITLE STYLE"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "title",
                        type: "title",
                        x: "10%",
                        y: "59%",
                        w: "80%",
                        h: "10%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 28,
                        align: "left",
                    },
                    text: "Click to add subtitle"
                },
            }
        ],
    });

    // Codx Agenda slide
    pptx.defineSlideMaster({
        title: "Agenda Slide",
        background: IMAGE_PATHS.agendaBkgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '70%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "7%",
                        y: "44%",
                        w: "34%",
                        h: "16%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 60,
                        align: "left",
                        bold: true,
                        valign: "bottom",
                    },
                    text: "AGENDA"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body",
                        type: "body",
                        x: "48%",
                        y: "10%",
                        w: "47%",
                        h: "80%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 26,
                        align: "left",
                        bullet: true,
                    },
                    text: "Agenda 1"
                },
            }
        ],
    });

    // Codx Header_White_1
    pptx.defineSlideMaster({
        title: "Header_White_1",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "4%",
                        y: "2%",
                        w: "92%",
                        h: "12%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 28,
                        align: "left",
                        bold: true,
                        valign: "bottom",
                    },
                    text: "CLICK TO EDIT MASTER TITLE STYLE"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body",
                        x: "4%",
                        y: "20%",
                        w: "92%",
                        h: "72%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 18,
                        align: "left",
                    },
                    text: "Click to add text"
                },
            }
        ],
    });

    // Codx Two Content_1
    pptx.defineSlideMaster({
        title: "Two Content_1",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "4%",
                        y: "2%",
                        w: "92%",
                        h: "12%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 28,
                        align: "left",
                        bold: true,
                        valign: "bottom",
                    },
                    text: "CLICK TO EDIT MASTER TITLE STYLE"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body1",
                        x: "4%",
                        y: "20%",
                        w: "48%",
                        h: "72%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 18,
                        align: "left",
                    },
                    text: "Click to add text"
                }
            },
            {
                placeholder: {
                    options: {
                        name: "body2",
                        type: "image",
                        x: "56%",
                        y: "20%",
                        w: "40%",
                        h: "72%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 18,
                        align: "left",
                        shape: pptx.shapes.OVAL
                    },
                    text: "Click icon to add picture",
                },
            }
        ],
    });

    // Codx Blank_Dark
    pptx.defineSlideMaster({
        title: "Blank_Dark",
        background: IMAGE_PATHS.plainDarkBkgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [],
    });

    // Codx Transition 1
    pptx.defineSlideMaster({
        title: "Transition 1",
        background: IMAGE_PATHS.transition1Bkgd,
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "18%",
                        y: "37%",
                        w: "70%",
                        h: "20%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 28,
                        align: "left",
                        bold: true,
                        valign: "bottom"
                    },
                    text: "TRANSITION TITLE 1"
                },
            }
        ],
    });

    // Codx Transition 2
    pptx.defineSlideMaster({
        title: "Transition 2",
        background: IMAGE_PATHS.transition2Bkgd,
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "12%",
                        y: "50%",
                        w: "81%",
                        h: "20%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 28,
                        align: "left",
                        bold: true,
                        valign: "bottom"
                    },
                    text: "TRANSITION SLIDE"
                },
            }
        ],
    });

    // Codx Thank you
    pptx.defineSlideMaster({
        title: "Thank You",
        background: {
            path: IMAGE_PATHS.thanksBKgd.path
        },
        objects: [{
            placeholder: {
                options: {
                    name: "thanks",
                    type: "title",
                    x: "30%",
                    y: "45%",
                    w: "35%",
                    h: "20%",
                    fontFace: "Roboto Condensed Light",
                    color: "220047",
                    fontSize: 44,
                    align: "right",
                    bold: true,
                    valign: "center"
                },
                text: 'THANK YOU'
            },
        }],
    });



// ------------------------------------------- pd-framework related
    // TITLE_SLIDE
    pptx.defineSlideMaster({
        title: "Title Slide 2",
        background: IMAGE_PATHS.titleBkgd,
        objects: [

            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "11%",
                        y: "20%",
                        w: "40%",
                        h: "40%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 42,
                        align: "left",
                        bold: true,
                    },
                    text: "Click To Add Project Name"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "accountName",
                        type: "title",
                        x: "11%",
                        y: "58%",
                        w: "70%",
                        h: "7%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 26,
                        align: "left",
                    },
                    text: "Click To Add Account Name"
                },
            },
            {
                placeholder: {
                    options: {
                        name: "downloadedBy",
                        type: "title",
                        x: "11%",
                        y: "65%",
                        w: "50%",
                        h: "5%",
                        fontFace: "Roboto Condensed Light",
                        color: "220047",
                        fontSize: 14,
                        align: "left",
                    },
                    text: "Click To Add Created By"
                },
            }
        ],
    });
    // MASTER_SLIDE (MASTER_PLACEHOLDER) //
    pptx.defineSlideMaster({
        title: "header_body",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "4%",
                        y: "2%",
                        w: "92%",
                        h: "12%",
                        margin: 0,
                        align: "left",
                        valign: "bottom",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        fontSize: 28,
                        bold: true
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body",
                        type: "body",
                        x: "4%",
                        y: "20%",
                        w: "92%",
                        h: "72%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            },
        ],
    });

    // MASTER_SLIDE (MASTER_PLACEHOLDER)
    pptx.defineSlideMaster({
        title: "codx_default",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [],
    });


    // MASTER_SLIDE row split(MASTER_PLACEHOLDER)
    pptx.defineSlideMaster({
        title: "header_body_first_row_split",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "4%",
                        y: "2%",
                        w: "92%",
                        h: "12%",
                        margin: 0,
                        align: "left",
                        valign: "bottom",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        fontSize: 28,
                        bold: true
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_1_1",
                        type: "body",
                        x: "4%",
                        y: "20%",
                        w: "45%",
                        h: "52%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_1_2",
                        type: "body",
                        x: "51%",
                        y: "20%",
                        w: "45%",
                        h: "52%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_2",
                        type: "body",
                        x: "4%",
                        y: "75%",
                        w: "92%",
                        h: "17%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            }
        ],
    });



    // MASTER_SLIDE row split(MASTER_PLACEHOLDER)
    pptx.defineSlideMaster({
        title: "header_body_second_row_split",
        background: IMAGE_PATHS.plainBKgd,
        margin: [0.25, 0.25, 0.25, 0.25],
        slideNumber: {
            x: '48%',
            y: '96%',
            w: "4%",
            h: "4%",
            fontFace: "Roboto Condensed Light",
            fontSize: 9,
            align: "center",
            bold: true,
            color:'220047'
        },
        objects: [
            {
                placeholder: {
                    options: {
                        name: "header",
                        type: "title",
                        x: "4%",
                        y: "2%",
                        w: "92%",
                        h: "12%",
                        margin: 0,
                        align: "left",
                        valign: "bottom",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        fontSize: 28,
                        bold: true
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_1",
                        type: "body",
                        x: "4%",
                        y: "20%",
                        w: "92%",
                        h: "34%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_2_1",
                        type: "body",
                        x: "4%",
                        y: "58%",
                        w: "45%",
                        h: "34%",
                        color: "220047",
                        fontFace: "Roboto Condensed Light",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            },
            {
                placeholder: {
                    options: {
                        name: "body_row_2_2",
                        type: "body",
                        x: "51%",
                        y: "58%",
                        w: "45%",
                        h: "34%",
                        color: "220047",
                        line:{ width: 0.1, color:'220047' }
                    },
                    text: "",
                },
            }
        ],
    });

    // MARGIN_SLIDE (used for demo/test)
    // const MARGINS = [0.5, 0.5, 0.5, 0.5];
    // const TEXT_PROPS = {
    //     shape: pptx.shapes.RECTANGLE,
    //     fill: {
    //         color: "FFFCCC"
    //     },
    //     color: "9f9f9f",
    //     align: "center",
    //     fontFace: "Courier New",
    //     fontSize: 10,
    // };
    // pptx.defineSlideMaster({
    //     title: "MARGIN_SLIDE",
    //     background: {
    //         color: "FFFFFF"
    //     },
    //     margin: MARGINS,
    //     objects: [{
    //         text: {
    //             text: "(margin-top)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 0,
    //                     y: 0,
    //                     w: "100%",
    //                     h: MARGINS[0]
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         text: {
    //             text: "(margin-btm)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 0,
    //                     y: 7.5 - MARGINS[2],
    //                     w: "100%",
    //                     h: MARGINS[2],
    //                     flipV: true
    //                 }
    //             }
    //         }
    //     },
    //     ],
    // });

    // MARGIN_SLIDE_STARTY15 (used for demo/test)
    // pptx.defineSlideMaster({
    //     title: "MARGIN_SLIDE_STARTY15",
    //     background: {
    //         color: "FFFFFF"
    //     },
    //     margin: MARGINS,
    //     objects: [{
    //         text: {
    //             text: "(4.0 inches H)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 0,
    //                     y: 0,
    //                     w: 1,
    //                     h: 4.0
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         text: {
    //             text: "(1.5 inches H)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 1,
    //                     y: 0,
    //                     w: 1,
    //                     h: 1.5
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         text: {
    //             text: "(margin-top)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 0,
    //                     y: 0,
    //                     w: "100%",
    //                     h: MARGINS[0]
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         text: {
    //             text: "(margin-btm)",
    //             options: {
    //                 ...TEXT_PROPS,
    //                 ...{
    //                     x: 0,
    //                     y: 7.5 - MARGINS[2],
    //                     w: "100%",
    //                     h: MARGINS[2],
    //                     flipV: true
    //                 }
    //             }
    //         }
    //     },
    //     ],
    // });

    // PLACEHOLDER_SLIDE
    /* FUTURE: ISSUE#599
        pptx.defineSlideMaster({
          title : 'PLACEHOLDER_SLIDE',
          margin: [0.5, 0.25, 1.00, 0.25],
          bkgd  : 'FFFFFF',
          objects: [
              { 'placeholder':
                  {
                    options: {type:'body'},
                    image: {x:11.45, y:5.95, w:1.67, h:0.75, data:STARLABS_LOGO_SM}
                }
            },
              { 'placeholder':
                  {
                      options: { name:'body', type:'body', x:0.6, y:1.5, w:12, h:5.25 },
                      text: '(supports custom placeholder text!)'
                  }
              }
          ],
          slideNumber: { x:1.0, y:7.0, color:'FFFFFF' }
      });*/

    // MISC: Only used for Issues, ad-hoc slides etc (for screencaps)
    // pptx.defineSlideMaster({
    //     title: "DEMO_SLIDE",
    //     objects: [{
    //         rect: {
    //             x: 0.0,
    //             y: 7.1,
    //             w: "100%",
    //             h: 0.4,
    //             fill: {
    //                 color: "F1F1F1"
    //             }
    //         }
    //     },
    //     {
    //         text: {
    //             text: "PptxGenJS - JavaScript PowerPoint Library - (github.com/gitbrent/PptxGenJS)",
    //             options: {
    //                 x: 0.0,
    //                 y: 7.1,
    //                 w: "100%",
    //                 h: 0.4,
    //                 color: "6c6c6c",
    //                 fontSize: 10,
    //                 align: "center"
    //             },
    //         },
    //     },
    //     ],
    // });
}


const titleSlideConfiguration = (pptx, params) => {
    let slide = pptx.addSlide({
        masterName: "Title Slide 2"
    });
    slide.addText(params.header, {
        placeholder: 'header'
    });
    slide.addText(params.accountName, {
        placeholder: 'accountName'
    });
    slide.addText(params.downloadedBy, {
        placeholder: 'downloadedBy'
    });
}

const thankYouSlideConfiguration = (pptx, params) => {
    let slide = pptx.addSlide({
        masterName: "Thank You"
    });
    slide.addText(params.thanks, {
        placeholder: 'thanks',
        valign: "bottom"
    });
}

const headerBodySlideConfiguration = (pptx, params) => {
    let slide = pptx.addSlide({
        masterName: "header_body"
    });
    slide.addText(params.header, {
        placeholder: 'header'
    });
    slide.addText(htmlParser(params.body), {
        placeholder: 'body'
    });
}

const bodyFirstRowSplitSlideConfiguration = (pptx, params) => {
    let slide = pptx.addSlide({
        masterName: "header_body_first_row_split"
    });
    slide.addText(params.header, {
        placeholder: 'header'
    });

    const section1Text = (params.section1Header || '') + params.section1
    slide.addText(htmlParser(section1Text), {
        placeholder: 'body_row_1_1'
    });
    const section2Text = (params.section2Header || '') + params.section2
    slide.addText(htmlParser(section2Text), {
        placeholder: 'body_row_1_2'
    });
    const section3Text = (params.section3Header || '') + "<p> </p>\n<p> </p>\n" + params.section3
    slide.addText(htmlParser(section3Text), {
        placeholder: 'body_row_2'
    });

    if(params.attachments) {
        params.attachments.forEach((el, i) => {
            // slide.addImage({ path: "assets/attachment.png", hyperlink: {url: el.path, tooltip: el.filename},  w: 0.2, h: 0.2, x: 9.6 - i * 0.2, y: 3.15});
            slide.addText("📎",
            {
                hyperlink: {url: el.path, tooltip: el.filename},
                fontSize: 16, w: "2%", h: "4%", x: `${93 - i * 2.5}%`, y: "78.5%",
                align: "center",
                bold: true,
                fill:'A9A9A9',
                line: {width: 0.1, color: '220047'}
            });
        })

    }
}

const bodySecondRowSplitSlideConfiguration = (pptx, params) => {
    let slide = pptx.addSlide({
        masterName: "header_body_second_row_split"
    });
    slide.addText(params.header, {
        placeholder: 'header'
    });

    const section1Text = (params.section1Header || '') + params.section1
    slide.addText(htmlParser(section1Text), {
        placeholder: 'body_row_1'
    });

    const section2Text = (params.section2Header || '') + params.section2
    slide.addText(htmlParser(section2Text), {
        placeholder: 'body_row_2_1'
    });

    const section3Text = (params.section3Header || '') + params.section3
    slide.addText(htmlParser(section3Text), {
        placeholder: 'body_row_2_2'
    });
}

const tableConfiguration= (pptx, params, layoutOpitons) => {
        const slide = pptx.addSlide({
            masterName: "codx_default"
        })
        slide.addText(params.header, {
            x: "4%",
            y: "2%",
            w: "92%",
            h: "12%",
            margin: 0,
            align: "left",
            valign: "bottom",
            color: "220047",
            fontFace: "Roboto Condensed Light",
            fontSize: 28,
            bold: true
        })
        const header = params.tableHeader.map(el => {
            let text = '';
            let options = {}
            if (typeof(el) === "object") {
                text = el.text
                options = el.options || options;
            } else {
                text = el
            }
            return {
                text: htmlParser(text), options: options
            }
        })

        const rows = params.tableRows.map(row => {
            return row.map(el => {
                let text = '';
                let options = {}
                if (typeof(el) === "object") {
                    text = el.text
                    options = el.options || options;
                } else {
                    text = el
                }
                return {
                    text: htmlParser(text), options: options
                }
            })
        })
        slide.addTable([
            header,
            ...rows
        ],{
            x: "4%",
            y: "20%",
            w: "92%",
            h: "72%",
            color: "220047",
            ...layoutOpitons
        })
}

module.exports = {
    createMasterSlides,
    titleSlideConfiguration,
    thankYouSlideConfiguration,
    headerBodySlideConfiguration,
    bodyFirstRowSplitSlideConfiguration,
    bodySecondRowSplitSlideConfiguration,
    tableConfiguration
};