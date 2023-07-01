/**
 * This is Auth API end point function
 */
const userApi = ({get, post, put, remove}) => {
  const getV1Uri = url => `/api/v1/${url}`;

  const profile = data => post({url: getV1Uri(`freelancer/myProfile`), data});

  return {
    profile,
  };
};

export default userApi;
