import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import client from '../../contentful';  

const CategoriesPage = () => {
    const navigation = useNavigation(); 
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await client.getEntries({
                    content_type: 'product',  
                    select: 'fields.category',  
                });

                console.log('Fetched Categories Response:', response);

                if (response.items && Array.isArray(response.items)) {
                    
                    const fetchedCategories = response.items
                        .map(item => item.fields?.category)  
                        .filter(category => category)  
                        .filter((value, index, self) => self.indexOf(value) === index);  

                    setCategories(fetchedCategories);
                } else {
                    console.error('No items found in response');
                }
            } catch (error) {
                console.error('Error fetching categories:', error.message);
                console.error('Error details:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryPress = (category) => {
        navigation.navigate('ProductsPage', { category });  
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product Categories</Text>
            <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()} 
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                        <View style={styles.categoryCard}>
                            <Text style={styles.categoryText}>{item}</Text>  
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    categoryCard: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CategoriesPage;
