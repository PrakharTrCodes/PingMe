import styles from './styles';
import {Animated} from 'react-native';
import {useSelector} from 'react-redux';
import {color} from '../../utils/colors';
import {vh} from '../../utils/dimensions';
import {string} from '../../utils/strings';
import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = () => {
  const navigation = useNavigation();
  const animRef = useRef(new Animated.Value(0)).current;
  const {loggedInUser} = useSelector(store => store.userDataReducer);
  useEffect(() => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (Object.keys(loggedInUser).length === 0) {
        navigation.navigate(string.loginStack);
      } else {
        navigation.navigate(string.homeStack);
      }
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const colorArray = [color.darkGreen, color.lightGreen];
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={colorArray}
      style={styles.splashMain}>
      <Animated.Text style={{fontSize: vh(70), opacity: animRef}}>
        {string.pingMe}
      </Animated.Text>
    </LinearGradient>
  );
};

export default React.memo(SplashScreen);
