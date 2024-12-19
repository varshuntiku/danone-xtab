require('dotenv').config()
const pptxgen= require("pptxgenjs");
const html2pptxgenjs =require("./htmlparser/main");
const graphToImage = require('./graphToImageConverter');
const upload = require('./blobUpload');
const {  DARK_THEME_FONT_COLOR,
    LIGHT_THEME_FONT_COLOR,
        DARK_THEME_BACKGROUND_COLOR,
        SUCCESS_COLOR,
        DANGER_COLOR,
        WARNING_COLOR,
        PRIMARY_COLOR,
        COVER_PAGE_OUTLINE,
        LIGHT_THEME_BACKGROUND_COLOR
    } = require('./constant');
const {capitalizeFirstLetter} = require('./util')
let CUSTOM_APP_TEMPLATE = false

const imageComponent=(slide,content,section)=>{
    return slide.addImage({data: content, x:section['left'], y:section['top'], w:section['width'],h:section['height']});
}
const htmlParser=(content)=>{
    return html2pptxgenjs.htmlToPptxText(content);
}

const textComponent=(slide,content,section, rootStyle)=>{
    const items = htmlParser(content)
    if(items.length >0){
        const valign = {center: "middle", top: "top", bottom: "bottom", middle: "middle"}[rootStyle.vPos]
        const options ={ x:section['left'], y:section['top'], w:section['width'],h:section['height'],valign: valign || "top",autoFit:true,fontFace:'Arial'};
        return slide.addText(items,options);
    } else {
        return
    }
}

const insightBorderColor=(content)=>{
    if(content['severity']){
        if(content['severity'] === 'success')
            return SUCCESS_COLOR
        if(content['severity'] === 'warning')
            return WARNING_COLOR
        if(content['severity'] == 'danger')
            return WARNING_COLOR
    }else{
        return PRIMARY_COLOR
    }
}

const insightComponent=(pptx,slide,content,section,index, len,app_id)=>{
    let borderColor=insightBorderColor(content)
    let label =(content['header']?content['header']+" - ":'')+content['label'];
    const elHeight = 0.8;
    const gap = 0.2
    const topOffset = ( section.height - (len * elHeight + (len - 1) * gap) ) / 2;
    const top = ((topOffset >= 0 ? topOffset : 0) + +section['top'])
    slide.addText([
                    {text:label,options:{align:'left',  valign:'top',fontSize:16,color:app_id  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR,bold:true,breakLine:false,autoFit:true}},
                    {text:content['value'],options:{align:'right',  valign:'top',fontSize:14,color:app_id  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR,bold:true,breakLine:true,autoFit:true}},
                    {text:content['extra_value']?content['extra_value']:' ',options:{align:'right',  valign:'bottom',fontSize:12,color:borderColor,bold:true,autoFit:true}}
                  ],
                    {   shape: pptx.ShapeType.rect,
                        line: { color: borderColor, width: 2 },
                        x: +section['left'] + 0.2,
                        y: top + +index * (elHeight + gap),
                        w: +section['width'] - 0.9,
                        h: elHeight,
                        valign: "top"
                    }
                );
}

const kpiValidation=(extra_dir)=>{
    if(extra_dir === 'up')
        return {'color':SUCCESS_COLOR,'img':'upArrow'}
    else
        return {'color':DANGER_COLOR,'img':'downArrow'}
}

const kpiComponent=(pptx,slide,content,section,kpiName,app_id)=>{
    let kpis =kpiValidation(content['extra_dir'])
    const elHeight = 1.2;
    const topOffset = ( section.height - elHeight) / 2;
    const top = ((topOffset >= 0 ? topOffset : 0) + +section['top'])
    slide.addText([
        {text:kpiName,options:{align:'left',  valign:'middle',fontSize:16,color:app_id  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR,bold:true,breakLine:false,autoFit:true}},
        {text:content['value'],options:{align:'right',  valign:'middle',fontSize:14,color:app_id  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR,bold:true,breakLine:true,autoFit:true}},
        {text:content['extra_value']?content['extra_value']:'',options:{align:'right',  valign:'bottom',fontSize:12,color:kpis['color'],bold:true,autoFit:true}},
    ],{
        shape: pptx.ShapeType.rect,
        fill: { color: '#ffffff' },
        line: { color: DARK_THEME_FONT_COLOR, width: 2 },
        x: Number(section['left']) + Number(0.2),
        y: top,
        w: Number(section['width']) - Number(0.5),
        h: elHeight,
    })
    slide.addShape(pptx.ShapeType[kpis['img']],
                {   line: { color: kpis['color'], width: 1 },
                    fill: { color: kpis['color']},
                    x: Number(section['left']) + Number(0.7),
                    y: top + 0.57,
                    w: 0.35,
                    h: 0.5,
                });
}

