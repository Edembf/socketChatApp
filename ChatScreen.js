// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';
import io from 'socket.io-client';

// have to change: Configuration spécifique pour passer à travers le proxy IBM
const socket = io('https://damusbaruch-3000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai', {
  transports: ['polling', 'websocket'], // 'polling' en premier
  path: '/socket.io/',
  forceNew: true,
  secure: true,
  rejectUnauthorized: false
});


export default function ChatScreen({ route }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { username } = route.params;

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: username
      };
      socket.emit('chatMessage', messageData);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === username;
    // have to change: Génération de l'URL de l'avatar basée sur le nom de l'expéditeur
    const avatarUrl = `https://ui-avatars.com{item.sender}&background=random&color=fff`;

    return (
      // have to change: Wrapper horizontal pour aligner l'avatar à côté du message
      <View style={[styles.messageWrapper, isCurrentUser ? styles.sentWrapper : styles.receivedWrapper]}>
        
        {/* have to change: Affichage de l'avatar pour les messages reçus */}
        {!isCurrentUser && (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}

        <View style={[styles.messageContainer, isCurrentUser ? styles.sentMessage : styles.receivedMessage]}>
          {/* have to change: Header avec Nom et Heure */}
          <View style={styles.messageHeader}>
            <Text style={styles.usernameText}>{item.sender}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>

        {/* have to change: Affichage de l'avatar pour l'utilisateur actuel */}
        {isCurrentUser && (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  // have to change: Nouveau style pour le wrapper de ligne
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  // have to change: Style de l'avatar rond
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginHorizontal: 8,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '70%',
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2,
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
    borderBottomLeftRadius: 2,
  },
  // have to change: Style pour le nom et l'heure au-dessus du texte
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
    marginRight: 10,
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
});
