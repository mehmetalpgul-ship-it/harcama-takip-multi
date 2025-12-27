import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function ReportScreen({ navigation }: any) {
  const [totals, setTotals] = useState<{ [k: string]: number }>({});

  useEffect(() => {
    const fetch = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const now = new Date();
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      const q = query(
        collection(db, 'users', uid, 'transactions')
        // note: simple approach - in production store date as Timestamp and compare with where()
      );
      const snap = await getDocs(q);
      const acc: { [k: string]: number } = { TRY: 0, USD: 0, EUR: 0 };
      snap.forEach((d) => {
        const data: any = d.data();
        const dt = data.date?.toDate ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
        if (dt >= start && dt <= end) {
          const c = data.currency || 'TRY';
          const amt = Number(data.amount) || 0;
          if (data.type === 'expense') acc[c] -= amt;
          else acc[c] += amt;
        }
      });
      setTotals(acc);
    };
    fetch();
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Aylık Rapor" />
      </Appbar.Header>
      <View style={styles.container}>
        <FlatList
          data={Object.entries(totals)}
          keyExtractor={([k]) => k}
          renderItem={({ item }) => (
            <Card style={{ margin:8 }}>
              <Card.Content>
                <Title>{item[0]}</Title>
                <Paragraph>Toplam bakiye: {item[1].toFixed(2)} {item[0]}</Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:8 }
});
