const createPPT =require('./createPPT');
//const input =require('../pages.json');

module.exports = async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function processed a request.');

        const body = req.body;
        const data =await createPPT.main(context,body);
        context.res = {
            status: 200, /* Defaults to 200 */
            body: {data:data,messege:"This CreatePPT triggered function executed successfully"}
        };
    } catch (err) {
        context.log(err);
        context.res = {
            status: 500, /* Defaults to 200 */
            body: err
        };
    }

}