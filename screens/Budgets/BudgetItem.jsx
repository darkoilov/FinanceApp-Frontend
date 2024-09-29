import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid, Platform, Button } from 'react-native';
import * as Progress from 'react-native-progress';
import { format, addMonths, differenceInDays } from 'date-fns';

const BudgetItem = ({ budget, openModal, deleteBudget }) => {
    console.log(budget)

    const startDate = new Date(budget.startDate);
    const startDateFormatted = format(startDate, 'MMM dd, yyyy');
  
    let daysLeft = 0;
    let nextIntervalDate = startDateFormatted;
  
    if (budget.budgetInterval === 'Monthly') {
      const nextInterval = addMonths(startDate, 1);
      nextIntervalDate = format(nextInterval, 'MMM dd, yyyy');
      daysLeft = differenceInDays(nextInterval, new Date());
    }

    // {"budget": [{"__v": 0, 
    //     "_id": "66b1421232ffecd9ab417fe8", 
    //     "amount": 1200, 
    //     "budgetFor": [Array], 
    //     "budgetInterval": "Monthly", 
    //     "currency": "USD", 
    //     "name": "Utilities and hotel", 
    //     "originalAmount": 5000, 
    //     "startDate": "2024-08-05T21:20:06.304Z"}], 
    //     "currentPage": 1, "pages": 1, "total": 1}

      
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.budgetDetails}>
        <View style={{display: 'flex', flexDirection: 'row', width: '55%'}}>
        <Text style={styles.emoji}>😍</Text>
        <Text style={styles.budgetName}>{budget?.name}</Text>
        </View>
          <View style={{width: '100%',display: 'flex', alignItems: 'flex-end', width: '45%'}}>
          <Text style={styles.budgetAmount}>{budget?.originalAmount - budget?.spentAmount}</Text>
          <Text style={styles.budgetAmount}>{`${budget?.spentAmount} MKD / ${budget?.originalAmount} MKD`}</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <Progress.Bar progressTintColor="#5ECD71" progress={(budget.spentAmount / budget.originalAmount) * 100 / 100} />
      </View>
      <View style={styles.bottomRow}>
        {/* ako ima interval daysLeft */}
        <Text style={styles.daysLeft}>{daysLeft > 0 ? 
        `Next interval: ${nextIntervalDate} (${daysLeft} days left)` : 
          `Saved ${budget?.originalAmount - budget?.spentAmount}`
        }</Text>
        <Text style={styles.percentage}>{`${(budget.spentAmount / budget.originalAmount) * 100}%`}</Text>
      </View>
      <View style={styles.buttonGroup}>
               <Button title="Edit" onPress={() => openModal(budget)} />
               <Button title="Delete" onPress={() => deleteBudget(budget._id)} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%"
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%"
  },
  emoji: {
    fontSize: 30,
  },
  budgetDetails: {
    display: 'flex',
    flexDirection: 'row',
    width: "100%"
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#fff',
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  daysLeft: {
    color: '#fff',
  },
  percentage: {
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BudgetItem;
