import {takeEvery, all} from 'redux-saga/effects';
import {ActionStatusSaga} from './ActionStatusSaga';
import {basicInfoSaga} from './BasicInfoSaga';
import {ChangePasswordSaga} from './ChangePasswordSaga';
import {EditProfileSaga} from './EditProfileSaga';
import {EmailVerificationSaga} from './EmailVerificationSaga';
import {ForgotPasswordSaga} from './ForgotPasswordSaga';
import {InvitedSaga} from './InvitedSaga';
import {InvitesAcceptSaga} from './InvitesAcceptSaga';
import {InvitesSaga} from './InvitesSaga';
import {InvitesStatusSaga} from './InvitesStatusSaga';
import {InviteUserSaga} from './InviteUserSaga';
import {loginSaga} from './LoginSaga';
import {PasswordSaga} from './PasswordSaga';
import {ProfileSaga} from './ProfileSaga';
import {ReferSaga} from './ReferSaga';
import {RejectedStatusSaga} from './RejectedStatusSaga';
import {VerificationSaga} from './VerificationSaga';
import {InvitedStatusSaga} from './InvitedStatusSaga';
import {LogOutSaga} from './LogOutSaga';
import {ConnectionBadgeSaga} from './ConnectionBadgeSaga';
import {ActiveSaga} from './ActiveSaga';
import {SentSaga} from './SentSaga';
import {RejectedSaga} from './RejectedSaga';
import {ClientCircleSaga} from './ClientCricleSaga';
import {ExpertCircleSaga} from './ExpertCircleSaga';
import {ForgotOtpSaga} from './ForgotOtpSaga';
import {MyProfileSaga} from './MyProfileSaga';
import {ProfileUpdateSaga} from './ProfileUpdateSaga';
import {FcmTokenSaga} from './FcmTokenSaga';
import {GetEmailsSaga} from './GetEmailsSaga';
import { ConversationSaga } from './ConversationSaga';
export default function* root_saga() {
  yield all([
    //------------ Authentication ---------\\
    takeEvery('LOGIN_REQUEST', loginSaga),
    takeEvery('BASICINFO_REQUEST', basicInfoSaga),
    takeEvery('VERIFICATION_REQUEST', VerificationSaga),
    takeEvery('PASSWORD_REQUEST', PasswordSaga),
    takeEvery('EMAILVERIFICATION_REQUEST', EmailVerificationSaga),
    takeEvery('FORGOTPASSWORD_REQUEST', ForgotPasswordSaga),
    takeEvery('LOGOUT_REQUEST', LogOutSaga),
    takeEvery('FORGOTOTP_REQUEST', ForgotOtpSaga),
    takeEvery('FCMTOKEN_REQUEST', FcmTokenSaga),
    takeEvery('GETEMAILS_REQUEST', GetEmailsSaga),
    //------------ Profile ---------\\
    takeEvery('CHANGE_PASSWORD_REQUEST', ChangePasswordSaga),
    takeEvery('PROFILE_REQUEST', ProfileSaga),
    takeEvery('EDITPROFILE_REQUEST', EditProfileSaga),
    takeEvery('REFER_REQUEST', ReferSaga),
    takeEvery('MYPROFILE_REQUEST', MyProfileSaga),
    takeEvery('PROFILEUPDATE_REQUEST', ProfileUpdateSaga),

    //------------ Invite ---------\\
    takeEvery('INVITEUSER_REQUEST', InviteUserSaga),
    takeEvery('INVITED_REQUEST', InvitedSaga),

    //------------ MyCircale ---------\\
    takeEvery('EXPERTCIRCLE_REQUEST', ExpertCircleSaga),
    takeEvery('CLIENTCIRCLE_REQUEST', ClientCircleSaga),

    //------------ Connection Status ---------\\
    takeEvery('INVITESSTATUS_REQUEST', InvitesStatusSaga),
    takeEvery('ACTIONSTATUS_REQUEST', ActionStatusSaga),
    takeEvery('INVITEDSTATUS_REQUEST', InvitedStatusSaga),
    takeEvery('REJECTEDSTATUS_REQUEST', RejectedStatusSaga),
    takeEvery('INVITESACCEPTSTATUS_REQUEST', InvitesAcceptSaga),
    takeEvery('CONNECTIONBADGE_REQUEST', ConnectionBadgeSaga),

    //------------ Connection ---------\\
    takeEvery('INVITES_REQUEST', InvitesSaga),
    takeEvery('ACTIVE_REQUEST', ActiveSaga),
    takeEvery('SENT_REQUEST', SentSaga),
    takeEvery('REJECTED_REQUEST', RejectedSaga),

    //------------ ConversationList ---------\\
    takeEvery('CONVERSATION_REQUEST', ConversationSaga),
    
  ]);
}
