import axios from 'axios'

export const REACT_APP_URL = process.env.REACT_APP_URL;
const URL = `${REACT_APP_URL}/api/`
const error_reponse = 'Something wrong happened'

export const getRequest = async (name) => {
    return await axios.get(URL + name, { withCredentials: true })
        .then(resp => resp.data)
        .catch(err => error_reponse);
}

export const postRequest = async (name, payload) => {
    return await axios.post(URL + name, payload, { withCredentials: true })
        .then(resp => resp.data)
        .catch(err => error_reponse);
}

export const deleteRequest = async (name) => {
    return await axios.delete(URL + name, { withCredentials: true })
        .then(resp => resp.data)
        .catch(err => error_reponse);
}

export const putRequest = async (name, payload) => {
    return await axios.put(URL + name, payload, { withCredentials: true })
        .then(resp => resp.data)
        .catch(err => error_reponse);
}