import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions/Transactions';
import Budget from './screens/Budgets/Budget';
import Activity from './screens/Activity';
import SavingsGoals from './screens/SavingsGoals';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Budgets" component={Budget} /> 
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="SavingsGoals" component={SavingsGoals} /> 
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
