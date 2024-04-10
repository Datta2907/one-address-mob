import { GET, POST } from "../utils/http";

const userUrl = 'user/';

export const getUserRoles = () => {
    return GET(userUrl + 'roles', null);
}