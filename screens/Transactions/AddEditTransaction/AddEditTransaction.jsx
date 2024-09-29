import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { devUrl } from '../../../utils/devUrl';
import CategorySelectorModal from './CategorySelectorModal';
import moment from 'moment';
import AddTransactionModal from './AddTransactionModal';

const AddEditTransaction = ({transactions, setTransactions, setModalVisible, modalVisible, setLoading, setCurrentTransaction, currentTransaction}) => {
    const _devUrl = devUrl();
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const addOrUpdateTransaction = async (transaction) => {
    // na submit  "category": {"name": undefined, "subcategory": ""}
        console.log("tranDATA", transaction)

        setLoading(true);
        try {
            const transactionData = {
                ...transaction,
                date: new Date(transaction.date).toISOString(),
            };


            const apiUrl = `${_devUrl}/api/transactions${transaction._id ? `/${transaction._id}` : ''}`;
            console.log(apiUrl)
        const method = transaction._id ? 'put' : 'post';

        const response = await axios[method](apiUrl, transactionData);
        console.log('Transaction operation response:', response.data);

        if (transaction._id) {
            setTransactions(transactions.map(t => t._id === transaction._id ? response.data : t));
        } else {
            setTransactions(prev => [...prev, response.data]);
        }
        
        } catch (error) {
            console.error('Error updating or adding transaction:', error);
        }
        setLoading(false);
        setModalVisible(false);
    };


    const handleSelectCategory = (category, isSubcategory = false) => {
        if (category === null) {
            setCategoryModalVisible(false);
            setModalVisible(true);
            return;
        }
    
        if (!isSubcategory) {
            if (category?.subcategories && category?.subcategories.length > 0) {
                setSelectedCategory(category);
            } else {
                setCurrentTransaction(prev => ({
                    ...prev,
                    category: category?.name,
                    subcategory: '',
                    icon: category?.icon,  
                }));
                setSelectedCategory(null);
                setCategoryModalVisible(false);
            }
        } else {
            setCurrentTransaction(prev => ({
                ...prev,
                category: selectedCategory?.name,
                subcategory: category,
                icon: selectedCategory?.icon 
            }));
            setSelectedCategory(null);
            setCategoryModalVisible(false);
        }
        setModalVisible(true);
    };
    
    

    return (
        <View style={styles.container}>
            <AddTransactionModal 
                addOrUpdateTransaction={addOrUpdateTransaction}
                currentTransaction={currentTransaction}
                setCurrentTransaction={setCurrentTransaction}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible} 
                setCategoryModalVisible={setCategoryModalVisible}
            />
            <CategorySelectorModal
                visible={categoryModalVisible}
                handleSelectCategory={handleSelectCategory}
                currentTransaction={currentTransaction}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20  
    },
    filterInput: {
        margin: 15,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'gray', 
        borderRadius: 10,     
    },
    transactionText: {
        flex: 1,
        color: 'white'
    },
    editButton: {
        marginRight: 10,
        color: 'blue',
    },
    deleteButton: {
        color: 'red',
    },
    modalContent: {
        padding: 20,
        marginTop: 50,
    },
    input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default AddEditTransaction;






// 1.Оптимизација на перформансите при скролирање: Ако листата на трансакции стане многу долга, можеби ќе сакате да користите FlatList
// со оптимизиран рендеринг, како што е getItemLayout или initialNumToRender, за да се подобрат перформансите при скролирање.
// Кеш меморија за податоци: За подобрување на брзината и ефикасноста, може да размислите за имплементација на некаква кеш меморија на
//клиентот, што би ја намалило потребата постојано да се вчитуваат исти трансакции од серверот.
// Подобрена обработка на грешки: Во моментот, вашите обиди за повик до API се завршуваат со логирање на грешката во конзола.
// Можеби ќе сакате да додадете кориснички интерфејс за прикажување на грешки до корисниците, на пример преку алерт или банер во
//апликацијата.
// Детална валидација на внесени податоци: За секоја нова трансакција или измена, добро е да имплементирате детална валидација на
//внесените податоци за да се осигурате дека сите потребни полиња се правилно пополнети и дека износите се во валиден формат.
// Заштита на конфиденцијални податоци: Ако апликацијата обработува конфиденцијални финансиски информации, осигурете се дека сите
//комуникации со серверот се сигурни (на пример, користејќи HTTPS) и размислете за дополнителни мерки за сигурност, како што е
//шифрирање на податоците.
// Поддршка за интернационализација (i18n): Ако планирате да ја понудите апликацијата на корисници од различни земји, имплементирајте поддршка за повеќе јазици и регионални формати за датуми, време и валути.