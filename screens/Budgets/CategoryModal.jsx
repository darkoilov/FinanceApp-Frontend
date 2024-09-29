import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const categories = [
    {
        name: 'Expense', icon: 'wallet-outline', subcategories: [
            { name: 'Utilities', icon: 'flash-outline', subcategories: ['Water', 'TV', 'Phones', 'Internet', 'Heating', 'Gas', 'Garbage', 'Electricity'] },
            { name: 'Travel', icon: 'airplane-outline', subcategories: ['Hotel', 'Flight', 'Car Rent'] },
            { name: 'Transport', icon: 'car-outline', subcategories: ['Underground', 'Train', 'Taxi', 'Bus'] },
            { name: 'Sports', icon: 'basketball-outline', subcategories: ['Gym', 'Swimming Pool', 'Equipment'] },
            { name: 'Personal', icon: 'person-outline', subcategories: ['Personal Hygiene', 'Hairdressing', 'Cosmetics'] },
            { name: 'Housing', icon: 'home-outline', subcategories: ['Rent', 'Mortgage', 'Utilities'] },
            { name: 'Health', icon: 'heart-outline', subcategories: ['Hospital', 'Dental', 'Medications', 'Insurance'] },
            { name: 'Gifts', icon: 'gift-outline', subcategories: ['Birthdays', 'Anniversary', 'Holidays', 'Special Occasions'] },
            { name: 'Food', icon: 'restaurant-outline', subcategories: ['Groceries', 'Lunch', 'Dinner', 'Breakfast', 'Restaurants', 'Fast food'] },
            { name: 'Finance', icon: 'wallet-outline', subcategories: ['Insurance', 'Investments', 'Tax'] },
            { name: 'Entertainment', icon: 'game-controller-outline', subcategories: ['Movies', 'Party', 'Concerts', 'Streaming'] },
            { name: 'Education', icon: 'school-outline', subcategories: ['Tuition', 'Books', 'Courses'] },
            { name: 'Drinks', icon: 'wine-outline', subcategories: ['Coffee', 'Tea', 'Soft Drinks', 'Alcohol'] },
            { name: 'Clothing', icon: 'shirt-outline', subcategories: ['Clothes', 'Shoes', 'Accessories'] },
            { name: 'Car', icon: 'car-outline', subcategories: ['Fuel', 'Maintenance', 'Insurance', 'Parking'] },
        ]
    }
];

const CategoryModal = ({ visible, handleSelectCategory, currentTransaction,setCategoryModalVisible  }) => {
    const [selectedCategories, setSelectedCategories] = useState({});

    useEffect(() => {
        const initialCategories = {};
        if(currentTransaction && currentTransaction.budgetFor){
            currentTransaction.budgetFor.forEach(item => {
                initialCategories[item] = true;  // Ensure item is in the format "Category - Subcategory"
            });
            setSelectedCategories(initialCategories);
        }
    }, [currentTransaction, visible]);

    const toggleSelection = (category, subcategory) => {
        const categoryKey = `${category.name} - ${subcategory}`;
        setSelectedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    const toggleAllSubcategories = (category) => {
        let newSelections = { ...selectedCategories };
        const allSelected = category.subcategories.every(sub => selectedCategories[`${category.name} - ${sub}`]);
        category.subcategories.forEach(sub => {
            newSelections[`${category.name} - ${sub}`] = !allSelected;
        });
        setSelectedCategories(newSelections);
    };

    const submitSelection = () => {
        const selected = Object.entries(selectedCategories)
            .filter(([key, value]) => value)
            .map(([key]) => key);
        handleSelectCategory(selected);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={() => {
                setCategoryModalVisible(false);
            }}

            style={{ zIndex: 1000 }} 
        >
            <View style={styles.modalContent}>
                <View style={styles.header}>
                <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Categories</Text>
                    <TouchableOpacity onPress={submitSelection}>
                        <Text style={styles.submitButton}>Submit</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.wrapper}>
                    {categories[0].subcategories.map(category => (
                        <View key={category.name}>
                            <TouchableOpacity onPress={() => toggleAllSubcategories(category)}>
                                <Text style={styles.categoryHeader}>{category.name}</Text>
                            </TouchableOpacity>
                            {category.subcategories.map(sub => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[styles.subCategoryItem, selectedCategories[`${category.name} - ${sub}`] ? styles.selected : {}]}
                                    onPress={() => toggleSelection(category, sub)}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'white' }}>
                                            {sub}
                                        </Text>
                                       {selectedCategories[`${category.name} - ${sub}`] &&
                                       <AntDesign name="check" size={24} color="white" />
                                    }
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

// Styles
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
        color: '#fff',
        fontSize: 20,
    },
    cancelButton: {
        color: '#f00',
    },
    submitButton: {
        color: '#0f0',
    },
    grid: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    categoryHeader: {
        color: '#fff',
        fontSize: 18,
        paddingVertical: 10,
    },
    subCategoryItem: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 10
    },
    selected: {
        backgroundColor: '#666', 
    },
    wrapper: {
        backgroundColor: 'rgb(57 57 57)',
        marginVertical: 10,
        borderRadius: "15px",
        padding: 10
    }
});

export default CategoryModal;
