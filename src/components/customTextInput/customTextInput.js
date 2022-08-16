import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {vw, vh, normalize} from '../../utils/dimensions';
import {color} from '../../utils/colors';

export default function CustomTextInput(props) {
  const {width = 375} = props;
  return (
    <View
      style={[
        styles.container,
        props.hasOwnProperty('width') ? {width: vw(width)} : {},
        props.style,
      ]}>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        maxLength={props.maxLength}
        keyboardType={props?.keyboardType}
        placeholder={props.placeholder}
        style={[styles.textInput, {width: vw(width)}]}
        secureTextEntry={props.secureTextEntry}
        autoCorrect={false}
        onBlur={props.onBlur}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7fc',
    borderRadius: vh(5),
    width: '80%',
    marginLeft: normalize(8),
    height: normalize(36),
  },
  textInput: {
    color: 'black',
    marginHorizontal: vw(10),
    paddingHorizontal: vh(5),
    fontSize: vw(14),
  },
});