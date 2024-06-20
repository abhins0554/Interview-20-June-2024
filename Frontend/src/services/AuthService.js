import { makeUnauthorizedRequest } from './client'

export const LoginAPI = (userdata) => {
    return makeUnauthorizedRequest('POST', '/auth/login', userdata);
}

export const SignupAPI = (userdata) => {
    return makeUnauthorizedRequest('POST', '/auth/signup', userdata);
}