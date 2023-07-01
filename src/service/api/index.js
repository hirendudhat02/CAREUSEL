import {BASE_URL} from '../config';
import createAxios from '../createAxios';
import authApi from './auth';
import userApi from './user';

const axiosInstance = createAxios(BASE_URL);

const api = {
  auth: authApi(axiosInstance),
  user: userApi(axiosInstance),
};

export default api;
