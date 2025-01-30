import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsPage = ({ route, navigation }) => {
  const { cartItems } = route.params || {}; 
  const [address, setAddress] = useState('');
  const [residential, setResidential] = useState('');
  const [community, setCommunity] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]); 

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const addresses = await AsyncStorage.getItem('savedAddresses');
        if (addresses) {
          setSavedAddresses(JSON.parse(addresses));
        }
      } catch (error) {
        console.error('Error fetching saved addresses:', error);
      }
    };

    fetchSavedAddresses();
  }, []);

  const handleSaveAddress = async () => {
    if (!address || !residential || !community) {
      Alert.alert('Error', 'Please fill in all the address fields.');
      return;
    }

    const newAddress = { address, residential, community };
    const updatedAddresses = [...savedAddresses, newAddress];

    try {
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
      Alert.alert('Success', 'Address saved for future use!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save address.');
    }
  };

  const handleSubmitOrder = async () => {
    if (!address || !residential || !community) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const orderDetails = {
      address,
      residential,
      community,
      cartItems,
    };

    try {
      await AsyncStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      Alert.alert('Success', 'Order placed successfully!');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Error', 'Failed to save order details.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>

     
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.subHeader}>Shipping Details</Text>

   
      {savedAddresses.length > 0 && (
        <View style={styles.savedAddresses}>
          <Text style={styles.savedHeader}>Saved Addresses</Text>
          {savedAddresses.map((savedAddress, index) => (
            <TouchableOpacity
              key={index}
              style={styles.savedAddress}
              onPress={() => {
                setAddress(savedAddress.address);
                setResidential(savedAddress.residential);
                setCommunity(savedAddress.community);
              }}
            >
              <Text style={styles.savedText}>
                {savedAddress.address}, {savedAddress.residential}, {savedAddress.community}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Residential Area"
        value={residential}
        onChangeText={setResidential}
      />
      <TextInput
        style={styles.input}
        placeholder="Community"
        value={community}
        onChangeText={setCommunity}
      />

      <View style={styles.buttonGroup}>
        <Button title="Save Address" onPress={handleSaveAddress} color="#2196F3" />
        <Button title="Submit Order" onPress={handleSubmitOrder} color="#FF6347" />
      </View>
    </View>
  );
};

export default DetailsPage;

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
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  savedAddresses: {
    marginVertical: 15,
  },
  savedHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  savedAddress: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 5,
  },
  savedText: {
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
