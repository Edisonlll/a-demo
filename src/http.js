import axios from 'axios'
import {
    Message
} from 'element-ui';
const HttpServer = {};
HttpServer.install = function (Vue) {
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    axios.interceptors.request.use(function (config) {
        if (config.url !== "login") {
            const AUTH_TOKEN = localStorage.getItem("token");
            config.headers["Authorization"] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function (response) {
        const { meta: { msg, status } } = response.data
        if (status !== 200 && status !== 201) {
            Message.error(msg)
        }
        return response
    }, function (error) {
        return Promise.reject(error)
    })
    Vue.prototype.$http = axios
}
export default HttpServer;