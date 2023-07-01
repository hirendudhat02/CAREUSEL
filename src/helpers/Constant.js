export default {
  // baseURL: 'http://44.228.113.18/api/v1/mobileApp/', //devlopment server
  baseURL: 'http://staging.careusel.com/api/v1/mobileApp/', //staging server

  // PrivetURL: 'http://dev.careusel.com/#/privacy-policy', //devlopment server
  PrivetURL: 'http://staging.careusel.com/#/privacy-policy', //staging server
  end_Point: {
    //------------ Authentication ---------\\
    LOGIN: 'signinUser',
    BASICINFO: 'otpSendEmailVerification',
    VERIFICATION: 'verifySignupOtp',
    PASSWORD: 'setPassword',
    EMAILVERIFICATION: 'forgetPassword',
    FORGOTPASSWORD: 'resetPassword',
    FORGOTOTP: 'resetPasswordOtp',
    FCMTOKEN: 'fcmDeviceToken',
    GETEMAILS: 'getUserByEmails',

    //------------ Profile ---------\\
    CHANGEPASSWORD: 'changesPassword',
    PROFILE: 'usersDetails/',
    UPDATEPROFILE: 'updateUsersDetails/',
    REFER: 'sendInvitationexpert',
    UPDATE: 'uploadProfilePic/',

    //------------ Invite ---------\\
    INVITEUSER: 'getAllUsers/',
    INVITED: 'inviteToCircle',

    //------------ My Circle ---------\\
    MYCIRCALE: 'getActiveExpertsAndClients',

    //------------ Connection ---------\\
    CONNECTION: 'connections',
    CONNECTIONSTATUS: 'connectionStatus',

    //------------ Logout ---------\\
    LOGOUT: 'logout',
  },
};
