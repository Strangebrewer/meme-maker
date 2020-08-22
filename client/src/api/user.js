import axios from '../plugins/axios';

export default {
    me: () => axios.get('users'),
    login: data => axios.post('users/login', data),
    register: data => axios.post('users/register', data),
    update: (id, data) => axios.put(`users/${id}`, data)
};