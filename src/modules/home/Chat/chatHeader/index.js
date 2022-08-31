import {Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import localImages from '../../../../utils/localImages';
import {styles} from './style';
import {vh, vw} from '../../../../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import IconButton from '../../../../components/iconButtons';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

export default function ChatHeader({fName, id, displayImage}) {
  const {loggedInUser} = useSelector(store => store.userDataReducer);
  const [isActive, setisActive] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const activeUserListener = firestore()
      .collection('Users')
      .doc(id)
      .onSnapshot(documentSnapshot => {
        setisActive(documentSnapshot?.data()?.isActive);
      });
    return activeUserListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#56CF83', '#50BD87', '#47AD8B']}
      style={styles.headerView}>
      <View style={styles.nameMainView}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={localImages.left}
            style={{height: vh(22), width: vh(22), marginLeft: vw(14)}}
          />
        </TouchableOpacity>
        <FastImage source={{uri: displayImage}} style={styles.userProfile} />
        <View style={styles.activeNameView}>
          <Text style={styles.nameText}>{fName}</Text>
          {isActive ? (
            <Text style={styles.activeText}>{'Active Now'}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.iconImageView}>
        <IconButton
          onPress={() => {}}
          image={localImages.audioIcon}
          imageStyle={styles.headerIconImage}
        />
        <IconButton
          onPress={() => {}}
          image={localImages.videoIcon}
          imageStyle={styles.headerVideoIconImage}
        />
        <IconButton
          onPress={() => {
            // firestore()
            //   .collection('Users')
            //   .doc(loggedInUser?.uid)
            //   .collection('BlockedUsers')
            //   .doc(id)
            //   .set({fName, id, displayImage});
          }}
          image={localImages.homeMenuIcon}
          imageStyle={styles.headerIconImage}
        />
      </View>
    </LinearGradient>
  );
}
