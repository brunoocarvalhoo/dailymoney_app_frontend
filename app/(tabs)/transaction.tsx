import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import api from '@/constants/api';

export default function TransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true); // Estado para mostrar o carregamento
  const [categories, setCategories] = useState([]); // Lista de categorias



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); // Ajuste a URL conforme sua API
        setCategories(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  const handleSubmit = async () => {
    if (!description || !amount || !category) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      await api.post('/transactions', {
        description,
        amount: parseFloat(amount),
        category
      });
      Alert.alert('Sucesso', 'Transação cadastrada com sucesso!');
      setDescription('');
      setAmount('');
      setCategory('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a transação');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ backgroundColor:'green',flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={styles.text}>Descrição</Text>
                <TextInput value={description} onChangeText={setDescription} style={styles.input} />
      
            <Text style={styles.text}>Valor (R$)</Text>
                <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
                
            <Text style={styles.text}>Categoria</Text>
                <TextInput value={category} onChangeText={setCategory} style={styles.input} />
                
            <Button color='white' title="Salvar" onPress={handleSubmit}></Button>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor:'white'
  },
  text: {
    color: 'white'
  }
};
