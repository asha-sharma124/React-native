import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ShippingScreen from './ShippingScreen';

const Cart = ({ cartItems, removeFromCart }) => {
  const navigation = useNavigation();

  if (!cartItems) {
    console.error('cartItems is undefined or null');
    return <Text style={styles.emptyText}>Your cart is empty!</Text>;
  }

  const topRatedThreshold = 4;
  const [discountActive, setDiscountActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [couponUsed, setCouponUsed] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountedAmount = (totalAmount * 0.9).toFixed(2);
  const remainingAmount = 2999 - totalAmount;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && discountActive) {
      Alert.alert('Time Up!', 'The discount offer has expired.');
      setDiscountActive(false);
    }
    return () => clearInterval(interval);
  }, [timer, discountActive]);

  const handleGrabDeal = () => {
    if (cartItems.length > 0) {
      setDiscountActive(true);
      setTimer(60);
      Alert.alert(
        'Grab the Deal!',
        'You have 1 minute to grab this discount! 😊🎉'
      );
    } else {
      Alert.alert('Cart is empty', 'Add items to your cart to grab the deal!');
    }
  };

  const handleBuyNow = () => {
    if (cartItems.length > 0) {
      const amountToPay = discountActive ? discountedAmount : totalAmount;
      if (discountActive) {
        setCouponUsed(true);
        setDiscountActive(false);
        setTimer(0);
        Alert.alert('Congratulations!', 'You successfully used the discount!');
      }

      
      navigation.navigate('ShippingScreen', {
        cartItems,
        amountToPay,
        fromLocation: 'Chennai, India',  
        toLocation: 'Delhi, India',    
        shippingMode: 'transit',     
      });
    } else {
      Alert.alert('Cart is empty', 'Your cart is empty!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                <Text style={styles.productRating}>
                  Rating: {item.rating}{' '}
                  {item.rating >= topRatedThreshold ? '(Top Rated)' : ''}
                </Text>
                <Button
                  title="Remove"
                  onPress={() => removeFromCart(item.id)}
                  color="#FF6347"
                />
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              Total Amount: ${discountActive ? discountedAmount : totalAmount}
            </Text>
            {remainingAmount > 0 && !discountActive && (
              <Text style={styles.remainingText}>
                Add items worth ₹{remainingAmount.toFixed(2)} more to unlock the "Grab the Deal" offer!
              </Text>
            )}
            {discountActive && (
              <Text style={styles.timerText}>
                Grab this discount in: {timer}s
              </Text>
            )}
          </View>

          {!discountActive && !couponUsed && totalAmount >= 2999 && (
            <TouchableOpacity
              style={styles.grabDealButton}
              onPress={handleGrabDeal}
            >
              <Text style={styles.grabDealText}>🎉 Grab the Deal! 😊</Text>
            </TouchableOpacity>
          )}

          <Button title="Buy Now" onPress={handleBuyNow} color="#FF6347" />
        </>
      )}
    </View>
  );
};

export default Cart;

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
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  productRating: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  amountContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  remainingText: {
    fontSize: 16,
    color: '#FF6347',
    marginTop: 5,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#FF6347',
    marginTop: 5,
  },
  grabDealButton: {
    marginVertical: 15,
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  grabDealText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
