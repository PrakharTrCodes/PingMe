import React, {useState, useCallback, useLayoutEffect} from 'react';
import {View} from 'react-native';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {styles} from '../style';
import {string} from '../../../../utils/strings';
import {addMessagges} from '../../../../utils/commonFunctions';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ChatHeader from '../chatHeader';
import RenderBubble from './chatBubble';
import RenderSend from './chatSend';
export function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const {loggedInUser} = useSelector(store => store.userDataReducer);
  const {id, fName, isActive, displayImage} = useRoute().params;
  const docId =
    loggedInUser?.uid > id
      ? loggedInUser?.uid + '-' + id
      : id + '-' + loggedInUser?.uid;

  useLayoutEffect(() => {
    const subscribe = firestore()
      .collection(string.homeChatRoom)
      .doc(docId)
      .collection(string.messages)
      .onSnapshot(doc => {
        const dataArray = doc?._docs.map(element => element._data);
        dataArray.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(dataArray);
      });
    return subscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSend = useCallback((message = []) => {
    const msg = message[0];
    const myMsg = {
      ...msg,
      sentBy: loggedInUser?.uid,
      sentTo: id,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    addMessagges(docId, myMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderInputToolbar = props => {
    return (
      <InputToolbar containerStyle={styles.chatInputViewStyle} {...props} />
    );
  };

  return (
    <View style={styles.giftedChatMainView}>
      <ChatHeader
        fName={fName}
        isActive={isActive}
        displayImage={displayImage}
      />
      <GiftedChat
        messagesContainerStyle={[
          styles.messageContainerView,
          {paddingTop: getStatusBarHeight()},
        ]}
        showAvatarForEveryMessage={true}
        renderSend={RenderSend}
        enderBubble={RenderBubble}
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: loggedInUser?.uid,
          avatar: 'https://placeimg.com/140/140/any',
        }}
        isTyping={true}
        isKeyboardInternallyHandled={true}
        renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
}