import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { devUrl } from '../../utils/devUrl';
import AddEditBudget from './AddEditBudget';
import { useFocusEffect } from '@react-navigation/native';
import BudgetItem from './BudgetItem';

const Budget = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [allBudgets, setAllBudgets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const _devUrl = devUrl();

  const getBudget = async () => {
    const response = await axios.get(`${_devUrl}/api/budget`);
    console.log(response.data)
    setAllBudgets(response.data.budget || []);
  };

  useFocusEffect(
    React.useCallback(() => {
        getBudget(); 
    }, [])
);

  const deleteBudget = async (id) => {
    const response = await axios.delete(`${_devUrl}/api/budget/${id}`);
    try {
      if (response.status === 200) {
        setAllBudgets(allBudgets.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  const openModal = (budget = null) => {
    setSelectedBudget(budget);
    setEditMode(budget ? true : false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.budgetListContainer}>
        <TextInput
          label="Search"
          // Implement search functionality if needed
        />
        {allBudgets?.map((budget, index) => (
           <BudgetItem
           key={index}
           budget={budget}
           openModal={openModal}
           deleteBudget={deleteBudget}
         />
        ))}
      </View>
      <Button title="Create New Budget" onPress={() => openModal()} />
      {modalVisible && (
        <AddEditBudget
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          editMode={editMode}
          budget={selectedBudget}
          setAllBudgets={setAllBudgets}
          allBudgets={allBudgets}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    backgroundColor: '#000',
  },
  budgetListContainer: {
    padding: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Budget;


// Подобрување на UI/UX: Стиловите во модалниот прозорец и основниот приказ може да бидат подобрени за да обезбедат подобра корисничка искуство, како подобро порамнување на елементите и користење на поинтуитивни икони за акции.
// Оптимизација за различни платформи: Со оглед на тоа дека користите компоненти кои се специфични за iOS и Android (како DateTimePicker и RNPickerSelect), проверете дали UI е конзистентен на различни уреди и оперативни системи.
// Валидација на податоците: Додадете проверка на податоците пред да ги испратите на серверот. На пример, проверете дали сумата е позитивна бројка и дали сите потребни полиња се пополнети.
// Подобрување на перформансите при читање и запишување: Размислете за воведување на кеширање или други методи за намалување на натовареноста на серверот, особено ако се очекува голем број трансакции или чести ажурирања на податоци.
// Работа со грешки: Сега имате основна обработка на грешки, но можеби ќе сакате да размислите за попрецизни пораки за грешки кои ќе им помогнат на корисниците да разберат што треба да поправат ако имаат проблеми при внесувањето на податоци.
// Мултивалутна поддршка: Видливо е дека имате опција за избор на валута, но проверете дали сите делови од системот (како извоз на податоци и калкулации) правилно ја обработуваат валутата, особено ако дозволувате пресметки и сравнувања меѓу различни валути.
















