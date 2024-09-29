import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Modal, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const categories = [
    {
        id: 1, name: 'Income', icon: 'cash-outline', subcategories: [
            { name: 'Salary', icon: 'wallet-outline' },
            { name: 'Bonus', icon: 'gift-outline' },
            { name: 'Freelance', icon: 'briefcase-outline' },
            { name: 'Investments', icon: 'trending-up-outline' }
        ]
    },
    {
        id: 2, name: 'Expense', icon: 'wallet-outline', subcategories: [
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

const CategorySelectorModal = ({ currentTransaction, visible, handleSelectCategory, selectedCategory, setSelectedCategory }) => {

console.log("selectedCategory",currentTransaction)

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={() => {
                setSelectedCategory(null); // Reset to main category selection
                handleSelectCategory(null); // Close modal without selection
            }}
            style={{ zIndex: 1000 }}
        >
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    {selectedCategory ? (
                        <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleSelectCategory(null)}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>Select Category</Text>
                </View>

                <ScrollView contentContainerStyle={styles.grid}>
                    {!selectedCategory ? (
                        categories[currentTransaction?.type === 'Income' ? 0 : 1]?.subcategories?.map(category => (
                            <TouchableOpacity
                                key={category?.name}
                                style={[styles.categoryItem, currentTransaction.category === category?.name && styles.selected]}
                                onPress={() => handleSelectCategory(category)}
                            >
                                <Ionicons name={category?.icon} size={20} color="#fff" />
                                <Text style={{ color: 'white' }}>{category?.name}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View>
                            <Text style={styles.headerText}>Select Subcategory in {selectedCategory?.name}</Text>
                            {selectedCategory?.subcategories?.map(sub => (
                                <TouchableOpacity
                                    key={sub}
                                    style={styles.subCategoryItem}
                                    onPress={() => handleSelectCategory(sub, true)}
                                >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: 'white' }}>
                                            {sub}
                                        </Text>
                                       {currentTransaction.subcategory === sub &&
                                       <AntDesign name="check" size={24} color="white" />
                                    }
                                    </View>
                                    {/* <Text style={{ color: 'white' }}>{sub}</Text> */}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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
    backButtonText: {
        color: '#0f0',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    categoryItem: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 73,
        width: 73,
        backgroundColor: '#333',
        borderRadius: 10
    },
    categoryText: {
        color: '#fff',
        marginTop: 5
    },
    subCategoryItem: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 10
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        padding: 10
    },
    selected: {
        backgroundColor: '#666', // Change color when selected
    },
});

export default CategorySelectorModal;
