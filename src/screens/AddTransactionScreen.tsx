import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Currency } from '../types';
import { Timestamp } from 'firebase/firestore';

export default function AddTransactionScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [currency, setCurrency] = useState<Currency>('TRY');

  const save = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert('Kullanıcı bulunamadı');
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      alert('Geçerli bir tutar girin');
      return;
    }
    try {
      await addDoc(collection(db, 'users', uid, 'transactions'), {
        amount: parsed,
        type,
        category: category || 'Diğer',
        note: note || '',
        currency,
        date: Timestamp.fromDate(new Date()),
        createdAt: serverTimestamp()
      });
      navigation.goBack();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label="Tutar" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
      <RadioButton.Group onValueChange={(v) => setType(v as any)} value={type}>
        <View style={styles.row}>
          <RadioButton value="income" />
          <Text>Gelir</Text>
          <RadioButton value="expense" style={{ marginLeft: 16 }} />
          <Text>Gider</Text>
        </View>
      </RadioButton.Group>
      <TextInput label="Kategori" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput label="Not" value={note} onChangeText={setNote} style={styles.input} />
      <Text style={{ marginTop: 8 }}>Para Birimi</Text>
      <RadioButton.Group onValueChange={(v) => setCurrency(v as Currency)} value={currency}>
        <View style={styles.row}>
          <RadioButton value="TRY" /><Text>TRY</Text>
          <RadioButton value="USD" style={{ marginLeft: 12 }} /><Text>USD</Text>
          <RadioButton value="EUR" style={{ marginLeft: 12 }} /><Text>EUR</Text>
        </View>
      </RadioButton.Group>
      <Button mode="contained" onPress={save} style={{ marginTop: 16 }}>Kaydet</Button>
      <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>İptal</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  input: { marginBottom:12 },
  row: { flexDirection:'row', alignItems:'center', marginTop:8 }
});
