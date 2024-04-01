import { GET } from "../utils/http"

export const getApplicationStatus = async () => {
    return GET('manual-auth/application-status', null)
}