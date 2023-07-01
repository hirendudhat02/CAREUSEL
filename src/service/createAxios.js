import axios from 'axios';

const createAxios = URL => {
  const instance = axios.create({
    baseURL: URL,
  });
  instance.interceptors.request.use(
    async function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      console.log(error);
      return Promise.reject(error);
    },
  );

  return {
    get: config =>
      instance({
        method: 'GET',
        ...config,
      }),
    post: config =>
      instance({
        method: 'POST',
        ...config,
      }),
    put: config =>
      instance({
        method: 'PUT',
        ...config,
      }),
    remove: config =>
      instance({
        method: 'DELETE',
        ...config,
      }),
    patch: config =>
      instance({
        method: 'PATCH',
        ...config,
      }),
  };
};

export default createAxios;
