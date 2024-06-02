import axios from 'axios'
import environment from "./environment_variables";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { checkTokenValid } from '../redux/auth-store';

const axiosInstance = axios.create({
    baseURL: environment.api
});
const useAxiosInterceptor = () => {
    const dispatch = useDispatch();
    axiosInstance.interceptors.request.use(async (config) => {
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    }, (err) => {
        return Promise.reject(err)
    })

    axiosInstance.interceptors.response.use(
        response => response,
        async function wrong(error) {
            const { status } = error.response;
            if (status === 401) {
                await AsyncStorage.removeItem("authToken");
                dispatch(checkTokenValid({ token: undefined }));
                return null;
            }
            return Promise.reject(error);
        }
    )
}
export default axiosInstance;
export { useAxiosInterceptor };