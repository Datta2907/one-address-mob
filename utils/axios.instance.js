import axios from 'axios'
import environment from "./environment_variables";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired } from './checkTokenExpiry';

const axiosInstance = axios.create({
    baseURL: environment.api
});

axiosInstance.interceptors.request.use(async (config) => {
    const authToken = await AsyncStorage.getItem('authToken');
    const tokenExpired = authToken ? isTokenExpired(authToken) : true;
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