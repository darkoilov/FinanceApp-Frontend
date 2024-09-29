import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';

//треба
// Анализа на трошоците и трендовите во потрошувачката.
// Статистички податоци за месечни, квартални и годишни трошоци.
// Приказ на историјата на финансиските цели.

const Activity = () => {
    const [filter, setFilter] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'Income', category: 'Salary', amount: 5000 },
        { id: 2, type: 'Expense', category: 'Food', amount: -300 },
        { id: 3, type: 'Expense', category: 'Transport', amount: -150 },
        { id: 4, type: 'Income', category: 'Freelance', amount: 1200 },
        { id: 5, type: 'Expense', category: 'Utilities', amount: -250 }
    ]);

    useEffect(() => {
        applyFilter();
    }, [filter, transactions]);

    const applyFilter = () => {
        if (transactions && transactions.length > 0) {
            const filtered = transactions.filter(transaction => {
                return transaction.category.toLowerCase().includes(filter.toLowerCase()) || transaction.type.toLowerCase().includes(filter.toLowerCase());
            });
            setFilteredTransactions(filtered);
        }
    };

    const generateReport = () => {
        if (filteredTransactions.length === 0) {
            Alert.alert('No Transactions', 'There are no transactions to generate a report.');
            return;
        }

        // Calculate total income and expenses
        const totalIncome = filteredTransactions
            .filter(transaction => transaction.type === 'Income')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = filteredTransactions
            .filter(transaction => transaction.type === 'Expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Generate report message
        const reportMessage = `Total Income: $${totalIncome}\nTotal Expenses: $${Math.abs(totalExpenses)}\nNet Balance: $${totalIncome + totalExpenses}`;

        // Display report
        Alert.alert('Financial Report', reportMessage);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Financial Activity</Text>
            <TextInput
                style={styles.filterInput}
                onChangeText={setFilter}
                value={filter}
                placeholder="Search by category or transaction type"
            />
            <FlatList
                data={filteredTransactions}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <Text>{item.type}: {item.category} - ${item.amount}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.buttonContainer}>
                <Button title="Generate Report" onPress={generateReport} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    filterInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default Activity;