function addFooter(pptx, slide, index,context,app_id) {
    app_id!== 1838 && CUSTOM_APP_TEMPLATE && slide.addImage({ path: context.executionContext.functionDirectory + `/assets/${CUSTOM_APP_TEMPLATE ? 'danoneLogo.png' : 'nucliosFooterLogo.png'}`, x: CUSTOM_APP_TEMPLATE ? 0.5 : 0.1, y: CUSTOM_APP_TEMPLATE ? 8.4 : 8.6, h: CUSTOM_APP_TEMPLATE ? 0.35 : 0.3 })
    CUSTOM_APP_TEMPLATE ? null: slide.addText([{text: index, options: {align:'center',  valign:'center',fontSize:12,color:app_id  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR}}],
    {
        shape: pptx.ShapeType.rect,
        x: 7,
        y: 8.65,
        w: 2,
        h: 0.35,
    });
    // CUSTOM_APP_TEMPLATE ? app_id !== 1838 && slide.addImage({ path: context.executionContext.functionDirectory + '/assets/mathco-logo-darkbg.png', x: 14.7, y: 8.6, h: 0.3, w: 1.2 }) : null
}

const getHtmlContent=(content)=>{
    if(!content){
        return ""
    }
    if(content['html']){
        return content['html']
    }else{
        return ""
    }
}

const getRootStyle=(content)=>{
    const rootStyle = (content && content.rootStyle)  || {};
    return rootStyle;
}

const isGraphObject=((content)=>{return (content['data'] && content['layout'])?true:false});
const isInsights=((content)=> {return content['insight_data']?true:false});

const createSlides= async (pptx,page,visualContent,context, index, _addFooter,app_id)=>{
    pptx.defineLayout({ name:'A3', width:16, height:9 });
    pptx.layout='A3'
    const slide = pptx.addSlide();
    slide.background = app_id == 1838 ?{ path: context.executionContext.functionDirectory + `/assets/${app_id == 1838 ? 'te_bg.png' : 'MathCopptcover.png'}`}:CUSTOM_APP_TEMPLATE ?{ color:CUSTOM_APP_TEMPLATE ? LIGHT_THEME_BACKGROUND_COLOR : DARK_THEME_BACKGROUND_COLOR}:{path:context.executionContext.functionDirectory + `/assets/MathCopptcover.png`};
    layout_sections =page['layoutProps']['sections'];

    if (_addFooter) {
        addFooter(pptx, slide, +index + 1,context,app_id);
    }
    for(let i in layout_sections){
        const section =layout_sections[i];
        content = page['data'][section['dataKey']];
        if(section['component'] === 'header'){
            const html = getHtmlContent(content);
            const rootStyle = getRootStyle(content);
            textComponent(slide,html,section, rootStyle);
        }
        if(section['component'] === 'text'){
           const html = getHtmlContent(content)
           const rootStyle = getRootStyle(content);
            textComponent(slide,html,section, rootStyle);
        }
        if(section['component'] === 'keyFinding'){
           const html = getHtmlContent(content)
           const rootStyle = getRootStyle(content);
            textComponent(slide,html,section, rootStyle);
        }
        if(section['component'] == 'visualContent'){
            data =visualContent[content];
            content=data&&data['value']?typeof(data['value'])==='string'?JSON.parse(data['value']):data['value']:false;
            if(isGraphObject(content)){
                let filename = await graphToImage.createGraph(content,data['content_id'], section, context, CUSTOM_APP_TEMPLATE, app_id == 1838 );
                await imageComponent(slide,filename,section);
            }
            if(isInsights(content)){
                for(let j in content['insight_data']){
                    const data =content['insight_data'][j];
                    await insightComponent(pptx,slide,data,section,j, content['insight_data'].length ,app_id);
                }
            }
            if(data && data.is_label){
                await kpiComponent(pptx,slide,content,section,data['name'],app_id);
            }
       }
        // CUSTOM_APP_TEMPLATE ? slide.addShape('rect', {
        //     x: 15, // Position the box at the extreme right
        //     y: 0, // Position the box at the top
        //     w: 1, // Set the width to 100px
        //     h: 9, // Set the height to 100% of the slide
        //     fill: { color: '#005EB8' }, // Set the fill color to blue
        //     line: { color: '#FFFFFF', width: 0 } // Set the line color and width to transparent
        // }) : null;

        // Add the slide number at the bottom
        CUSTOM_APP_TEMPLATE ? slide.addText([
            { text: `${+index + 1}`, options: { fontSize: 16, color: '#FFFFFF', align: 'right' } }
        ], { x: 13.65, y: 8.2, w: 2, h: 0.7 }) : null
    }
}

