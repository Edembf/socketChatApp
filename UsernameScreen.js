// UsernameScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function UsernameScreen({ navigation }) {
  const [username, setUsername] = useState('');

  const handleContinue = () => {
    // have to change: Ajout d'une validation stricte (ne continue que si non vide)
    if (username.trim().length > 0) {
      navigation.navigate('ChatScreen', { username: username.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chat</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Type your username"
        value={username}
        onChangeText={setUsername}
      />

      <Pressable 
        // have to change: Style visuel pour montrer que le bouton est désactivé si vide
        style={[styles.button, { opacity: username.trim().length > 0 ? 1 : 0.5 }]} 
        onPress={handleContinue}
        // have to change: Désactivation native du bouton
        disabled={username.trim().length === 0}
      >
        <Text style={{color:"white"}}>Continue to Chat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  // have to change: Ajout du style pour le titre qui manquait
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: '80%' // have to change: Ajout d'une largeur pour l'input
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width:'60%'
  }
});
