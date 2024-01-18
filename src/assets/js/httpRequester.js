import axios from 'axios';
import { getChromeStorage } from '@/assets/js/public';

const HttpRequester = axios.create();

HttpRequester.interceptors.request.use(async function (config) {
    // 在请求发送之前调用 getChromeStorage 获取配置
    try {
        const result = await getChromeStorage("ProgramConfiguration");
        const CorsProxy = result.CorsProxyState ? result.CorsProxy || "" : "";
        console.log("拦截器CORS状态:", CorsProxy);
        if (CorsProxy) {
            config.url = `${CorsProxy}/${config.url}`;
        }
    } catch (error) {
        return Promise.reject(error);
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export default HttpRequester;
