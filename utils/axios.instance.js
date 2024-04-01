import axios from 'axios'
import environment from "./environment_variables";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: environment.api
});

axiosInstance.interceptors.request.use(async (config) => {
    const authToken = await AsyncStorage.getItem('authToken');
    console.log("authToken", authToken);
    const decodedToken = authToken ? jwtDecode(authToken) : null;
    console.log("decodedToken", decodedToken);
    const tokenExpired = decodedToken ? Date.now() >= decodedToken.exp * 1000 ? true : false : true;
    console.log("tokenexpired", tokenExpired);
    if (tokenExpired) {
        await AsyncStorage.removeItem('authToken');
        delete axiosInstance.defaults.headers.common.Authorization;
    } else {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err)
})

export default axiosInstance;