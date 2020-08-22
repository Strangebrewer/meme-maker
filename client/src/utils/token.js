import axios from '../plugins/axios';

export function setAuthToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function resetAuthToken() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
}