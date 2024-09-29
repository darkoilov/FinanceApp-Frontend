import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const Dashboard = () => {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(1000); // Претпоставен буџет
    const [savingsGoal, setSavingsGoal] = useState(5000); // Претпоставена цел за штедење
    const [currentSavings, setCurrentSavings] = useState(1500); // Тековни заштеди
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const savingsBarWidth = React.useRef(new Animated.Value(0)).current;
    const budgetBarWidth = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const demoTransactions = [
            { value: 500, label: 'Приход', color: '#00E396' },
            { value: -150, label: 'Храна', color: '#FF4560' },
            { value: -50, label: 'Транспорт', color: '#FEB019' },
        ];

        setTransactions(demoTransactions);
        const total = demoTransactions.reduce((acc, curr) => acc + curr.value, 0);
        setCurrentBalance(total);

        Animated.timing(savingsBarWidth, {
            toValue: (currentSavings / savingsGoal) * 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        Animated.timing(budgetBarWidth, {
            toValue: ((budget - total) / budget) * 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [currentSavings, savingsGoal, budget]);

    const pieData = transactions.map(transaction => ({
        name: transaction.label,
        amount: Math.abs(transaction.value),
        color: transaction.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
    }));

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.balanceTitle}>Тековна состојба</Text>
            <Text style={styles.balanceValue}>${currentBalance.toFixed(2)}</Text>

            <PieChart
                data={pieData}
                width={Dimensions.get('window').width}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16
                    }
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />

            <View style={styles.legend}>
                {transactions.map((transaction, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: transaction.color }]} />
                        <Text>{transaction.label}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Буџет</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: budgetBarWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                }) }]} />
            </View>
            <Text>Потрошено {((budget - currentBalance) / budget * 100).toFixed(2)}% од месечниот буџет</Text>

            <Text style={styles.sectionTitle}>Цели за Штедење</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: savingsBarWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                }) }]} />
            </View>
            <Text>Тековни заштеди: ${currentSavings} од целта од ${savingsGoal}</Text>

            {selectedTransaction && (
                <Modal animationType="slide" transparent={true} visible={!!selectedTransaction}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{selectedTransaction.label}: ${selectedTransaction.value}</Text>
                        <Button title="Затвори" onPress={() => setSelectedTransaction(null)} />
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    balanceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    balanceValue: {
        fontSize: 20,
        marginVertical: 10,
    },
    chart: {
        height: 200,
        width: 200,
        marginBottom: 20,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    colorIndicator: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    progressBarContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'green',
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    modalView: {
        marginTop: 100,
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default Dashboard;
