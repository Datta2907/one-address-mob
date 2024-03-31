import axios from 'axios'
import environment from "./environment_variables";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: environment.api
});

axiosInstance.interceptors.request.use(async (config) => {
    const authToken = await AsyncStorage.getItem('authToken');
    const decodedToken = jwtDecode(authToken);
    const tokenExpired = Date.now() >= decodedToken.exp * 1000 ? true : false;
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