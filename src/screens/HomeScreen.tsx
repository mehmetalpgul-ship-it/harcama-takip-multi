import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, Card, Paragraph, Title, Button } from 'react-native-paper';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Transaction } from '../types';

export default function HomeScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'transactions'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs: Transaction[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...(d.data() as any) }));
      setTransactions(docs);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Harcama Takip" />
        <Appbar.Action icon="chart-box" onPress={() => navigation.navigate('Report')} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <View style={styles.container}>
        {transactions.length === 0 ? (
          <View style={{padding:16}}>
            <Title>Henüz işlem yok</Title>
            <Paragraph>Yeni gelir veya gider eklemek için + butonuna basın.</Paragraph>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={({ item }) => (
              <Card style={{ margin: 8 }}>
                <Card.Title title={`${item.type === 'income' ? '+' : '-'} ${item.amount} ${item.currency}`} subtitle={`${item.category}`} />
                {item.note ? <Card.Content><Paragraph>{item.note}</Paragraph></Card.Content> : null}
              </Card>
            )}
          />
        )}
        <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('AddTransaction')} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16 }
});
