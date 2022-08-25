import {FlatList, SafeAreaView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HomeHeader from '../../../components/commonHomeHeader';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './style';
import RenderChatCard from './renderChatCard';
import {getUsers, logOut, showToast} from '../../../utils/commonFunctions';
import {StackActions, useNavigation} from '@react-navigation/native';
import {string} from '../../../utils/strings';
import Loader from '../../../components/loader';
import {setUser} from '../../../redux/auth/action';

const ChatList = () => {
  const {loggedInUser} = useSelector(store => store.userDataReducer);
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUsers(
      loggedInUser.uid,
      allUsers => {
        setStaticData(allUsers);
      },
      err => {
        console.log(err);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogOut = () => {
    setLoader(true);
    logOut(
      () => {
        setLoader(false);
        dispatch(setUser({}));
        navigation.dispatch(StackActions.replace(string.loginStack));
      },
      error => {
        setLoader(false);
        showToast(error.message);
      },
    );
  };

  /**
   *
   * @param {*} item
   * @returns id
   */

  const _keyExtractor = ({id}) => {
    return id;
  };

  const [staticData, setStaticData] = useState([]);

  /**
   * renders the chat list.
   */
  const onRender = useCallback(
    ({item}) => {
      const {displayImage, fName, lName, id} = item;

      return (
        <RenderChatCard
          id={id}
          fName={fName}
          lName={lName}
          displayImage={displayImage}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [staticData],
  );
  return (
    <SafeAreaView style={styles.homeMainView}>
      <HomeHeader handleLogOut={handleLogOut} />
      <FlatList
        keyExtractor={_keyExtractor}
        data={staticData}
        renderItem={onRender}
      />
      <Loader loader={loader} />
    </SafeAreaView>
  );
};

export default React.memo(ChatList);
