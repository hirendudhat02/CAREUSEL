/* eslint-disable no-param-reassign */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable radix */
import React from 'react';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { CometChatManager } from '../../../utils/controller';
import { ConversationListManager } from './controller';
import * as enums from '../../../utils/enums';
import * as consts from '../../../utils/consts';
import CometChatConversationListItem from '../CometChatConversationListItem';
import theme from '../../../resources/theme';
import styles from './styles';
import Sound from 'react-native-sound';
import DropDownAlert from '../../Shared/DropDownAlert';
import { UIKitSettings } from '../../../utils/UIKitSettings';
import {
  CometChatContextProvider,
  CometChatContext,
} from '../../../utils/CometChatContext';
import { incomingOtherMessageAlert } from '../../../resources/audio';
import {
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import { logger } from '../../../utils/common';
import { SwipeListView } from 'react-native-swipe-list-view';
import { UserListManager } from '../../Users/CometChatUserList/controller';
import { Container, Input, Text } from '../../../../../../components';
import { CometChatAvatar } from '../../Shared';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { colors, fonts } from '../../../../../../theme';
import AppModal from '../../../../../../components/Modal';
import { connect, useDispatch } from 'react-redux';
import { MessagebaseAction } from '../../../../../../redux/Action/MessageBase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActiveRequest } from '../../../../../../redux/Action/ActiveAction';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ConversationRequest } from '../../../../../../redux/Action/ConversationListAction';
import FastImage from 'react-native-fast-image';
import { images } from '../../../../../../assets';
import { moderateScale } from '../../../../../../helpers/ResponsiveFonts';
class CometChatConversationList extends React.Component {
  loggedInUser = null;

  decoratorMessage = 'Loading...';
  static contextType = CometChatContext;
  constructor(props) {
    super(props);

    this.state = {
      conversationList: [],
      serachItem: [],
      selectedConversation: undefined,
      showSmallHeader: false,
      isMessagesSoundEnabled: true,
      textInputValue: '',
      SearchInputValue: '',
      modalOpen: false,
      successModalOpen: false,
      removeconversation: {},
      searchModalOpen: false,
      AlluserList: [],
    };
    this.chatListRef = React.createRef();
    this.theme = { ...theme, ...this.props.theme };
    this.textInputRef = React.createRef(null);
    Sound.setCategory('Ambient', true);
    this.audio = new Sound(incomingOtherMessageAlert);
    this.UIKitSettingsBuilder = new UIKitSettings();
  }

  componentDidMount() {
    this.decoratorMessage = 'Loading...';
    this.props.increaseCounter(this.props.navigation);
    if (this.ConversationListManager) {
      this.ConversationListManager.removeListeners();
    }
    this.setState({ conversationList: [] });
    this.ConversationListManager = new ConversationListManager();
    this.getConversations();
    this.ConversationListManager.attachListeners(this.conversationUpdated);
    this.checkRestrictions();
    try {
      this.navListener = this.props.navigation.addListener('focus', () => {
        this.props.increaseCounter(this.props.navigation);
        this.decoratorMessage = 'Loading...';
        if (this.ConversationListManager) {
          this.ConversationListManager.removeListeners();
        }
        this.setState({ conversationList: [] });
        this.ConversationListManager = new ConversationListManager();
        this.getConversations();
        this.ConversationListManager.attachListeners(this.conversationUpdated);
        this.checkRestrictions();
      });
    } catch (error) {
      logger(error);
    }
  }

  checkRestrictions = async () => {
    let isMessagesSoundEnabled = true;
    // await this.context.FeatureRestriction.isMessagesSoundEnabled();
    this.setState({ isMessagesSoundEnabled });
  };

  componentDidUpdate(prevProps) {
    try {
      const previousItem = JSON.stringify(prevProps.item);
      const currentItem = JSON.stringify(this.props.item);

      // if different conversation is selected
      if (previousItem !== currentItem) {
        if (Object.keys(this.props.item).length === 0) {
          this.chatListRef.scrollTop = 0;
          this.setState({ selectedConversation: {} });
        } else {
          const conversationList = [...this.state.conversationList];
          const conversationObj = conversationList.find(c => {
            if (
              (c.conversationType === this.props.type &&
                this.props.type === 'user' &&
                c.conversationWith.uid === this.props.item.uid) ||
              (c.conversationType === this.props.type &&
                this.props.type === CometChat.ACTION_TYPE.TYPE_GROUP &&
                c.conversationWith.guid === this.props.item.guid)
            ) {
              return c;
            }

            return false;
          });

          if (conversationObj) {
            const conversationKey = conversationList.indexOf(conversationObj);
            const newConversationObj = {
              ...conversationObj,
              unreadMessageCount: 0,
            };

            conversationList.splice(conversationKey, 1, newConversationObj);
            this.setState({
              conversationList,
              selectedConversation: newConversationObj,
            });
          }
        }
      }

      // if user is blocked/unblocked, update conversationList in state
      if (
        prevProps.item &&
        Object.keys(prevProps.item).length &&
        prevProps.item.uid === this.props.item.uid &&
        prevProps.item.blockedByMe !== this.props.item.blockedByMe
      ) {
        const conversationList = [...this.state.conversationList];

        // search for user
        const convKey = conversationList.findIndex(
          c =>
            c.conversationType === 'user' &&
            c.conversationWith.uid === this.props.item.uid,
        );
        if (convKey > -1) {
          conversationList.splice(convKey, 1);

          this.setState({ conversationList });
        }
      }

      if (
        prevProps.groupToUpdate &&
        (prevProps.groupToUpdate.guid !== this.props.groupToUpdate.guid ||
          (prevProps.groupToUpdate.guid === this.props.groupToUpdate.guid &&
            (prevProps.groupToUpdate.membersCount !==
              this.props.groupToUpdate.membersCount ||
              prevProps.groupToUpdate.scope !==
              this.props.groupToUpdate.scope)))
      ) {
        const conversationList = [...this.state.conversationList];
        const { groupToUpdate } = this.props;

        const convKey = conversationList.findIndex(
          c =>
            c.conversationType === 'group' &&
            c.conversationWith.guid === groupToUpdate.guid,
        );
        if (convKey > -1) {
          const convObj = conversationList[convKey];

          const convWithObj = { ...convObj.conversationWith };

          const newConvWithObj = {
            ...convWithObj,
            scope: groupToUpdate.scope,
            membersCount: groupToUpdate.membersCount,
          };
          const newConvObj = { ...convObj, conversationWith: newConvWithObj };

          conversationList.splice(convKey, 1, newConvObj);
          this.setState({ conversationList });
        }
      }

      if (prevProps.messageToMarkRead !== this.props.messageToMarkRead) {
        const message = this.props.messageToMarkRead;
        this.makeConversation(message)
          .then(response => {
            const { conversationKey, conversationObj, conversationList } =
              response;

            if (conversationKey > -1) {
              const unreadMessageCount = this.makeUnreadMessageCount(
                conversationObj,
                'decrement',
              );
              const lastMessageObj = this.makeLastMessage(
                message,
                conversationObj,
              );

              const newConversationObj = {
                ...conversationObj,
                lastMessage: lastMessageObj,
                unreadMessageCount,
              };
              conversationList.splice(conversationKey, 1);
              conversationList.unshift(newConversationObj);
              this.setState({ conversationList: conversationList });
            }
          })
          .catch(error => {
            const errorCode = error?.message || 'ERROR';
            this.dropDownAlertRef?.showMessage('error', errorCode);
            logger(
              'This is an error in converting message to conversation',
              error,
            );
          });
      }

      if (prevProps.lastMessage !== this.props.lastMessage) {
        const { lastMessage } = this.props;
        const conversationList = [...this.state.conversationList];
        const conversationKey = conversationList.findIndex(
          c => c.conversationId === lastMessage.conversationId,
        );

        if (conversationKey > -1) {
          const conversationObj = conversationList[conversationKey];
          const newConversationObj = { ...conversationObj, lastMessage };

          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });
        } else {
          // TODO: dont know what to do here
          const chatListMode = this.UIKitSettingsBuilder.chatListMode;
          const chatListFilterOptions = UIKitSettings.chatListFilterOptions;
          if (chatListMode !== chatListFilterOptions['USERS_AND_GROUPS']) {
            if (
              (chatListMode === chatListFilterOptions['USERS'] &&
                lastMessage.receiverType === CometChat.RECEIVER_TYPE.GROUP) ||
              (chatListMode === chatListFilterOptions['GROUPS'] &&
                lastMessage.receiverType === CometChat.RECEIVER_TYPE.USER)
            ) {
              return false;
            }
          }

          const getConversationId = () => {
            let conversationId = null;
            if (this.getContext().type === CometChat.RECEIVER_TYPE.USER) {
              const users = [this.loggedInUser.uid, this.getContext().item.uid];
              conversationId = users.sort().join('_user_');
            } else if (
              this.getContext().type === CometChat.RECEIVER_TYPE.GROUP
            ) {
              conversationId = `group_${this.getContext().item.guid}`;
            }

            return conversationId;
          };

          let newConversation = new CometChat.Conversation();
          newConversation.setConversationId(getConversationId());
          newConversation.setConversationType(this.getContext().type);
          newConversation.setConversationWith(this.getContext().item);
          newConversation.setLastMessage(lastMessage);
          newConversation.setUnreadMessageCount(0);

          conversationList.unshift(newConversation);
          this.setState({ conversationList: conversationList });
          // this.getContext().setLastMessage({});
        }
      }

      if (
        prevProps.groupToDelete &&
        prevProps.groupToDelete.guid !== this.props.groupToDelete.guid
      ) {
        let conversationList = [...this.state.conversationList];
        const groupKey = conversationList.findIndex(
          member =>
            member.conversationWith.guid === this.props.groupToDelete.guid,
        );
        if (groupKey > -1) {
          conversationList.splice(groupKey, 1);
          this.setState({ conversationList: conversationList });
          if (conversationList.length === 0) {
            this.decoratorMessage = 'No records found';
          }
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  componentWillUnmount() {
    try {
      if (this.ConversationListManager) {
        this.ConversationListManager.removeListeners();
      }
      this.ConversationListManager = null;
      if (this.navListener) {
        this.navListener();
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Handles live updates from server using listeners
   * @param key:action
   * @param item:object related to Users
   * @param message:object related to Messages
   * @param options: extra data
   * @param actionBy: user object of action taker
   */
  conversationUpdated = (key, item, message, options, actionBy) => {
    const chatListMode = this.UIKitSettingsBuilder.chatListMode;
    const chatListFilterOptions = UIKitSettings.chatListFilterOptions;

    if (chatListMode !== chatListFilterOptions['USERS_AND_GROUPS']) {
      if (
        (chatListMode === chatListFilterOptions['USERS'] &&
          message.receiverType === CometChat.RECEIVER_TYPE.GROUP) ||
        (chatListMode === chatListFilterOptions['GROUPS'] &&
          message.receiverType === CometChat.RECEIVER_TYPE.USER)
      ) {
        return false;
      }
    }
    try {
      switch (key) {
        case enums.USER_ONLINE:
        case enums.USER_OFFLINE:
          this.updateUser(item);
          break;
        case enums.TEXT_MESSAGE_RECEIVED:
        case enums.MEDIA_MESSAGE_RECEIVED:
        case enums.CUSTOM_MESSAGE_RECEIVED:
          this.updateConversation(message);
          this.markMessageAsDelivered(message);
          break;
        case enums.MESSAGE_EDITED:
        case enums.MESSAGE_DELETED:
          this.conversationEditedDeleted(message);
          break;
        case enums.INCOMING_CALL_RECEIVED:
        case enums.INCOMING_CALL_CANCELLED:
          this.updateConversation(message, false);
          break;
        case enums.GROUP_MEMBER_ADDED:
          if (this.loggedInUser.uid !== actionBy.uid) {
            this.updateGroupMemberAdded(message, options);
          }

          break;
        case enums.GROUP_MEMBER_KICKED:
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_LEFT:
          this.updateGroupMemberRemoved(message, options);
          break;
        case enums.GROUP_MEMBER_SCOPE_CHANGED:
          this.updateGroupMemberScopeChanged(message, options);
          break;
        case enums.GROUP_MEMBER_JOINED:
          this.updateGroupMemberChanged(message, options, 'increment');
          break;
        case enums.GROUP_MEMBER_UNBANNED:
          this.updateGroupMemberChanged(message, options, '');
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  };
  markMessageAsDelivered = message => {
    try {
      if (
        message.sender?.uid !== this.loggedInUser?.uid &&
        message.hasOwnProperty('deliveredAt') === false
      ) {
        CometChat.markAsDelivered(message);
      }
    } catch (error) {
      logger(
        '[CometChatConversationList markMessageAsDelivered] faailed to mark as deivered =',
        message,
      );
    }
  };

  /**
   * Handle update user details in existing conversation object
   * @param user:User Object
   */
  updateUser = user => {
    try {
      const conversationList = [...this.state.conversationList];
      const conversationKey = conversationList.findIndex(
        conversationObj =>
          conversationObj.conversationType === 'user' &&
          conversationObj.conversationWith.uid === user.uid,
      );

      if (conversationKey > -1) {
        const conversationObj = { ...conversationList[conversationKey] };
        const conversationWithObj = {
          ...conversationObj.conversationWith,
          status: user.getStatus(),
        };

        const newConversationObj = {
          ...conversationObj,
          conversationWith: conversationWithObj,
        };
        conversationList.splice(conversationKey, 1, newConversationObj);
        this.setState({ conversationList });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Play audio alert
   * @param
   */
  playAudio = () => {
    try {
      if (this.state.playingAudio || !this.state.isMessagesSoundEnabled) {
        return false;
      }

      this.setState({ playingAudio: true }, () => {
        this.audio.setCurrentTime(0);
        this.audio.play(() => {
          this.setState({ playingAudio: false });
        });
      });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Retrieve conversation object from message
   * @param message : message object
   */
  makeConversation = message => {
    const promise = new Promise((resolve, reject) => {
      CometChat.CometChatHelper.getConversationFromMessage(message)
        .then(conversation => {
          const conversationList = [...this.state.conversationList];
          const conversationKey = conversationList.findIndex(
            c => c.conversationId === conversation.conversationId,
          );
          let conversationObj = { ...conversation };
          if (conversationKey > -1) {
            conversationObj = { ...conversationList[conversationKey] };
          }

          resolve({
            conversationKey,
            conversationObj,
            conversationList,
          });
        })
        .catch(error => reject(error));
    });

    return promise;
  };

  /**
   * Retrieve unread message count from conversation
   * @param conversation : conversation object
   * @param operator : extra option to handle decrease in unread message count
   */
  makeUnreadMessageCount = (conversation = {}, operator) => {
    try {
      if (Object.keys(conversation).length === 0) {
        return 1;
      }

      let unreadMessageCount = parseInt(conversation.unreadMessageCount);
      if (operator && operator === 'decrement') {
        unreadMessageCount = unreadMessageCount ? unreadMessageCount - 1 : 0;
      } else {
        unreadMessageCount += 1;
      }

      return unreadMessageCount;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Retrieve message data
   * @param
   */
  makeLastMessage = message => {
    const newMessage = { ...message };
    return newMessage;
  };

  /**
   * Handle updating conversation object on any message
   * @param message: message object
   * @param notification: boolean to play audio alert @default : true
   */
  updateConversation = (message, notification = true) => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;

        if (conversationKey > -1) {
          const unreadMessageCount = this.makeUnreadMessageCount(
            conversationList[conversationKey],
          );
          const lastMessageObj = this.makeLastMessage(message, conversationObj);

          const newConversationObj = {
            ...conversationObj,
            lastMessage: lastMessageObj,
            unreadMessageCount,
          };
          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });

          if (notification) {
            this.playAudio(message);
          }
        } else {
          const unreadMessageCount = this.makeUnreadMessageCount();
          const lastMessageObj = this.makeLastMessage(message);

          const newConversationObj = {
            ...conversationObj,
            lastMessage: lastMessageObj,
            unreadMessageCount,
          };
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });

          if (notification) {
            this.playAudio(message);
          }
        }
      })
      .catch(error => {
        logger('This is an error in converting message to conversation', error);
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
      });
  };

  /**
   * Handle editing/deleting conversation object
   * @param message: message object
   */
  conversationEditedDeleted = message => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;

        if (conversationKey > -1) {
          const lastMessageObj = conversationObj.lastMessage;

          if (lastMessageObj.id === message.id) {
            const newLastMessageObj = { ...lastMessageObj, ...message };
            const newConversationObj = {
              ...conversationObj,
              lastMessage: newLastMessageObj,
            };
            conversationList.splice(conversationKey, 1, newConversationObj);
            this.setState({ conversationList: conversationList });
          }
        }
      })
      .catch(error => {
        logger('This is an error in converting message to conversation', error);
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
      });
  };

  /**
   * Handle updating group member in existing conversation objects
   * @param message: message object
   * @param options: contains user object for user added to group
   */
  updateGroupMemberAdded = (message, options) => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;

        if (conversationKey > -1) {
          const unreadMessageCount =
            this.makeUnreadMessageCount(conversationObj);
          const lastMessageObj = this.makeLastMessage(message, conversationObj);

          const conversationWithObj = { ...conversationObj.conversationWith };
          const membersCount = parseInt(conversationWithObj.membersCount) + 1;
          const newConversationWithObj = {
            ...conversationWithObj,
            membersCount,
          };

          const newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
            unreadMessageCount,
          };
          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });
          this.playAudio(message);
        } else if (options && this.loggedInUser.uid === options.user.uid) {
          const unreadMessageCount = this.makeUnreadMessageCount();
          const lastMessageObj = this.makeLastMessage(message);

          const conversationWithObj = { ...conversationObj.conversationWith };
          const membersCount = parseInt(conversationWithObj.membersCount) + 1;
          const scope = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
          const { hasJoined } = options;

          const newConversationWithObj = {
            ...conversationWithObj,
            membersCount,
            scope,
            hasJoined,
          };
          const newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
            unreadMessageCount,
          };
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });
          this.playAudio(message);
        }
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
        logger('This is an error in converting message to conversation', error);
      });
  };

  /**
   * Handle removing group member in existing conversation objects
   * @param message: message object
   * @param options: contains user object for user removed from group
   */
  updateGroupMemberRemoved = (message, options) => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;

        if (conversationKey > -1) {
          if (options && this.loggedInUser.uid === options.user.uid) {
            conversationList.splice(conversationKey, 1);
            this.setState({ conversationList: conversationList });
          } else {
            const unreadMessageCount =
              this.makeUnreadMessageCount(conversationObj);
            const lastMessageObj = this.makeLastMessage(
              message,
              conversationObj,
            );

            const conversationWithObj = { ...conversationObj.conversationWith };
            const membersCount = parseInt(conversationWithObj.membersCount) - 1;
            const newConversationWithObj = {
              ...conversationWithObj,
              membersCount,
            };

            const newConversationObj = {
              ...conversationObj,
              conversationWith: newConversationWithObj,
              lastMessage: lastMessageObj,
              unreadMessageCount,
            };
            conversationList.splice(conversationKey, 1);
            conversationList.unshift(newConversationObj);
            this.setState({ conversationList: conversationList });
            this.playAudio(message);
          }
        }
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
        logger('This is an error in converting message to conversation', error);
      });
  };

  /**
   * Handle updating group member scope in existing conversation objects
   * @param message: message object
   * @param options: contains user object for user whose scope is changed to group
   */
  updateGroupMemberScopeChanged = (message, options) => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;

        if (conversationKey > -1) {
          const unreadMessageCount =
            this.makeUnreadMessageCount(conversationObj);
          const lastMessageObj = this.makeLastMessage(message, conversationObj);

          const conversationWithObj = { ...conversationObj.conversationWith };
          const membersCount = parseInt(conversationWithObj.membersCount);
          let { scope } = conversationWithObj;

          if (options && this.loggedInUser.uid === options.user.uid) {
            scope = options.scope;
          }

          const newConversationWithObj = {
            ...conversationWithObj,
            membersCount,
            scope,
          };
          const newConversationObj = {
            ...conversationObj,
            conversationWith: newConversationWithObj,
            lastMessage: lastMessageObj,
            unreadMessageCount,
          };
          conversationList.splice(conversationKey, 1);
          conversationList.unshift(newConversationObj);
          this.setState({ conversationList: conversationList });
          this.playAudio(message);
        }
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
        logger('This is an error in converting message to conversation', error);
      });
  };

  /**
   * Handle updating group members in existing conversation objects on member joined/unbanned
   * @param message: message object
   * @param options: contains user object for user added to group
   * @param operator: for incrementing member count
   */
  updateGroupMemberChanged = (message, options, operator) => {
    this.makeConversation(message)
      .then(response => {
        const { conversationKey, conversationObj, conversationList } = response;
        if (conversationKey > -1) {
          if (options && this.loggedInUser.uid !== options.user.uid) {
            const unreadMessageCount =
              this.makeUnreadMessageCount(conversationObj);
            const lastMessageObj = this.makeLastMessage(
              message,
              conversationObj,
            );

            const conversationWithObj = { ...conversationObj.conversationWith };
            let membersCount = parseInt(conversationWithObj.membersCount);
            if (operator === 'increment') {
              membersCount += 1;
            }

            const newConversationWithObj = {
              ...conversationWithObj,
              membersCount,
            };
            const newConversationObj = {
              ...conversationObj,
              conversationWith: newConversationWithObj,
              lastMessage: lastMessageObj,
              unreadMessageCount,
            };
            conversationList.splice(conversationKey, 1);
            conversationList.unshift(newConversationObj);
            this.setState({ conversationList: conversationList });
            this.playAudio(message);
          }
        }
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
        logger('This is an error in converting message to conversation', error);
      });
  };
  /**
   * Handle clicking on list item
   * @param conversation: conversation object of the item clicked
   */
  handleClick = conversation => {
    try {
      if (!this.props.onItemClick) return;

      this.props.onItemClick(
        conversation.conversationWith,
        conversation.conversationType,
      );
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Retrieve conversation list according to the logged in user
   * @param
   */
  getConversations = () => {
    new CometChatManager()
      .getLoggedInUser()
      .then(user => {
        this.loggedInUser = user;
        this.ConversationListManager.fetchNextConversation()
          .then(conversationList => {
            if (conversationList.length === 0) {
              this.decoratorMessage = 'No records found';
            }

            this.setState({
              conversationList: [
                ...this.state.conversationList,
                ...conversationList,
              ],
            });
          })
          .catch(error => {
            this.decoratorMessage = 'Error';
            const errorCode = error?.message || 'ERROR';
            this.dropDownAlertRef?.showMessage('error', errorCode);
            logger(
              '[CometChatConversationList] getConversations fetchNext error',
              error,
            );
          });
      })
      .catch(error => {
        this.decoratorMessage = 'Error';
        logger(
          '[CometChatConversationList] getConversations getLoggedInUser error',
          error,
        );
      });
  };

  /**
   * header component for conversation list
   * @param
   */
  listHeaderComponent = () => {
    //list header avatar here.
    return (
      <View style={[styles.conversationHeaderStyle]}>
        <View style={styles.headingContainer}>
          <Text style={styles.conversationHeaderTitleStyle}>Chats</Text>
        </View>
      </View>
    );
  };

  /**
   * component to show if conversation list length is 0
   * @param
   */
  listEmptyContainer = () => {
    // for loading purposes....
    return (
      <>
        {this.decoratorMessage === 'Error' ? (
          <TouchableOpacity
            style={styles.buttoncontactMsgStyle}
            activeOpacity={0.5}
            onPress={() => {
              this.setState({ searchModalOpen: true });
              this.getUsers(this.props.AlluserList);
            }}>
            <Text
              style={[
                styles.buttonontactMsgTxtStyle,
                {
                  color: `${'#FFFFFF'}`,
                },
              ]}>
              {'Click here to start a new conversation'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contactMsgStyle}>
            <Text
              style={[
                styles.contactMsgTxtStyle,
                {
                  color: `${this.theme.color.secondary}`,
                },
              ]}>
              {this.decoratorMessage}
            </Text>
          </View>
        )}
      </>
    );
  };

  /**
   * component for separating 2 conversation list items
   * @param
   */
  itemSeparatorComponent = ({ leadingItem }) => {
    if (leadingItem.header) {
      return null;
    }
    return (
      <View
        style={[
          styles.itemSeperatorStyle,
          {
            borderBottomColor: this.theme.borderColor.primary,
          },
        ]}
      />
    );
  };

  /**
   * check if scroll reached a particular point to handle headers
   * @param
   */
  handleScroll = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y > 35 && !this.state.showSmallHeader) {
      this.setState({
        showSmallHeader: true,
      });
    }
    if (nativeEvent.contentOffset.y <= 35 && this.state.showSmallHeader) {
      this.setState({
        showSmallHeader: false,
      });
    }
  };

  /**
   * Handle end reached of conversation list
   * @param
   */
  endReached = () => {
    this.getConversations();
  };

  deleteConversations = conversation => {
    this.setState({ modalOpen: false });
    let conversationWith =
      conversation.conversationType === CometChat.RECEIVER_TYPE.GROUP
        ? conversation?.conversationWith?.guid
        : conversation?.conversationWith?.uid;
    CometChat.deleteConversation(
      conversationWith,
      conversation.conversationType,
    )
      .then(deletedConversation => {
        this.setState({ modalOpen: true, successModalOpen: true });
        const newConversationList = [...this.state.conversationList];
        const conversationKey = newConversationList.findIndex(
          c => c.conversationId === conversation.conversationId,
        );
        newConversationList.splice(conversationKey, 1);
        this.setState({ conversationList: newConversationList });
      })
      .catch(error => {
        logger(error);
      });
  };

  getUsers = circleUser => {
    this.UserListManager = new UserListManager('');
    new CometChatManager()
      .getLoggedInUser()
      .then((user) => {
        this.UserListManager.fetchNextUsers()
          .then(userList => {
            const filteredUserList = userList.filter(user => {
              const found = this.state.conversationList.find(
                member => user.uid === member.conversationWith.uid,
              );
              if (found) {
                return false;
              }
              return true;
            });
            if (circleUser?.length !== 0) {
              const MycircleUserList = filteredUserList.filter(user => {
                const found = circleUser.find(
                  member => user.uid === member.userId,
                );
                if (found) {
                  return true;
                }
                return false;
              });
              this.setState({
                serachItem: MycircleUserList,
              });
            }
          })
          .catch(error => {
            const errorCode = error?.message || 'ERROR';
            this.dropDownAlertRef?.showMessage('error', errorCode);
            // this.decoratorMessage = 'Error';
            logger('[CometChatUserList] getUsers fetchNext error', error);
          });
      })
      .catch(error => {
        const errorCode = error?.message || 'ERROR';
        this.dropDownAlertRef?.showMessage('error', errorCode);
        // this.decoratorMessage = 'Error';
        logger('[CometChatUserList] getUsers getLoggedInUser error', error);
      });
  };

  /**
   * Handle click on the list item
   * @param
   */
  handleuserClick = user => {
    this.setState({ searchModalOpen: false, textInputValue: '', serachItem: [] });
    setTimeout(() => {
      if (!this.props.onItemClick) return;
      this.props.onItemClick(user, CometChat.RECEIVER_TYPE.USER);
    }, 1000);
  };

  render() {
    return (
      <CometChatContextProvider ref={el => (this.contextProviderRef = el)}>
        <KeyboardAvoidingView style={styles.conversationWrapperStyle}>
          <Container
            title={'Conversations'}
            iconRight={'PlusUser'}
            onIconRightPress={() => {
              this.setState({ searchModalOpen: true });
              this.getUsers(this.props.AlluserList);
            }}>
            <View style={{ marginHorizontal: 10, flex: 1 }}>
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Search"
                  onIconPress={() => {
                    this.setState({ SearchInputValue: '' });
                  }}
                  icon={
                    this.state.SearchInputValue !== '' ? 'close' : 'searchwhite'
                  }
                  value={this.state.SearchInputValue}
                  onChangeText={txt => {
                    this.setState({ SearchInputValue: txt });
                  }}
                />
              </View>

              <SwipeListView
                contentContainerStyle={styles.flexGrow1}
                data={this.state.conversationList.filter(item =>
                  item?.conversationWith?.name
                    .toLowerCase()
                    .includes(this.state.SearchInputValue.trim().toLowerCase()),
                )}
                keyExtractor={(item, index) =>
                  item?.conversationId + '_' + index
                }
                renderHiddenItem={(data, rowMap) => (
                  <View
                    key={data.item?.conversationId}
                    style={{
                      alignItems: 'center',
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 15,
                      marginRight: 2,
                    }}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        bottom: 0,
                        justifyContent: 'center',
                        position: 'absolute',
                        top: 1,
                        width: 75,
                        backgroundColor: 'red',
                        right: 1,
                        maxHeight: 82,
                        borderRadius: 7,
                      }}
                      onPress={() => {
                        this.setState({
                          removeconversation: data.item,
                          modalOpen: true,
                          successModalOpen: false,
                        });
                      }}>
                      <Image
                        source={require('./resources/delete.png')}
                        resizeMode="contain"
                        style={{ height: 24 }}
                      />
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-80}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                renderItem={({ item }) => {
                  return (
                    <CometChatConversationListItem
                      theme={this.theme}
                      config={this.props.config}
                      conversation={item}
                      selectedConversation={this.state.selectedConversation}
                      loggedInUser={this.loggedInUser}
                      handleClick={this.handleClick}
                    />
                  );
                }}
                ListEmptyComponent={this.listEmptyContainer}
                onScroll={this.handleScroll}
                onEndReached={this.endReached}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
                scrollEnabled
              />
            </View>
            <Modal
              visible={this.state.searchModalOpen}
              animated
              animationType="fade"
              transparent>
              <View style={styles.container}>
                <View style={styles.innerContainer}>
                  <View style={styles.modalWrapperStyle}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({ searchModalOpen: false });
                      }}>
                      <View style={styles.modalBodyStyle}>
                        <Icon name="close" style={styles.modalCloseStyle} />
                        <View style={{ marginTop: 30 }}>
                          <Input
                            placeholder="Search"
                            onIconPress={() => {
                              this.setState({ textInputValue: '' });
                            }}
                            icon={
                              this.state.textInputValue !== ''
                                ? 'close'
                                : 'searchwhite'
                            }
                            value={this.state.textInputValue}
                            onChangeText={txt =>
                              this.setState({ textInputValue: txt })
                            }
                          />
                        </View>
                        <View>
                          <FlatList
                            data={this.state.serachItem.filter(item =>
                              item.name
                                .toLowerCase()
                                .includes(
                                  this.state.textInputValue
                                    .trim()
                                    .toLowerCase(),
                                ),
                            )}
                            contentContainerStyle={{ flexGrow: 1, height: '82%' }}
                            ListEmptyComponent={() => {
                              return (
                                <View
                                  style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <FastImage
                                    source={images.nodata}
                                    style={{
                                      height: moderateScale(160),
                                      width: moderateScale(160),
                                      marginBottom: moderateScale(20),
                                    }}
                                  />
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontSize: moderateScale(17),
                                    }}>
                                    No Connection found
                                  </Text>
                                </View>
                              );
                            }}
                            renderItem={({ item }) => {
                              return (
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() => {
                                    this.handleuserClick(item);
                                  }}
                                  style={{
                                    backgroundColor: colors.grayLight,
                                    padding: 10,
                                    borderRadius: 10,
                                    marginTop: 10,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      paddingLeft: 10,
                                      color: colors.black,
                                    }}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </Modal>

            <AppModal
              isVisible={this.state.modalOpen}
              modalTitle={'Delete Conversation'}
              savelable="Yes, Delete"
              canclelable="Cancel"
              modalStyle={this.state.successModalOpen === true ? 'success' : ''}
              details={
                this.state.successModalOpen === true
                  ? 'Conversation has been delete successfully.'
                  : 'Are you sure you want to delete this conversation ?'
              }
              onBackdropPress={() => {
                this.setState({ modalOpen: false });
              }}
              onBackButtonPress={() => {
                this.setState({ modalOpen: false });
              }}
              onPressClose={() => {
                this.setState({ modalOpen: false });
              }}
              onPressOk={() => {
                this.setState({ modalOpen: false });
              }}
              onPressCancle={() => {
                this.setState({ modalOpen: false });
              }}
              onPressSave={() => {
                this.deleteConversations(this.state.removeconversation);
              }}
            />
          </Container>
        </KeyboardAvoidingView>

        <DropDownAlert ref={ref => (this.dropDownAlertRef = ref)} />
      </CometChatContextProvider>
    );
  }
}

const mapStateToProps = state => {
  if (state.conversation.data !== null) {
    return {
      AlluserList: state.conversation?.data?.data?.userList,
    };
  }
};
const mapDispatchToProps = dispatch => {
  return {
    increaseCounter: navigation => {
      dispatch(MessagebaseAction(true));
      AsyncStorage.getItem('userdata').then(Data => {
        if (Data !== null) {
          let UserData = JSON.parse(Data);
          let tokenData = UserData.accessToken[0];
          let payload = {
            currentUserId: UserData._id,
            action: 'active',
          };
          dispatch(ConversationRequest(payload, tokenData, navigation));
        }
      });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CometChatConversationList);

// export default CometChatConversationList;
