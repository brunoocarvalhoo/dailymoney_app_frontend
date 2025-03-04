import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import api from '@/constants/api';
import { useFocusEffect } from '@react-navigation/native';

interface Transaction {
  id: number;
  description: string;
  amount: string;
  date: string;
  category: {
    id: number;
    name: string;
  };
}

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refresh, setRefresh] = useState(false);
//   const addTransaction = (newTransaction) => {
//   setTransactions(prev => [...prev, newTransaction]);
//   setRefresh(!refresh); // Muda o estado para forçar a atualização
// };

useFocusEffect(
  useCallback(() => {
    api.get('http://192.168.100.110:3000/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error('Erro ao buscar transações', error));
  }, [])
);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Transações</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Descrição</Text>
        <Text style={styles.headerText}>Valor</Text>
        <Text style={styles.headerText}>Data</Text>
        <Text style={styles.headerText}>Categoria</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>R$ {item.amount}</Text>
            <Text style={styles.cell}>{formatDate(item.date)}</Text>
            <Text style={styles.cell}>{item.category.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#3b5998',
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 3,
  },
  cell: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
  },
});
