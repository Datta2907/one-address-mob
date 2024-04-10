import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";

export const isTokenExpired = (authToken) => {
    const decodedToken = jwtDecode(authToken)
    const tokenExpired = Date.now() >= decodedToken.exp * 1000 ? true : false;
    return tokenExpired;
}