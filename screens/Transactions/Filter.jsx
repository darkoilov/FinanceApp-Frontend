import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput,Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure this is installed and the path is correct

const FilterScreen = ({transactions, isOpenModal, setIsOpenModal}) => {
    const [filter, setFilter] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isStartDatePicker, setIsStartDatePicker] = useState(true);  // To determine which date to update

    // Function to handle date change
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);  // Hide picker after selection
        setDate(currentDate);

        // Update the appropriate date based on whether the user is setting start or end date
        if (isStartDatePicker) {
            setDateRange(prev => ({ ...prev, start: currentDate }));
        } else {
            setDateRange(prev => ({ ...prev, end: currentDate }));
        }
    };

    const showStartDatepicker = () => {
        setShow(true);
        setIsStartDatePicker(true);
    };

    // Show date picker for end date
    const showEndDatepicker = () => {
        setShow(true);
        setIsStartDatePicker(false);
    };



    const applyFilters = () => {
        setIsOpenModal(false)
        // const filtered = transactions.filter(transaction => {
        //     const dateCondition = (dateRange.start ? new Date(transaction.date) >= new Date(dateRange.start) : true) &&
        //         (dateRange.end ? new Date(transaction.date) <= new Date(dateRange.end) : true);
        //     const amountCondition = (amountRange.min ? transaction.amount >= amountRange.min : true) &&
        //         (amountRange.max ? transaction.amount <= amountRange.max : true);
        //     const categoryTypeCondition = transaction.category.toLowerCase().includes(filter.toLowerCase()) ||
        //         transaction.type.toLowerCase().includes(filter.toLowerCase());
        //     return dateCondition && amountCondition && categoryTypeCondition;
        // });
        // setFilteredTransactions(filtered); // Ажурирајте ја листата на прикажани трансакции
    };

    return (
        <View style={styles.container}>
            <Modal visible={isOpenModal} animationType="slide">
                <View style={styles.modalContent}>
                    <Button title="Select Start Date" onPress={showStartDatepicker} />
                    <Button title="Select End Date" onPress={showEndDatepicker} />
                    {show && (
                        <DateTimePicker
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {/* <TextInput
                        style={styles.filterInput}
                        // onChangeText={text => setAmountRange(prev => ({ ...prev, min: text }))}
                        // value={amountRange.min}
                        placeholder="Минимален износ..."
                    />
                    <TextInput
                        style={styles.filterInput}
                        // onChangeText={text => setAmountRange(prev => ({ ...prev, max: text }))}
                        // value={amountRange.max}
                        placeholder="Максимален износ..."
                    /> */}
                    <Button title="Примени Филтри" onPress={applyFilters} />
                    <TextInput
                        style={styles.filterInput}
                        onChangeText={setFilter}
                        value={filter}
                        placeholder="Филтрирај по категорија или тип..."
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    filterInput: {
        margin: 15,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
    },
    modalContent: {
        padding: 20,
        marginTop: 50,
    },
});

export default FilterScreen;
