import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Icon, Text } from '../../../components';
import { colors } from '../../../theme';
import moment from 'moment';
import { moderateScale } from '../../../helpers/ResponsiveFonts';

const InviteCard = ({ item, index, tickOnpress, denideOnpress }) => {
  return (
    <View style={styles.container} key={index}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text isBold={true} style={styles.name}>
            {item.inviteeName}
          </Text>
          {item?.inviteeUserType === 'expert' ? (
            <View style={styles.expertview}>
              <Text style={styles.expert}>Expert</Text>
            </View>
          ) : null}
        </View>
        {/* <IconInfo disabled={true} icon="mailicon" label={item.inviteeEmail} /> */}
        {item.invitedUserProfession && (
          <Text
            style={
              styles.details
            }>{`${item.invitedUserProfession} has sent you a connection request.`}</Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <View>
            <Text isBold style={styles.Invited}>
              Invited on:
            </Text>
            <Text>{moment(new Date(item.createdAt)).format('MM/DD/YYYY')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Icon
              name={'tickbutton'}
              height={35}
              size={35}
              onPress={tickOnpress}
            />
            <Icon
              name={'denidebutton'}
              style={styles.denideicon}
              onPress={denideOnpress}
              height={35}
              size={35}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default InviteCard;

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
    paddingBottom: 5,
    width: '70%',
  },
  Invited: {
    fontSize: moderateScale(15),
    color: colors.charcoal,
    paddingBottom: 5,
  },
  details: {
    fontSize: moderateScale(14),
    color: colors.charcoal,
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  denideicon: {
    paddingLeft: 10,
    paddingRight: 5,
  },
  expert: {
    fontSize: moderateScale(14),
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
