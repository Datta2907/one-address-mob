import { GET } from "../utils/http";

const communityUrl = 'community/';

export const getCommunitiesInCity = () => {
    return GET(communityUrl + 'list-in-cities', null);
}