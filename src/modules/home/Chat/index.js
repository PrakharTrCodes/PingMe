import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  Platform,
  StatusBar,
  Animated,
  ImageBackground,
} from 'react-native';
import {styles} from './style';
import SearchHeader from './searchHeader';
import {string} from '../../../utils/strings';
import RenderChatCard from './renderChatCard';
import Loader from '../../../components/loader';
import {setUser} from '../../../redux/auth/action';
import {useDispatch, useSelector} from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import firestore from '@react-native-firebase/firestore';
import HomeHeader from '../../../components/commonHomeHeader';
import React, {useCallback, useEffect, useState} from 'react';
import {logOut, showToast} from '../../../utils/commonFunctions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {StackActions, useNavigation} from '@react-navigation/native';
import {backPress, searchPress} from './chatUtils/chatUtils';
import {vh} from '../../../utils/dimensions';

const ChatList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showTip, setTip] = useState(false);
  const [search, setSearch] = useState(true);
  const [loader, setLoader] = useState(false);
  const [staticData, setStaticData] = useState([]);
  const transform = useState(new Animated.Value(0))[0];
  const {loggedInUser} = useSelector(store => store.userDataReducer);

  let scale = {
    transform: [
      {
        scale: transform.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
    position: 'absolute',
    top: getStatusBarHeight(),
    zIndex: 10,
  };

  useEffect(() => {
    const abc = firestore()
      .collection(string.users)
      .doc(loggedInUser.uid)
      .collection(string.inbox)
      .onSnapshot(doc => {
        const dataArray = doc?._docs.map(element => element._data);
        setStaticData(dataArray);
      });
    return abc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTooltipPress = useCallback(() => {
    setTip(!showTip);
    navigation.navigate(string.profile, {});
  }, [navigation, showTip]);

  const handleLogOut = () => {
    setTip(!showTip);
    setLoader(true);
    logOut(
      loggedInUser?.uid,
      () => {
        setTimeout(() => {
          setLoader(false);
          dispatch(setUser({}));
          navigation.dispatch(StackActions.replace(string.loginStack));
        }, 1000);
      },
      error => {
        setLoader(false);
        showToast(error.message);
      },
    );
  };

  const listEmptyComponent = () => (
    <ImageBackground
      source={require('../../../assets/images/empty.png')}
      style={{height: vh(560), width: '100%'}}
    />
  );

  /**
   *
   * @param {*} item
   * @returns id
   */

  const _keyExtractor = item => {
    return item?.id;
  };

  const _itemSeperator = () => {
    return <View style={styles.itemSeperatorView} />;
  };

  /**
   * renders the chat list.
   */
  const onRender = useCallback(
    ({item}) => {
      const {displayImage, fName, lName, id, isActive, lastMessage} = item;
      return (
        <RenderChatCard
          id={id}
          fName={fName}
          lName={lName}
          isActive={isActive}
          lastMessage={lastMessage}
          displayImage={displayImage}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [staticData],
  );

  const handleSearchPress = () => {
    searchPress(transform);
  };

  const handleBackPress = () => {
    backPress(transform);
  };

  const toolTip = useCallback(() => {
    setTip(!showTip);
  }, [showTip]);
  return (
    <SafeAreaView style={styles.homeMainView}>
      <HomeHeader
        search={search}
        setSearch={setSearch}
        toolTip={toolTip}
        addFriend={() => {
          navigation.navigate(string.addFriend);
        }}
        onsearchPress={handleSearchPress}
      />
      <SearchHeader
        search={search}
        setSearch={setSearch}
        animatedStyle={scale}
        onBackPress={handleBackPress}
      />
      <Tooltip
        topAdjustment={
          Platform.OS === string.android ? -StatusBar.currentHeight : 0
        }
        backgroundColor="transparent"
        placement="right"
        contentStyle={styles.toolTipContainer}
        isVisible={showTip}
        content={
          <View style={styles.tooTipContentMainView}>
            <Text style={styles.toolTipTextStyle} onPress={handleTooltipPress}>
              {string.profile}
            </Text>
            <View style={styles.contentLineSeperator} />
            <Text onPress={handleLogOut} style={styles.toolTipTextStyle}>
              {string.logout}
            </Text>
          </View>
        }
        onClose={() => setTip(!showTip)}
      />
      <FlatList
        data={staticData}
        renderItem={onRender}
        keyExtractor={_keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmptyComponent}
        ItemSeparatorComponent={_itemSeperator}
      />

      <Loader loader={loader} />
    </SafeAreaView>
  );
};

export default React.memo(ChatList);
