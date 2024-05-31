import { GET, POST } from "../utils/http";

const userUrl = 'user/';

export const getRepresentatives = () => {
    return GET(userUrl + 'representatives', null);
}

export const getApplicationStatus = async () => {
    return GET(userUrl + 'application-status', null)
}

export const registerUser = async (data) => {
    return POST(userUrl + 'register', data);
}