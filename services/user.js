import { GET, POST } from "../utils/http";

const userUrl = 'user/';

export const getRepresentatives = () => {
    return GET(userUrl + 'representatives', null);
}