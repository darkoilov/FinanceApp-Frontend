import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const [newGoalAmount, setNewGoalAmount] = useState('');

    const addGoal = () => {
        if (newGoal.trim() !== '' && newGoalAmount.trim() !== '') {
            const goalObject = { name: newGoal, amount: parseFloat(newGoalAmount) };
            setGoals([...goals, goalObject]);
            setNewGoal('');
            setNewGoalAmount('');
        }
    };

    const removeGoal = (index) => {
        const updatedGoals = [...goals];
        updatedGoals.splice(index, 1);
        setGoals(updatedGoals);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Financial Goals</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new goal"
                value={newGoal}
                onChangeText={setNewGoal}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={newGoalAmount}
                onChangeText={setNewGoalAmount}
                keyboardType="numeric"
            />
            <Button title="Add" onPress={addGoal} />
            <View style={styles.goalsContainer}>
                {goals.map((goal, index) => (
                    <View key={index} style={styles.goalItem}>
                        <Text style={styles.goalText}>{goal.name} - ${goal.amount}</Text>
                        <Button title="Delete" onPress={() => removeGoal(index)} />
                    </View>
                ))}
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
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    goalsContainer: {
        marginTop: 20,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    goalText: {
        fontSize: 16,
    },
});

export default SavingsGoals;
