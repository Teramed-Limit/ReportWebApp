import Axios from 'axios-observable';

export const axiosIns = Axios.create({
    baseURL: process.env.REACT_APP_REST_API,
});