function addCoverPage(pptx, context, input, index, _addFooter) {
    pptx.defineLayout({ name:'A4', width:16, height:9 });
    pptx.layout='A4'
    const slide = pptx.addSlide();
    slide.background = { path: context.executionContext.functionDirectory + `/assets/${input['app_id'] == 1838 ? 'te_bg.png' : 'MathCopptcover.png'}`};
    // if (_addFooter) {
    //     addFooter(pptx, slide, index,context,input,{});
    // }
    slide.addShape('roundRect',
        {x: 2, y: 1, w: 12, h: 6.5, rectRadius: 0.3, line: { color: COVER_PAGE_OUTLINE, width: 1 }
    });

    // input['app_id']  !== 1838 && slide.addImage({path: context.executionContext.functionDirectory +  '/assets/codexlogo2.png',
    //     x: 2.4, y: 2.1});

    slide.addText([
        {text: input.name, options: {charSpacing: 0.8, wrap: true, fontSize: 30, bold: true, color: input['app_id']  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR, breakLine: true}},
        {text: "", options: {breakLine: true}},
        {text: input.description, options: {wrap: true, fontSize: 16, color: input['app_id']  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR, breakLine: true}},
        {text: "", options: {breakLine: true}},
        {text: "- " + capitalizeFirstLetter(input.created_by.first_name) + " " + capitalizeFirstLetter(input.created_by.last_name),
            options: {wrap: true, fontSize: 14, color: input['app_id']  == 1838 ? LIGHT_THEME_FONT_COLOR : DARK_THEME_FONT_COLOR, breakLine: true}}
    ], {x: 2.4, y: 3.3, w: 5.4, h: 4, valign: "top", align: "justify"})


    input['app_id'][0] == 1838 ? slide.addImage({
        path: context.executionContext.functionDirectory + `/assets/${'te_right_image.jpg'}`,
        x: 8.2, y: 1.3, w: 5.6, h: 5.9
    }) : null

}
function addCustomCoverPage(pptx, context, input, index, _addFooter){
    pptx.defineLayout({ name:'A4', width:16, height:9 });
    pptx.layout='A4'
    const slide = pptx.addSlide();
    slide.background = { path: context.executionContext.functionDirectory + `/assets/${input['app_id'] == 1838 ? 'te_bg.png' : 'danoneCover.png'}`};
    // slide.addText([
    //     { text: input.name, options: { fontSize: 28, color: '#000000', align: 'center', valign: 'center' } }
    // ], { x: 5, y: 2, w: 6, h: 1 });
    // ************center text*******************
    slide.addText([
        { text: input.name, options: { fontSize: 66, color: '#005EB8', align: 'center', valign: 'center', bold: true } }
    ], { x: 5, y: 4.3, w: 6, h: 1 });

    // slide.addText([
    //     { text: "[your company name here]", options: { fontSize: 36, color: '#000000', align: 'center', valign: 'center', bold: true } }
    // ], { x: 5, y: 5, w: 6, h: 1 });
}

function addLastCoverPage(pptx, context, input, index, _addFooter){
    pptx.defineLayout({ name: 'A4', width: 16, height: 9 });
    pptx.layout = 'A4'
    const slide = pptx.addSlide();
    slide.addText([
        { text: "THANK YOU", options: { fontSize: 66, color: '#005EB8', align: 'center', valign: 'center', bold: true, fontFace:'DengXian' } }
    ], { x: 5, y: 4.1, w: 6, h: 1 });
    slide.background = { path: context.executionContext.functionDirectory + `/assets/danoneCover.png`};
}

const main=async (context,input)=>{
    try {
        const pptx = new pptxgen();
        CUSTOM_APP_TEMPLATE = input['app_id'][0] == 1928 ? true : false
        CUSTOM_APP_TEMPLATE ? addCustomCoverPage(pptx, context, input, 1, true) : addCoverPage(pptx, context, input, 1, true)
        for(const i in input['pages']){
            const page =input['pages'][i];
            await createSlides(pptx,page,input['content'], context, +i + 1, true,input['app_id'][0]);
        }
        CUSTOM_APP_TEMPLATE ? addLastCoverPage(pptx, context, input, 1, true) : null
        const file =input['name']+"_"+input['app_id']+"_"+input['story_id']+"_"+new Date().getTime()+'.pptx'

        // await pptx.writeFile({ fileName: 'ppt' });
        // console.log(`created file --------------: ${file}`);

        const streamData = await pptx.stream();
        await upload.uploadStream(file, streamData, streamData.length);
        console.log("------",file);
        return file;
    } catch (err) {
        console.log(err);
        throw err;
    }

}
module.exports ={main}
//main();f