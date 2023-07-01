/**
 * This is Auth API end point function
 */
const authApi = ({get, post, put, remove}) => {
  const getV1Uri = url => `/api/v1/${url}`;

  const login = data => post({url: getV1Uri(`preAuth/login`), data});

  return {
    login,
  };
};

export default authApi;
