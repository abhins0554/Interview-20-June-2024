import { makeAuthorizedRequest } from './client'

export const getChats = (token) => {
    return makeAuthorizedRequest('GET', '/chat/get-chat', null, token);
}