import MsalAuth from "./MSALAuth";
export const getMainToken = async () => {
    try {
        const msalAuth = new MsalAuth();
        await msalAuth.init();
        const token=  await msalAuth.login();
        return token
    } catch (err) {
        console.error("error token fetch", err);
        return null;
    }
};