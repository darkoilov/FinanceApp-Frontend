import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { devUrl } from '../../utils/devUrl';
import CategoryModal from './CategoryModal';

const AddEditBudget = ({ modalVisible, setModalVisible, editMode, budget, setAllBudgets, allBudgets }) => {
  const [budgetData, setBudgetData] = useState({
    name: '',
    originalAmount: null,
    currency: 'USD',
    budgetFor: [],
    budgetInterval: 'none',
    startDate: new Date(),
  });
  const _devUrl = devUrl();


  useEffect(() => {
    if (editMode && budget) {
        console.log("edit", budget)
        const parsedStartDate = new Date(budget.startDate);

        const formattedBudgetFor = (budget.budgetFor || []).map(category => 
          category.subcategories.map(sub => `${category.name} - ${sub.name}`)
          ).flat();

      setBudgetData({
        ...budget,
        originalAmount: budget.originalAmount ? budget.originalAmount.toString() : '',
        startDate: parsedStartDate,
        budgetFor: formattedBudgetFor,
      });
    } else {
      setBudgetData({
        name: '',
        originalAmount: null,
        currency: 'USD',
        budgetFor: [],
        budgetInterval: 'none',
        startDate: new Date(),
      });
    }
  }, [editMode, budget]);

  const handleInputChange = (name, value) => {
    setBudgetData(prevBudget => ({
      ...prevBudget,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || budgetData.startDate;
    setBudgetData(prevBudget => ({
      ...prevBudget,
      startDate: currentDate
    }));
  };

  const addOrUpdateBudget = async () => {
    let formattedBudgetFor;
    if (typeof budgetData.budgetFor[0] === 'string') {
        formattedBudgetFor = budgetData.budgetFor.reduce((acc, cat) => {
            const [category, subcategory] = cat.split(" - ");
            let existingCategory = acc.find(c => c.name === category);
            if (!existingCategory) {
                existingCategory = { name: category, subcategories: [] };
                acc.push(existingCategory);
            }
            existingCategory.subcategories.push({ name: subcategory });
            return acc;
        }, []);
    } else {
        formattedBudgetFor = budgetData.budgetFor;
    }

   const newBudget = { 
        ...budgetData, 
        originalAmount: parseFloat(budgetData.originalAmount), 
        startDate: budgetData.startDate.toISOString(),
        budgetFor: formattedBudgetFor 
    };
        console.log(newBudget)
    try {
      if (budgetData._id) {
        const response = await axios.put(`${_devUrl}/api/budget/${newBudget._id}`, newBudget);
        setAllBudgets(allBudgets.map(t => t._id === newBudget._id ? response.data : t));
      } else {
        const response = await axios.post(`${_devUrl}/api/budget`, newBudget);
        setAllBudgets([...allBudgets, response.data]);
      }
      setModalVisible(false);
      setBudgetData({
        name: '',
        originalAmount: null,
        currency: 'USD',
        budgetFor: [],
        budgetInterval: 'none',
        startDate: new Date(),
      }); 
    } catch (error) {
      console.error('Error updating or adding budget:', error.toString());
    }
  };

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const handleSelectCategory = (selectedCategories) => {
    if (!selectedCategories) return;

    const formattedCategories = selectedCategories.reduce((acc, cat) => {
        const [category, subcategory] = cat.split(" - ");
        let existingCategory = acc.find(c => c.name === category);
        if (!existingCategory) {
            existingCategory = { name: category, subcategories: [{ name: subcategory }] };
            acc.push(existingCategory);
        } else {
            existingCategory.subcategories.push({ name: subcategory });
        }
        return acc;
    }, []);

    setBudgetData(prev => ({ ...prev, budgetFor: formattedCategories }));
    setCategoryModalVisible(false);
};


const countCategoriesAndSubcategories = () => {
  const { budgetFor } = budgetData;
  if (budgetFor.length === 0) return { totalCategories: 0, totalSubcategories: 0 };

  if (typeof budgetFor[0] === 'string') {
      const categoryCounts = budgetFor.reduce((acc, item) => {
          const [category, subcategory] = item.split(" - ");
          if (!acc[category]) {
              acc[category] = new Set([subcategory]);
          } else {
              acc[category].add(subcategory);
          }
          return acc;
      }, {});

      const totalCategories = Object.keys(categoryCounts).length;
      const totalSubcategories = Object.values(categoryCounts).reduce((acc, subcats) => acc + subcats.size, 0);
      return { totalCategories, totalSubcategories };
  } else {
      // When budgetFor is already an array of objects
      const totalCategories = budgetFor.length;
      const totalSubcategories = budgetFor.reduce((acc, cat) => acc + cat.subcategories.length, 0);
      return { totalCategories, totalSubcategories };
  }
};

const { totalCategories, totalSubcategories } = countCategoriesAndSubcategories();

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
    //   onRequestClose={() => { setModalVisible(!modalVisible);}}
      >
      <ScrollView style={styles.modalView}>
        <Text style={styles.title}>{editMode ? 'Edit Budget' : 'Add New Budget'}</Text>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter budget name"
            value={budgetData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Enter limit here"
              value={budgetData.originalAmount}
              onChangeText={(value) => handleInputChange('originalAmount', value)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <View style={[styles.currencySelect]}>
              <RNPickerSelect
                onValueChange={(value) => setBudgetData(prevBudget => ({ ...prevBudget, currency: value }))}
                items={[
                  { label: 'USD', value: 'USD' },
                  { label: 'EUR', value: 'EUR' },
                ]}
                style={pickerSelectStyles}
                value={budgetData.currency}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Budget interval</Text>
          <RNPickerSelect
            onValueChange={(value) => setBudgetData(prevBudget => ({ ...prevBudget, budgetInterval: value }))}
            items={[
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Monthly', value: 'Monthly' },
              { label: 'Annually', value: 'Annually' },
            ]}
            placeholder={{ label: 'None', value: 'none' }}
            style={pickerSelectStyles}
            value={budgetData.budgetInterval}
            useNativeAndroidPickerStyle={false}
          />
          { budgetData.budgetInterval !== 'none' &&
          <>
          <Text style={styles.label}>From</Text>
            {budgetData.startDate && (
  <DateTimePicker
    value={budgetData.startDate}
    mode="date"
    display="default"
    onChange={handleDateChange}
    style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: -10, color: 'rgb(33, 150, 243)' }}
  />
)}
          </>
          } 
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Budget for</Text>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: -10, padding: 10 }}
            onPress={() => {
              setCategoryModalVisible(true);
            }}
          >
            <Text style={{ color: 'rgb(33, 150, 243)' }}>
              {totalCategories > 0 || totalSubcategories > 0 ? `Categories: ${totalCategories}, Subcategories: ${totalSubcategories}`
              : 'Select Category'}
              </Text>
            </TouchableOpacity>
          <CategoryModal
            visible={categoryModalVisible}
            handleSelectCategory={handleSelectCategory}
            currentTransaction={budgetData}
            setCategoryModalVisible={setCategoryModalVisible}
          />
        </View>
        <Button title="Submit Budget" onPress={addOrUpdateBudget} />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </ScrollView>
    </Modal>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    fontSize: 16,
    borderWidth: 0,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'rgb(33, 150, 243)',
    paddingRight: 30,
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    backgroundColor: 'rgb(57 57 57)',
    fontSize: 16,
    borderRadius: 8,
    height: 50,
    flex: 7,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencySelect: {
    flex: 3,
  },
  label: {
    color: 'white',
  },
  wrapper: {
    backgroundColor: 'rgb(57 57 57)',
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
  },
});

export default AddEditBudget;
