import { LoaderReducer } from './LoaderReducer';
import { LoginReducer } from '../Reducer/LoginReducer';
import { combineReducers } from 'redux';
import { BasicInfoReducer } from './BasicInfoReducer';
import { VerificationReducer } from './VerificationReducer';
import { PasswordReducer } from './PasswordReducer';
import { ForgotPasswordReducer } from './ForgotPasswordReducer';
import { EmailVerificationReducer } from './EmailVerificationReducer';
import { ChangePasswordReducer } from './ChangePasswordReducer';
import { ProfileReducer } from './ProfileReducer';
import { EditProfileReducer } from './EditProfileReducer';
import { InviteUserReducer } from './InviteUserReducer';
import { InvitedReducer } from './InvitedReducer';
import { ReferReducer } from './ReferReducer';
import { InvitesReducer } from './InvitesReducer';
import { InvitesStatusReducer } from './InvitesSatusReducer';
import { ActiveStatusReducer } from './ActionStatusReducer';
import { InvitedStatusReducer } from './InvitedStatusReducer';
import { RejectedStatusReducer } from './RejectedStatusReducer';
import { InvitesAcceptReducer } from './InvitesAcceptReducer';
import { LogOutReducer } from './LogOutReducer';
import { ConnectionBadgeReducer } from './ConnectionBadgeReducer';
import { ActiveReducer } from './ActiveReducer';
import { SentReducer } from './SentReducer';
import { RejectedReducer } from './RejectedReducer';
import { ExpertCircleReducer } from './ExpertCircleReducer';
import { ClientCircleReducer } from './ClientCircleReducer';
import { ForgotOtpReducer } from './ForgotOtpReducer';
import { MyProfileReducer } from './MyProfileReducer';
import { ProfileUpdateReducer } from './ProfileUpdateReducer';
import { FilterReducer } from './FilterReducer';
import { ActiveFilterReducer } from './ActiveFilterReducer';
import { RecievedFilterReducer } from './ReceivedFilterReducer';
import { RejectFilterReducer } from './RejectFilterReducer';
import { ExpertRefreshReducer } from './ExpertRefreshReducer';
import { ClientRefreshReducer } from './ClientRefreshRecucer';
import { FcmTokenReducer } from './FcmTokenReducer';
import { GetEmailsReducer } from './GetEmailsReducer';
import { MessageBaseReducer } from './MessageBaseReducer';
import { ConversationReducer } from './ConversationReducer';

export default combineReducers({
  loader: LoaderReducer,
  logout: LogOutReducer,
  bdge: ConnectionBadgeReducer,
  expertrefresh: ExpertRefreshReducer,
  clientrefresh: ClientRefreshReducer,
  rejectefilter: RejectFilterReducer,
  //------------ Connection Filter ---------\\
  filter: FilterReducer,
  activefilter: ActiveFilterReducer,
  receivedfilter: RecievedFilterReducer,
  messageBase: MessageBaseReducer,

  //------------ Authentication ---------\\
  login: LoginReducer,
  basicinfo: BasicInfoReducer,
  verification: VerificationReducer,
  password: PasswordReducer,
  emailverification: EmailVerificationReducer,
  forgotpassword: ForgotPasswordReducer,
  forgototp: ForgotOtpReducer,
  fcmtoken: FcmTokenReducer,
  getemails: GetEmailsReducer,
  //------------ Profile ---------\\
  changepassword: ChangePasswordReducer,
  profile: ProfileReducer,
  editprofile: EditProfileReducer,
  refer: ReferReducer,
  myprofile: MyProfileReducer,
  profileupdate: ProfileUpdateReducer,

  //------------ MyCircale ---------\\
  expertcircle: ExpertCircleReducer,
  clienrcircle: ClientCircleReducer,

  //------------ Invite ---------\\
  invite: InviteUserReducer,
  invited: InvitedReducer,

  //------------ Connection Status---------\\
  invitesstatus: InvitesStatusReducer,
  activestatus: ActiveStatusReducer,
  invitedstatus: InvitedStatusReducer,
  rejectstatus: RejectedStatusReducer,
  invitesaccept: InvitesAcceptReducer,

  //------------ Connection ---------\\
  invites: InvitesReducer,
  active: ActiveReducer,
  sent: SentReducer,
  rejected: RejectedReducer,

  //------------ ConversationList ---------\\
  conversation: ConversationReducer

});
