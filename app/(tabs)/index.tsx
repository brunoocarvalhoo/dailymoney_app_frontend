import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '@/constants/api';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api.get('http://192.168.100.110:3000/api/transactions')
        .then(response => {
          setTransactions(response.data);
          setFilteredTransactions(response.data);
        })
        .catch(error => console.error('Erro ao buscar transações', error));
      
      api.get('http://192.168.100.110:3000/api/categories')
        .then(response => setCategories(response.data))
        .catch(error => console.error('Erro ao buscar categorias', error));
    }, [])
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const removeFilters = () => {
    setSelectedCategory('');
    setStartDate(new Date);
    setEndDate(new Date);
    setFilteredTransactions(transactions);
  }

  const applyFilters = () => {
    let filtered = transactions;

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category.name === selectedCategory);
    }
    
    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    setFilteredTransactions(filtered);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Transações</Text>
      <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.filterButtonText}>Filtrar</Text>
      </TouchableOpacity>

      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Descrição</Text>
        <Text style={styles.headerText}>Valor</Text>
        <Text style={styles.headerText}>Data</Text>
        <Text style={styles.headerText}>Categoria</Text>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>R$ {item.amount}</Text>
            <Text style={styles.cell}>{formatDate(new Date(item.date))}</Text>
            <Text style={styles.cell}>{item.category.name}</Text>
          </View>
        )}
      />

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar Transações</Text>
            
            <Text>Categoria:</Text>
            <View style={styles.selectBox}>
              {categories.map(cat => (
                <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.name)}>
                  <Text style={selectedCategory === cat.name ? styles.selectedItem : styles.item}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text>Data Inicial:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.input}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}
            
            <Text>Data Final:</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.input}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}
            
            <Button title="Aplicar Filtros" onPress={applyFilters} />
            <Button title="Remove Filtros" onPress={removeFilters} />
            <Button title="Fechar" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  filterButton: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectBox: {
    marginBottom: 10,
  },
  selectedItem: {
    fontWeight: 'bold',
    color: 'blue',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 10,
  },
});
