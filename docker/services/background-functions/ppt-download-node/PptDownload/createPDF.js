require('dotenv').config()
const PDFDocument = require('pdfkit')
const html2pptxgenjs = require("./htmlparser/main");
const graphToImage = require('./graphToImageConverter');
const stream = require('./stream');
const upload = require('./blobUpload');
const { DARK_THEME_FONT_COLOR,
    DARK_THEME_BACKGROUND_COLOR,
    SUCCESS_COLOR,
    DANGER_COLOR,
    WARNING_COLOR,
    PRIMARY_COLOR,
    COVER_PAGE_OUTLINE
} = require('./constant');
const { capitalizeFirstLetter } = require('./util')
// const fs = require('fs');
// const path = require('path');


const imageComponent = (doc, content, section) => {
    return doc.image(content, section['left'] * 80, section['top'] * 100, { width: section['width'] * 80, height: section['height'] * 80 })
}
const htmlParser = (content) => {
    return html2pptxgenjs.htmlToPptxText(content);
}

const textComponent = (doc, content, section, rootStyle) => {
    const items = htmlParser(content)
    left = section['left']|| 0
    top = section['top'] < 1 ? 0.6 : section['top']
    width = section['width'] - 2 || 0
    height = section['height'] || 0
    if (items.length > 0) {
        for (i in items) {
            doc.fillColor(items[i].options.color)
            doc.fontSize(items[i].options.fontSize)
            doc.font('Helvetica-Bold')
            doc.text(items[i].text, left * 100, top * 85, {
                width: width * 80,
                height: height * 80
            })
        }
        return
    } else {
        return
    }
}

const insightBorderColor = (content) => {
    if (content['severity']) {
        switch (content['severity']) {
            case 'success':
                return SUCCESS_COLOR;
            case 'warning':
            case 'danger':
                return WARNING_COLOR;
        }
    }
    return PRIMARY_COLOR;
};

const insightComponent = (doc, content, section, index, len) => {
    let borderColor = insightBorderColor(content)
    let label = (content['header'] ? content['header'] + " - " : '') + content['label'];
    const elHeight = 0.6;
    const gap = 0.2
    const topOffset = (section.height - (len * elHeight + (len - 1) * gap)) / 2;
    const top = ((topOffset >= 0 ? topOffset : 0) + +section['top'])
    doc.fillColor(DARK_THEME_FONT_COLOR)
    doc.fontSize(16)
    doc.font('Helvetica-Bold')
    doc.text(label, (+section['left'] + 0.2) * 80 + 15, (top + +index * (elHeight + gap)) * 100)
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    let w = content['value']?doc.widthOfString(content['value']):null
    doc.text(content['value'], (+section['left'] + 0.2) * 80 + (+section['width'] - 0.2) * 80 - (w + 10), (top + +index * (elHeight + gap)) * 100 + 10).fillColor(DARK_THEME_FONT_COLOR)
    doc.fillColor(borderColor)
    doc.font('Helvetica-Bold')
    doc.fontSize(12)
    w = doc.widthOfString(content['extra_value'] ? content['extra_value'] : ' ')
    doc.text(content['extra_value'] ? content['extra_value'] : ' ', (+section['left'] + 0.2) * 80 + (+section['width'] - 0.2) * 80 - (w + 10), (top + +index * (elHeight + gap)) * 100 + 30).fontSize(12)
    doc.lineWidth(3)
    doc.rect((+section['left'] + 0.2) * 80, (top + +index * (elHeight + gap)) * 100 - 20, (+section['width'] - 0.2) * 80, elHeight * 85).stroke(borderColor)
}

const kpiValidation = (extra_dir) => {
    if (extra_dir === 'up')
        return { 'color': SUCCESS_COLOR, 'img': 'upArrow' }
    else
        return { 'color': DANGER_COLOR, 'img': 'downArrow' }
}


