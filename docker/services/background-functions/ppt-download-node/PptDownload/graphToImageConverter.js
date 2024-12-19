
const puppeteer = require('puppeteer');
const {DARK_THEME_FONT_COLOR,DARK_THEME_BACKGROUND_COLOR,DARK_THEME_CUSTOM_BACKGROUND_COLOR} =require('./constant');
const {setupPlot} = require("./setupPlot");

const puppeteerPromise = async (plotlyData, layout,context)=> {
    try {
      const browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox']});
      //context.log("image",browser);
      const page = await browser.newPage()
      await page.setContent(`<html><body><span id="chart">&nbsp;</span></body></html>`)
      await page.addScriptTag({ path: context.executionContext.functionDirectory +'/js/jquery-3.6.0.min.js' })
      await page.addScriptTag({ path: context.executionContext.functionDirectory +'/js/plotly-latest.min.js' })

      await page.exposeFunction("plotlyData", plotlyData)
      await page.exposeFunction("layout", layout)

      let image = await page.evaluate(function (plotlyData, layout) {

        // @ts-ignore
        const Plotly = window.Plotly
        Plotly.newPlot('chart', plotlyData, layout)
        return Plotly.toImage('chart', { format: 'png', width: layout.width ? layout.width : 800, height: layout.height ? layout.height : 600 })
      }, plotlyData, layout)

      await browser.close()
      return image;
    } catch (e) {
      console.log(" ~ file: index.js ~ line 13 ~ returnnewPromise ~ e", e)
      return e;
    }
}
const layoutAlignment=(layout)=>{
    layout['template']['layout']['plot_bgcolor'] =DARK_THEME_BACKGROUND_COLOR;
    layout['template']['layout']['paper_bgcolor'] =DARK_THEME_BACKGROUND_COLOR;
    layout['template']['layout']['font']['color'] =DARK_THEME_FONT_COLOR;
    return layout
}
const createGraph=async (graphObj, content_id, layoutSection, context, CUSTOM_APP_TEMPLATE, TE_APP)=> {
    // let layout =layoutAlignment(graphObj['layout']);
    graphObj = setupPlot({params: graphObj, graph_height: 'half'});
    let layout = graphObj['layout'];
    layout['paper_bgcolor'] = !(CUSTOM_APP_TEMPLATE || TE_APP) ? DARK_THEME_BACKGROUND_COLOR : DARK_THEME_CUSTOM_BACKGROUND_COLOR
    layout['plot_bgcolor'] = !(CUSTOM_APP_TEMPLATE || TE_APP) ? DARK_THEME_BACKGROUND_COLOR : DARK_THEME_CUSTOM_BACKGROUND_COLOR
    layout['font']['color']=DARK_THEME_FONT_COLOR
    layout['legend']['font']['color']=DARK_THEME_FONT_COLOR
    layout['xaxis']['tickfont']['color']=DARK_THEME_FONT_COLOR
    layout['yaxis']['tickfont']['color']=DARK_THEME_FONT_COLOR
    layout['yaxis2']['tickfont']['color']=DARK_THEME_FONT_COLOR
    layout['xaxis']['showgrid']= false
    layout['yaxis']['showgrid']= false
    layout?.xaxis?.title?.font?.color?layout.xaxis.title.font.color=DARK_THEME_FONT_COLOR:null
    layout?.yaxis?.title?.font?.color?layout.yaxis.title.font.color=DARK_THEME_FONT_COLOR:null
    let data =graphObj['data']
    layoutSection.width =layoutSection.width - 0.8
    layoutSection.left =layoutSection.left + 0.3
    const aspRatio = layoutSection.width / layoutSection.height;
    layout.width = layout.width || (600 * aspRatio);
    layout.height = layout.height || (600);
    let imageBuffer = await puppeteerPromise(data, layout,context);
    return imageBuffer;
}

exports.createGraph = createGraph;