import { GET, POST } from "../utils/http";

const userUrl = 'user/';

export const getRepresentatives = () => {
    return GET(userUrl + 'representatives', null);
}

export const registerUser = async (firstName, lastName, role, email, password) => {
    return POST(userUrl + 'register', { firstName, lastName, role, email, password });
}