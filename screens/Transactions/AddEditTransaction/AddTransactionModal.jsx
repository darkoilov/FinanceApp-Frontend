import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTransactionModal = ({ addOrUpdateTransaction, currentTransaction, setCurrentTransaction, modalVisible, setModalVisible, setCategoryModalVisible }) => {

    useEffect(()=>{
        console.log(currentTransaction)
    },[currentTransaction])
    
    const handleAmountChange = text => {
        setCurrentTransaction(prev => ({
            ...prev,
            amount: parseFloat(text || 0)
        }));
    };

    const getAmountInputStyle = () => ({
        ...styles.input,
        borderColor: currentTransaction.type === 'Income' ? '#0f0' : '#f00',
    });

    return (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Transaction</Text>
                    <Text style={styles.saveButton} onPress={() => addOrUpdateTransaction(currentTransaction)}>Save</Text>
                </View>
                
                <TextInput
                    style={getAmountInputStyle()}
                    keyboardType="numeric"
                    onChangeText={handleAmountChange}
                    value={currentTransaction?.amount?.toString()}
                    placeholder="Enter amount"
                    placeholderTextColor="#ccc"
                    autoFocus={true}
                />

                <Button title="Select Category" onPress={() => {
                    setCategoryModalVisible(true);
                    setModalVisible(false);
                }} />
                <Text  style={{color: 'white'}}>Category: {currentTransaction.category ? currentTransaction.category : 'No Category'}</Text>
                <Text style={{color: 'white'}}>Subcategory: {currentTransaction.subcategory ? currentTransaction.subcategory : 'No Subcategory'}</Text>
                
                <DateTimePicker
                    value={new Date(currentTransaction.date)}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setCurrentTransaction(prev => ({ ...prev, date: selectedDate || prev.date }));
                    }}
                />

                <Picker
                    selectedValue={currentTransaction.type}
                    onValueChange={(itemValue, itemIndex) => setCurrentTransaction(prev => ({ ...prev, type: itemValue }))}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Income" value="Income" />
                    <Picker.Item label="Expense" value="Expense" />
                </Picker>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: '#0f0',
        fontSize: 20,
    },
    cancelButton: {
        color: '#f00',
    },
    saveButton: {
        color: '#0f0',
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        borderRadius: 10,
        padding: 10,
        borderWidth: 2,
    },
    selectedCategory: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 20,
    },
    picker: {
        color: '#0f0',
        backgroundColor: '#222',
    },
    pickerItem: {
        color: '#fff',  // Ensures the picker items are clearly visible
    }
});

export default AddTransactionModal;
