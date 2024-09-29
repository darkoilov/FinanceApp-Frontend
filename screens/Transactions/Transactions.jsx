import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { devUrl } from '../../utils/devUrl';
import * as FileSystem from 'expo-file-system'; 
import FilterScreen from './Filter';
import AddEditTransaction from './AddEditTransaction/AddEditTransaction';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native';

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState({
        type: 'Income',
        category: '',
        amount: 0,
        date: new Date(),   
    });
    const [loading, setLoading] = useState(false);
    const _devUrl = devUrl();
    const pageSize = 20; // Број на трансакции што се вчитуваат одеднаш
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(false);

    const showFilters = () => {
        setShow(true);
    };


    const getTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${_devUrl}/api/transactions?page=${page + 1}&size=${pageSize}`); 
            if (response.data && response.data.transactions) {
                setTransactions(prevTransactions => {
                    const existingIds = new Set(prevTransactions.map(t => t._id)); 
                    const newTransactions = response.data.transactions.filter(nt => !existingIds.has(nt._id)); // Filter out duplicates
                    console.log(newTransactions)
                    return newTransactions.length > 0 ? [...prevTransactions, ...newTransactions] : prevTransactions;
                });
                if (response.data.transactions.length > 0) {
                    setPage(prev => prev + 1);
                }
            } else {
                console.error('Data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        setLoading(false);
    };


    useEffect(() => {
        getTransactions();
    }, []);

    const handleLoadMore = () => {
        if (!loading) {
            getTransactions();
        }
    };
    
    const deleteTransaction = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${_devUrl}/api/transactions/${id}`);
            if (response.status === 200) {
                const updatedTransactions = transactions.filter(t => t._id !== id);
                setTransactions(updatedTransactions);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
        setLoading(false);
    };

    const exportTransactions = async () => {
        const fileUri = FileSystem.documentDirectory + 'transactions.csv';
        const csvContent = "Type,Category,Amount\n" + transactions.map(t => `${t.type},${t.category},${t.amount}`).join("\n");
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        console.log('Export successful:', fileUri);
    };


    const groupTransactionsByDate = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { income: 0, expense: 0, transactions: [] };
            }
            if (transaction.type === 'Income') {
                acc[date].income += transaction.amount;
            } else if (transaction.type === 'Expense') {
                acc[date].expense += transaction.amount;
            }
            acc[date].transactions.push(transaction);
            return acc;
        }, {});
        return grouped;
    };

    const groupedTransactions = groupTransactionsByDate(transactions);

    const flattenedData = Object.keys(groupedTransactions).reduce((acc, date) => {
        const { income, expense, transactions } = groupedTransactions[date];
        const netBalance = income - expense;
        acc.push({ key: date, isHeader: true, netBalance });
        transactions.forEach(transaction => {
            acc.push({ key: transaction._id, isHeader: false, transaction });
        });
        return acc;
    }, []);

    
      const renderRightActions = (transaction) => (
        <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity onPress={() =>{ setCurrentTransaction(transaction); setModalVisible(true)}} style={{ width: 80, backgroundColor: 'blue', height: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ color: '#fff', fontWeight: 'bold'}}>Edit</Text>
        </TouchableOpacity>    
        <TouchableOpacity onPress={() => deleteTransaction(transaction?._id)}  style={{ width: 80, backgroundColor: 'red', height: '100%' ,display: 'flex', justifyContent: 'center' }}>
       <Text style={{ color: '#fff', paddingLeft: 15, fontWeight: 'bold' }}>Delete</Text>
   </TouchableOpacity>     
         </View>
      );

      
      const renderGroupedTransactions = ({ item }) => {
        if (item.isHeader) {
          return (
            <View style={styles.groupContainer}>
              <Text style={styles.dateText}>{item.key}</Text>
              <Text style={styles.dateText}>{item.netBalance > 0 ? `+${item.netBalance}` : item.netBalance}</Text>
            </View>
          );
        } else {
          const { transaction } = item;
          return (
            <View style={{  
                borderWidth: 1,
                borderColor: 'gray', 
                borderRadius: 10,  
                overflow: 'hidden',
                marginTop: 5,
                marginBottom: 5,
                marginRight: 0 ,
                }}>
                     <Swipeable renderRightActions={() => renderRightActions(transaction)}>
      <View style={styles.container}>
        <View style={styles.transactionItem}>
                <Ionicons name={transaction?.icon} size={30} color="#fff" />
                <View style={{ display: 'flex' }}>
                  <Text style={styles.transactionCategory}>{transaction?.category}</Text>
                  <Text style={styles.transactionSubCategory}>{transaction?.subcategory}</Text>
                </View>
                <Text style={{ color: 'white' }}>{transaction.amount}</Text>
              </View>
      </View>
    </Swipeable>
            </View>
          );
        }
      };

    // const renderGroupedTransactions = ({ item }) => {
    //     if (item.isHeader) {
    //         return (
    //             <View style={styles.groupContainer}>
    //                 <Text style={styles.dateText}>{item.key}</Text>
    //                 <Text style={styles.dateText}>{item.netBalance > 0 ? `+${item.netBalance}` : item.netBalance}</Text>
    //             </View>
    //         );
    //     } else {
    //         const { transaction } = item;
    //         return (
    //             <View style={styles.transactionItem}>
    //                 <Ionicons name={transaction?.icon} size={30} color="#fff" />
    //                 <View style={{ display: 'flex' }}>
    //                     <Text style={styles.transactionCategory}>{transaction.category}</Text>
    //                     <Text style={styles.transactionSubCategory}>{transaction.subcategory}</Text>
    //                 </View>
    //                 <Text style={{ color: 'white' }}>{transaction.amount}</Text>
    //                 <TouchableOpacity onPress={() => { setCurrentTransaction(transaction); setModalVisible(true); }}>
    //                     <Text style={styles.editButton}>Уреди</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => deleteTransaction(transaction._id)}>
    //                     <Text style={styles.deleteButton}>Избриши</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         );
    //     }
    // };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            <Button title="Filter" onPress={showFilters} />
            <FilterScreen transactions={transactions} isOpenModal={show} setIsOpenModal={setShow} />
            <TextInput
                style={styles.filterInput}
                onChangeText={setFilter}
                value={filter}
                placeholder="Филтрирај по категорија или тип..."
            />
            {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
            
            <FlatList
                data={flattenedData}
                renderItem={renderGroupedTransactions}
                keyExtractor={(item, index) => item._id ? item?._id?.toString() : index?.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}  // This hides the vertical scroll bar
            />
            <Button title="Додади Трансакција" onPress={() => { setCurrentTransaction({ type: 'Income', category: '', amount: 0, date: new Date() }); setModalVisible(true); }} />
            <Button title="Извоз на Трансакции" onPress={exportTransactions} />

            <AddEditTransaction 
            transactions={transactions} 
            setTransactions={setTransactions} 
            setModalVisible={setModalVisible} 
            modalVisible={modalVisible} 
            setLoading={setLoading} 
            setCurrentTransaction={setCurrentTransaction} 
            currentTransaction={currentTransaction}
            />
        </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        paddingBottom: 0  
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
        // marginTop: 5,
        // marginBottom: 5,
        // borderWidth: 1,
        // borderColor: 'gray', 
        // borderRadius: 10,     
    },
    groupContainer: {
        marginTop: 20,
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    dateText: {
        fontWeight: 'bold',
        color: 'white',
    },
    transactionCategory: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold'
    },
    transactionSubCategory: {
        flex: 1,
        color: 'gray',
        fontWeight: '500'
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
    },
      actionText: {
        color: 'white',
      },
      swipeable: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: '100%', // Ensure width is defined here
      },
});

export default TransactionScreen;






   