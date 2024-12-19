require('dotenv').config()
const pptxgen = require("pptxgenjs");
const {
    createMasterSlides,
    titleSlideConfiguration,
    thankYouSlideConfiguration,
    headerBodySlideConfiguration,
    bodyFirstRowSplitSlideConfiguration,
    bodySecondRowSplitSlideConfiguration,
    tableConfiguration
} = require("./createMasterSlides");


const main = async (context, input) => {
    try {
        const pptx = new pptxgen();
        // pptx.defineLayout({ name:'LAYOUT_WIDE', width:13.3, height:7.5 });
        pptx.layout='LAYOUT_WIDE'
        createMasterSlides(pptx)
        titleSlideConfiguration(pptx, {
            'header': input['name'] || '--',
            'accountName': input['account'] || '--',
            'downloadedBy': input['downloaded_by'] || '--'
        });
        headerBodySlideConfiguration(pptx, {
            'header': "STATE THE PROBLEM AS HEARD",//input['content']['stateProblem1'],
            'body': input.content?.stateProblem1 || ' '
        });
        const subHeader = `<b style=\"color: #220047;font-size: 14px;\">{subHeader}</b>\n`
        bodyFirstRowSplitSlideConfiguration(pptx, {
            'header': 'UNDERSTAND AND DESCRIBE THE CURRENT STATE',
            'section1': input.content?.statusQuo1 || ' ',
            'section1Header': subHeader.replace('{subHeader}', 'Explain the current state'),
            'section2': input.content?.statusQuo2 || ' ',
            'section2Header': subHeader.replace('{subHeader}', 'Challenges'),
            'section3': input.content?.statusQuo3?.content || ' ',
            'section3Header': subHeader.replace('{subHeader}', 'Describe (or) attach the business/technical process that exists today (Flowchart/Process flow)'),
            'attachments': input.content?.statusQuo3?.attachments || [],
        });

        const tableHeaderOptions = {fill: "#220047", color: "#ffffff",breakLine:false}
        const tableHeaderOptionsLeft = {align: "center", ...tableHeaderOptions}
        const tableCellOptions = {breakLine:false}
        const tableCellOptionsLeft = {align: 'center',breakLine:false}

        tableConfiguration(pptx, {
            header: 'INTERNAL WORKING CONSTRAINTS',
            tableHeader: [{text: 'Type', options: tableHeaderOptionsLeft}, {text: 'Describe the constraints under which we are working (if any)', options: tableHeaderOptions}],
            tableRows: [
                [{text: 'TIMELINE', options: tableCellOptionsLeft}, {text: input.content?.constraints?.timeline || ' ', options: tableCellOptions}],
                [{text: 'DATA (SOURCE)', options: tableCellOptionsLeft}, {text: input.content?.constraints?.dataSource || ' ', options: tableCellOptions}],
                [{text: 'FRAMEWORK', options: tableCellOptionsLeft}, {text: input.content?.constraints?.framework || ' ', options: tableCellOptions}],
                [{text: 'INFRASTRUCTURE', options: tableCellOptionsLeft}, {text: input.content?.constraints?.infrastructure || ' ', options: tableCellOptions}],
                [{text: 'BUSINESS PROCESS', options: tableCellOptionsLeft}, {text: input.content?.constraints?.businessProcess || ' ', options: tableCellOptions}],
                [{text: 'ANY OTHER', options: tableCellOptionsLeft}, {text: input.content?.constraints?.anyOther || ' ', options: tableCellOptions}]
            ]
        }, {
            colW: [2.8, 9.5],
            border: [1,1,1,1],
            valign: "middle",
        })
        bodySecondRowSplitSlideConfiguration(pptx,{
            'header': 'DEFINE THE OBJECTIVE & SUCCESS CRITERIA',
            'section1': input['content']['successCriteria1'] || ' ',
            'section1Header': subHeader.replace('{subHeader}', 'What would an end state look like if this problem was solved successfully?'),
            'section2': input['content']['successCriteria2'] || ' ',
            'section2Header': subHeader.replace('{subHeader}', 'Are there any subjective success criteria?'),
            'section3':input['content']['successCriteria3'] || ' ',
            'section3Header': subHeader.replace('{subHeader}', 'Is there a wish-list apart from what is stated above?'),
        });
        thankYouSlideConfiguration(pptx, {
            'thanks': 'THANK YOU'
        });

        const file = input['name']+".pptx" //input['name']+"_"+input['app_id']+"_"+input['story_id']+"_"+new Date().getTime()+'.pptx'
        // pptx.writeFile({
        //     fileName: file
        // });
        //  await pptx.writeFile({ fileName: 'ppt' });
        // console.log(`created file --------------: ${file}`);

        const streamData = await pptx.stream();
        //await upload.uploadStream(file, streamData, streamData.length);
        console.log("------", file);
        return streamData;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {
    main
}