const kpiComponent = (doc, content, section, kpiName) => {
    let kpis = kpiValidation(content['extra_dir'])
    const elHeight = 1.2;
    const topOffset = (section.height - elHeight) / 2;
    const top = ((topOffset >= 0 ? topOffset : 0) + +section['top'])
    doc.fillColor(DARK_THEME_FONT_COLOR)
    doc.fontSize(16)
    doc.font('Helvetica-Bold')
    doc.text(kpiName, section['left'] * 80 + 20, top * 100 + elHeight * 80 / 4)
    let w = doc.widthOfString(content['value'])
    doc.fontSize(14)
    doc.font('Helvetica-Bold')
    doc.text(content['value'], section['left'] * 80 + (Number(section['width']) - Number(0.5)) * 80 - (w - 10), top * 100 + elHeight * 80 / 2 - 5, { width: w }).fillColor(DARK_THEME_FONT_COLOR)
    doc.fillColor(kpis['color'])
    w = doc.widthOfString(content['extra_value'] ? content['extra_value'] : ' ')
    doc.fontSize(12)
    doc.font('Helvetica-Bold')
    doc.text(content['extra_value'] ? content['extra_value'] : ' ', section['left'] * 80 + (Number(section['width']) - Number(0.5)) * 80 - (w - 10), top * 105 + elHeight * 80 / 2, { width: w })
    doc.lineWidth(3)
    doc.rect((Number(section['left']) + Number(0.2)) * 80, top * 100, (Number(section['width']) - Number(0.5)) * 80, elHeight * 80).stroke(DARK_THEME_FONT_COLOR).fill('#ffffff')
    doc.fillColor(kpis['color'])
    if (kpis['img'] == 'upArrow') {
        doc.moveTo(section['left'] * 80 + 80, top * 100 + elHeight * 80 / 4 + 20)
            .lineTo(section['left'] * 80 + 95, top * 100 + elHeight * 80 / 4 + 35)
            .lineTo(section['left'] * 80 + 87, top * 100 + elHeight * 80 / 4 + 35)
            .lineTo(section['left'] * 80 + 87, top * 100 + elHeight * 80 / 4 + 65)
            .lineTo(section['left'] * 80 + 73, top * 100 + elHeight * 80 / 4 + 65)
            .lineTo(section['left'] * 80 + 73, top * 100 + elHeight * 80 / 4 + 35)
            .lineTo(section['left'] * 80 + 65, top * 100 + elHeight * 80 / 4 + 35)
            .lineTo(section['left'] * 80 + 80, top * 100 + elHeight * 80 / 4 + 20)
            .fill(kpis['color'])
            .stroke(kpis['color'])
    }
    else {
        doc.moveTo(section['left'] * 80 + 80, top * 100 + elHeight * 80 / 4 + 65)
            .lineTo(section['left'] * 80 + 95, top * 100 + elHeight * 80 / 4 + 50)
            .lineTo(section['left'] * 80 + 87, top * 100 + elHeight * 80 / 4 + 50)
            .lineTo(section['left'] * 80 + 87, top * 100 + elHeight * 80 / 4 + 20)
            .lineTo(section['left'] * 80 + 73, top * 100 + elHeight * 80 / 4 + 20)
            .lineTo(section['left'] * 80 + 73, top * 100 + elHeight * 80 / 4 + 50)
            .lineTo(section['left'] * 80 + 65, top * 100 + elHeight * 80 / 4 + 50)
            .lineTo(section['left'] * 80 + 80, top * 100 + elHeight * 80 / 4 + 65)
            .fill(kpis['color'])
            .stroke(kpis['color'])
    }
}

async function addFooter(doc, index,context) {
    try {
        doc.image(context.executionContext.functionDirectory +'/assets/nucliosNewFooterLogo.png', 10, doc.page.height - 25, { width: 80, height: 20 });
    } catch (err) {
        throw err
    }

}

const getHtmlContent = (content) => {
    return content && content.html ? content.html : "";
}

