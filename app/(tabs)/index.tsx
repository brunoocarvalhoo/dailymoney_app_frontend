import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '@/constants/api';
import { StyleSheet } from 'react-native';

interface Transaction {
  id: number;
  description: string;
  amount: string;
  category: {
    id: number;
    name: string;
  };
}


export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('http://192.168.100.110:3000/api/transactions')
      .then(response => {
        console.log(response.data);
        setTransactions(response.data);

      })
      .catch(error => console.error('Erro ao buscar transações', error));
  }, []);

  return (
    
    <View style={styles.container}>
      <Text style={{color: 'white'}}>Minhas Transações</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <Text style={{color: 'white'}}>{item.description} - R$ {item.amount}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Aqui você define a cor de fundo da tela
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  transactionText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
});
