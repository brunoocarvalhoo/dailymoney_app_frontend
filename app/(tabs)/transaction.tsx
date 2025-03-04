import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '@/constants/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formatDate = (date) => new Intl.DateTimeFormat('pt-BR').format(date);

  const handleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  

  const handleSubmit = async () => {
    if (!description || !amount || !category) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const transactionData = {
      description,
      amount: parseFloat(amount),
      category_id: parseInt(category),
      date: date.toISOString().split('T')[0],
    };

    console.log("Enviando para API:", transactionData)
  
    try {
      await api.post('/api/transactions', {
        description,
        amount: parseFloat(amount),
        category_id: parseInt(category),
        date
      });
  
      Alert.alert('Sucesso', 'Transação cadastrada com sucesso!');
  
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date());
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar a transação');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Nova Transação</Text>

        <Text style={styles.text}>Descrição</Text>
        <TextInput value={description} onChangeText={setDescription} style={styles.input} />

        <Text style={styles.text}>Valor (R$)</Text>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />

      <Text style={styles.text}>Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Selecione a data"
        value={formatDate(date)}
        onPressIn={() => setShow(true)}
        />
  
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleChange}
          />
        )}

        <Text style={styles.text}>Categoria</Text>
        <View>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(String(itemValue))}
            style={{ color: 'black' }}>
            <Picker.Item label="Selecione uma categoria" value="" enabled={false} />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={String(cat.id)} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  picker: {
    color: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#3b5998', 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: '#3b5998',
    paddingVertical: 12, 
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10, 
  },
  buttonText: {
    color: 'white',
    fontSize: 16, 
    fontWeight: 'bold'
  }
};