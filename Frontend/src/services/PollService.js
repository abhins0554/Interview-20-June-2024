import { makeAuthorizedRequest } from './client'

export const getPolls = (token) => {
    return makeAuthorizedRequest('GET', '/poll/get-poll', null, token);
}

export const addPolls = (data, token) => {
    return makeAuthorizedRequest('POST', '/poll/create-poll', data, token);
}

export const votePolls = (data, token) => {
    return makeAuthorizedRequest('POST', '/poll/vote-poll', data, token);
}