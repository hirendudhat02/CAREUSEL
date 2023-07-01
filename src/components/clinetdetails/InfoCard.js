import moment from 'moment';
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import {colors, fonts} from '../../theme';
import IconInfo from '../iconInfo/IconInfo';
import Text from '../text/Text';

const InfoCard = props => {
  const {data, cardtype, profiletype, aboutText, showpactice} = props;
  return (
    <View style={styles.cardShadow}>
      <View style={styles.userDetailsContainer}>
        {data?.member && data?.Birthday && cardtype !== 'About' && (
          <View style={[styles.seperator, styles.bottomView]}>
            <View style={{width: '50%'}}>
              <IconInfo
                disabled={true}
                icon="profile"
                label={'Member Since'}
                labelstyle={{
                  fontSize: moderateScale(15),
                  fontFamily: fonts.SemiBold,
                }}
              />
              <Text style={styles.detailText}>
                {data.member === undefined ||
                data.member === null ||
                data.member === ''
                  ? 'Not Added'
                  : data?.member}
              </Text>
            </View>
            <View style={{width: '50%'}}>
              <IconInfo
                disabled={true}
                icon="birthday"
                label={'Birthday'}
                labelstyle={{
                  fontSize: moderateScale(15),
                  fontFamily: fonts.SemiBold,
                }}
              />
              <Text style={styles.detailText}>
                {data.dob === undefined || data.dob === null || data.dob === ''
                  ? 'Not Added'
                  : moment(data?.dob).format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>
        )}
        {data?.accountVerifiedDate !== undefined &&
          data?.clientCount !== undefined &&
          cardtype !== 'About' &&
          cardtype !== 'profile' && (
            <>
              <View style={[styles.seperator, styles.bottomView]}>
                <View style={{width: '50%'}}>
                  <IconInfo
                    disabled={true}
                    icon="profile"
                    label={'Member Since'}
                    labelstyle={{
                      fontSize: moderateScale(15),
                      fontFamily: fonts.SemiBold,
                    }}
                  />
                  <Text style={styles.detailText}>
                    {data.accountVerifiedDate === undefined ||
                    data.accountVerifiedDate === null ||
                    data.accountVerifiedDate === ''
                      ? 'Not Added'
                      : moment(data?.accountVerifiedDate).format('MMMM, YYYY')}
                  </Text>
                </View>
                <View style={{width: '50%'}}>
                  <IconInfo
                    disabled={true}
                    icon="expert"
                    label={'Careusel Clients'}
                    labelstyle={{
                      fontSize: moderateScale(15),
                      fontFamily: fonts.SemiBold,
                    }}
                  />
                  <Text style={styles.detailText}>
                    {data.clientCount === undefined ||
                    data.clientCount === null ||
                    data.clientCount === ''
                      ? 'Not Added'
                      : (data?.clientCount).toString()}
                  </Text>
                </View>
              </View>
            </>
          )}

        {data?.accountVerifiedDate !== undefined && cardtype === 'profile' && (
          <>
            <View style={[styles.seperator, styles.bottomView]}>
              <View style={{width: '50%'}}>
                <IconInfo
                  disabled={true}
                  icon="profile"
                  label={'Member Since'}
                  labelstyle={{
                    fontSize: moderateScale(15),
                    fontFamily: fonts.SemiBold,
                  }}
                />
                <Text style={styles.detailText}>
                  {data.accountVerifiedDate === undefined ||
                  data.accountVerifiedDate === null ||
                  data.accountVerifiedDate === ''
                    ? 'Not Added'
                    : moment(data?.accountVerifiedDate).format('MMMM, YYYY')}
                </Text>
              </View>
              <View style={{width: '50%'}}>
                <IconInfo
                  disabled={true}
                  icon="birthday"
                  label={'Birthday'}
                  labelstyle={{
                    fontSize: moderateScale(15),
                    fontFamily: fonts.SemiBold,
                  }}
                />
                <Text style={styles.detailText}>
                  {data.dob === undefined ||
                  data.dob === null ||
                  data.dob === ''
                    ? 'Not Added'
                    : moment(data?.dob).format('MM/DD/YYYY')}
                </Text>
              </View>
            </View>
          </>
        )}
        {data?.expertCount !== undefined && cardtype === 'profile' && (
          <View style={[styles.seperator, styles.bottomView]}>
            <View style={{width: '50%'}}>
              <IconInfo
                disabled={true}
                icon="teamicon"
                label={'Expert Team'}
                labelstyle={{
                  fontSize: moderateScale(15),
                  fontFamily: fonts.SemiBold,
                }}
              />
              <Text style={styles.detailText}>
                {data.expertCount === undefined ||
                data.expertCount === null ||
                data.expertCount === ''
                  ? 'Not Added'
                  : data?.expertCount}
              </Text>
            </View>
            <View style={{width: '50%'}}>
              {/* <IconInfo
                disabled={true}
                icon="rotation"
                label={'Rotation #'}
                labelstyle={{  fontSize: moderateScale(15), fontFamily: fonts.SemiBold}}
              />
              <Text style={styles.detailText}>{data?.Rotation}</Text> */}
            </View>
          </View>
        )}
        {/* <View style={{flexDirection: 'row', width: '30%'}}>
          {data?.instagram && cardtype !== 'About' && (
            <View style={[styles.seperator, styles.instagramtxt]}>
              <TouchableOpacity onPress={() => handleClick(data?.instagram)}>
                <IconInfo
                  disabled={true}
                  iconsize={40}
                  height={40}
                  icon="orignalinstagram"
                  // label={'Instagram'}
                  // labelstyle={{  fontSize: moderateScale(15), fontFamily: fonts.SemiBold}}
                />
              </TouchableOpacity>
              <Text style={styles.linktxt}>{data?.instagram}</Text>
            </View>
          )}
          {data?.Facebook && cardtype !== 'About' && (
            <View style={[styles.seperator, styles.instagramtxt]}>
              <TouchableOpacity onPress={() => handleClick(data?.Facebook)}>
                <IconInfo
                  disabled={true}
                  icon="orignalfacebook"
                  iconsize={30}
                  height={30}
                  labelstyle={{  fontSize: moderateScale(15), fontFamily: fonts.SemiBold}}
                />
              </TouchableOpacity>
              <Text style={styles.linktxt}>{data?.Facebook}</Text>
            </View>
          )}
        </View> */}

        {cardtype === 'About' && (
          <View style={[styles.seperator, styles.instagramtxt]}>
            <Text isSemiBold style={styles.abouttitle}>
              {profiletype}
            </Text>
            <Text style={styles.aboutText}>
              {data?.aboutMe === undefined ||
              data?.aboutMe === null ||
              data?.aboutMe === ''
                ? 'Not Added'
                : data?.aboutMe}
            </Text>
          </View>
        )}
        {showpactice && cardtype === 'About' && (
          <View style={[styles.seperator, styles.instagramtxt]}>
            <Text isSemiBold style={styles.abouttitle}>
              {'Practice Name'}
            </Text>
            <Text style={styles.aboutText}>
              {data?.practiceName === undefined ||
              data?.practiceName === null ||
              data?.aboutMe === ''
                ? 'Not Added'
                : data?.practiceName}
            </Text>
          </View>
        )}
        {data?.focusList && cardtype === 'About' && (
          <View style={[styles.seperator, styles.instagramtxt]}>
            <Text isSemiBold style={styles.abouttitle}>
              {aboutText}
            </Text>

            <FlatList
              data={data?.focusList}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
                alignItems: 'center',
              }}
              ListEmptyComponent={() => {
                return (
                  <View>
                    <Text style={styles.aboutText}>Not Added</Text>
                  </View>
                );
              }}
              renderItem={({item}) => {
                return (
                  <View style={styles.selectview}>
                    <Text isSemiBold style={styles.aboutselect}>
                      {item}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userDetailsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardShadow: {
    borderColor: 'rgba(61, 57, 137, 0.1)',
    borderWidth: 1,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2.5},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: colors.white,
    marginVertical: 7,
  },
  seperator: {
    borderColor: 'rgba(61, 57, 137, 0.1)',
    paddingVertical: 5,
  },
  bottomView: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  detailTitle: {
    color: colors.charcoal,
    fontWeight: '400',
    fontSize: moderateScale(12),
    lineHeight: 16,
  },
  detailText: {
    color: colors.charcoal,
    fontWeight: '400',
    fontSize: moderateScale(15),
    lineHeight: 16,
    paddingTop: 4,
    letterSpacing: 0.03,
    paddingLeft: 25,
    textAlign: 'left',
  },
  instagramtxt: {
    width: '100%',
    borderColor: 'rgba(61, 57, 137, 0.1)',
    marginBottom: 3,
  },
  linktxt: {
    color: colors.secoundry,
    fontWeight: '400',
    fontSize: moderateScale(16),
    lineHeight: 16,
    paddingTop: 4,
    letterSpacing: 0.03,
    paddingLeft: 25,
  },
  abouttitle: {
    color: colors.charcoal,
    fontWeight: '400',
    fontSize: 20,
    paddingTop: 4,
    letterSpacing: 0.03,
  },
  aboutText: {
    color: colors.charcoal,
    fontWeight: '500',
    fontSize: moderateScale(16),
    marginVertical: 10,
  },
  aboutselect: {
    color: colors.secoundry,
    fontWeight: '500',
    fontSize: moderateScale(15),
    paddingBottom: 3,
  },
  selectview: {
    borderWidth: 2,
    borderColor: colors.secoundry,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InfoCard;
