import axiosInstance from './axios.instance';

export const GET = async (url, queryParams) => {
    return (await axiosInstance.get(url, { params: queryParams })).data;
}

export const POST = async (url, body) => {
    return (await axiosInstance.post(url, body)).data;
}

export const PUT = async (url, body) => {
    return (await axiosInstance.put(url, body)).data;
}

export const DELETE = async (url, body) => {
    return (await axiosInstance.delete(url, body)).data;
}
