export default class BaseAuth {
    async init() {}

    login = () => {};

    logout = () => {};

    getToken = async () => {};

    getAccount = () => {};

    user = null;

    setUser = (user) => {
        this.user = user;
    };
}
