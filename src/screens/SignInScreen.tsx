import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title>Harcama Takip</Title>
      <Paragraph>Email ve şifre ile giriş / kayıt</Paragraph>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput label="Şifre" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={login} style={styles.button}>Giriş</Button>
      <Button mode="outlined" onPress={register} style={styles.button}>Kayıt Ol</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, justifyContent:'center' },
  input: { marginBottom:12 },
  button: { marginTop:8 }
});