const getRootStyle = (content) => {
    const rootStyle = (content && content.rootStyle) || {};
    return rootStyle;
}

const isGraphObject = ((content) => { return (content['data'] && content['layout']) ? true : false });
const isInsights = ((content) => { return content['insight_data'] ? true : false });

const createSlides = async (doc, page, visualContent, context, index, _addFooter) => {
    doc.addPage()
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(DARK_THEME_BACKGROUND_COLOR);
    layout_sections = page['layoutProps']['sections'];

    if (_addFooter) {
        addFooter(doc, +index + 1,context);
    }
    for (let i in layout_sections) {
        const section = layout_sections[i];
        content = page['data'][section['dataKey']];
        switch (section['component']) {
            case 'header':
            case 'text':
            case 'keyFinding':
                const html = getHtmlContent(content);
                const rootStyle = getRootStyle(content);
                textComponent(doc, html, section, rootStyle);
            case 'visualContent':
                data = visualContent[content];
                content = data && data['value'] ? typeof(data['value'])==='string'?JSON.parse(data['value']):data['value'] : false;
                if (isGraphObject(content)) {
                    let filename = await graphToImage.createGraph(content, data['content_id'], section, context);
                    await imageComponent(doc, filename, section);
                }
                if (isInsights(content)) {
                    for (let j in content['insight_data']) {
                        const data = content['insight_data'][j];
                        await insightComponent(doc, data, section, j, content['insight_data'].length);
                    }
                }
                if (data && data.is_label) {
                    await kpiComponent(doc, content, section, data['name']);
                }
        }
    }
}


async function addCoverPage(doc, context, input, index, _addFooter) {
    try {
        doc.image(context.executionContext.functionDirectory + '/assets/MathCopptcover.png', 0, 0, { width: doc.page.width, height: doc.page.height });
        // if (_addFooter) {
        //     addFooter(doc, index,context);
        // }
        doc.fillColor(DARK_THEME_FONT_COLOR)
        doc.fontSize(23)
        doc.font('Helvetica-Bold')
        doc.text(input.name, doc.page.width / 6 + 5, doc.page.height / 2.5)
        doc.fontSize(16)
        doc.font('Helvetica-Bold')
        doc.text(input.description, doc.page.width / 6 + 5, doc.page.height / 2)
        doc.font('Helvetica-Bold')
        doc.fontSize(14)
        doc.text("- " + capitalizeFirstLetter(input.created_by.first_name) + " " + capitalizeFirstLetter(input.created_by.last_name), doc.page.width / 6 + 5, doc.page.height / 1.4)
        doc.strokeColor(COVER_PAGE_OUTLINE)
        doc.roundedRect(doc.page.width / 6 - 20, doc.page.height / 4 - 50, doc.page.width / 1.35, doc.page.height / 1.6 + 50, 7).stroke();



    } catch (err) {
        throw err
    }

}

const main = async (context, input) => {
    try {
        const doc = new PDFDocument({ size: [1280, 720], });
        let streamData = new stream.WritableBufferStream();
        doc.pipe(streamData);
        addCoverPage(doc, context, input, 1, true)
        for (const i in input['pages']) {
            const page = input['pages'][i];
            await createSlides(doc, page, input['content'], context, +i + 1, true);
        }
        const file = input['name'] + "_" + input['app_id'] + "_" + input['story_id'] + "_" + new Date().getTime() + '.pdf'
        // const filePath = path.join(__dirname, 'example1.pdf');
        doc.on('end', async () => {
            // const buffer = streamData.toBuffer();
            // fs.writeFileSync(filePath, buffer);
            // console.log("File saved:", filePath);
            await upload.uploadStream(file, streamData.toBuffer(), streamData.toBuffer().length);
        });
        await doc.end()

        console.log("------", file);
        return file;
    } catch (err) {
        console.log(err);
        throw err;
    }

}
module.exports = { main }
