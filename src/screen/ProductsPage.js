import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import client from '../../contentful';

const ProductsPage = ({ route }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await client.getEntries({
                    content_type: "product",
                    'fields.category': category
                });

                const fetchedProducts = response.items.map((item) => ({
                    id: item.sys.id,
                    name: item.fields.productName,
                    price: item.fields.productPrice,
                    image: `https:${item.fields.productImage.fields.file.url}`,
                }));

                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, [category]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{category} Products</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <Text style={styles.productText}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </View>
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
    productCard: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
        borderRadius: 8,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    productText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#888',
    },
});

export default ProductsPage;
