import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Icon, IconInfo, Text } from '../../../components';
import { colors } from '../../../theme';
import moment from 'moment';
import { moderateScale } from '../../../helpers/ResponsiveFonts';
const ActiveCard = ({ item, index, screentype, deleteonPress, onProfilePress }) => {
  return (
    <View style={styles.container} key={index}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* <TouchableOpacity activeOpacity={0.5} onPress={onProfilePress}> */}
          <Text isBold={true} style={styles.name}>
            {item.invitedUserName}
          </Text>
          {/* </TouchableOpacity> */}
          {item?.invitedUserType === 'expert' ? (
            <View style={styles.expertview}>
              <Text style={styles.expert}>Expert</Text>
            </View>
          ) : null}
        </View>
        <IconInfo
          disabled={true}
          icon="mailicon"
          label={item.invitedUserEmail}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text isBold style={styles.Invited}>
              {screentype === 'Invited'
                ? 'Invited on:'
                : screentype === 'Reject'
                  ? 'Inactivated on:'
                  : 'Connected on:'}
            </Text>
            <Text>{moment(new Date(item.createdAt)).format('MM/DD/YYYY')}</Text>
          </View>
          {screentype !== 'Reject' ? (
            <Icon
              onPress={deleteonPress}
              name={'deletebutton'}
              height={35}
              size={35}
              style={{ paddingRight: 5 }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ActiveCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.grayLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: colors.white,
  },
  name: {
    fontSize: moderateScale(17),
    color: colors.secoundry,
    width: '75%',
  },
  Invited: {
    fontSize: moderateScale(15),
    color: colors.charcoal,
  },
  details: {
    fontSize: moderateScale(16),
    color: colors.charcoal,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  denideicon: {
    paddingLeft: 15,
  },
  expert: {
    fontSize: moderateScale(13),
    borderWidth: 1,
    color: colors.primary,
    borderColor: colors.primary,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  expertview: {
    justifyContent: 'center',
    right: -5,
    top: -5,
  },
});
