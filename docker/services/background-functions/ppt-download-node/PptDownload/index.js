const createPPT = require('./createPPT');
const createPDF = require('./createPDF');
//const input =require('../pages.json');

module.exports = async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');
        console.log("this is data body", req.body)
        const body = req.body;
        const filename = body?.file_type == 'PDF' ? await createPDF.main(context, body) : await createPPT.main(context, body);
        //console.log("filename",filename);
        context.res = {
            status: 200, /* Defaults to 200 */
            body: { filename: filename, messege: "This CreatePDF triggered function executed successfully" }
        };
    } catch (err) {
        context.log(err);
        context.res = {
            status: 500, /* Defaults to 200 */
            body: err
        };
    }

}