import { CometChat } from '@cometchat-pro/react-native-chat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import CometChatViewGroupInfoMemberList from '../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Groups/CometChatViewGroupMemberList';
import { CometChatUserDetails } from '../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Users';
import {
  CometChatUserProfile,
  CometChatUI,
  CometChatMessage,
  CometChatUserListWithMessages,
  CometChatUserList,
  CometChatGroupListWithMessages,
  CometChatGroupList,
  CometChatConversationListWithMessages,
  CometChatConversationList,
} from '../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/index';
import GroupInfo from '../container/conversations/GroupInfo';
import clientProfile from '../container/dashboard/clientProfile';

function CometStackNavigator(props) {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ headerShown: false }}
      initialRouteName={'Conversation'}>
      <Stack.Screen name="CometChatMessages" component={CometChatMessage} />
      <Stack.Screen
        name="Conversation"
        component={CometChatConversationListWithMessages}
      />
      <Stack.Screen name="CometChatUI" component={CometChatUI} />
      <Stack.Screen name="Users" component={CometChatUserListWithMessages} />
      <Stack.Screen name="clientProfile" component={clientProfile} />

      <Stack.Screen name="GroupInfo" component={GroupInfo} />
      <Stack.Screen
        name="CometChatUserDetails"
        component={CometChatUserDetails}
      />
      <Stack.Screen
        name="ConversationComponent"
        component={CometChatConversationList}
      />
      <Stack.Screen name="Group" component={CometChatGroupListWithMessages} />
      <Stack.Screen name="GroupComponent" component={CometChatGroupList} />
      <Stack.Screen name="GroupComponent" component={CometChatGroupList} />
      <Stack.Screen
        name="CometChatViewGroupInfoMemberList"
        component={CometChatViewGroupInfoMemberList}
      />

    </Stack.Navigator>
  );
}

export default CometStackNavigator;
