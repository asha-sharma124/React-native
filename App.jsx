import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import HomeScreen from './src/screen/HomeScreen';
import CartScreen from './src/screen/CartScreen';
import ShippingScreen from './src/screen/ShippingScreen';
import AccountScreen from './src/screen/AccountScreen';
import DetailsPage from './src/screen/DetailsPage';
import { AuthProvider } from './context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const TabNavigator = ({ cartItems, addToCart, removeFromCart }) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: 'red',
    }}
  >
    {/* Home Screen */}
    <Tab.Screen
      name="HOME"
      options={{
        tabBarIcon: ({ size, color }) => <Entypo name="home" size={size} color={color} />,
      }}
    >
      {() => <HomeScreen addToCart={addToCart} />}
    </Tab.Screen>

    {/* Cart Screen */}
    <Tab.Screen
      name="CART_TAB"
      options={{
        tabBarIcon: ({ size, color }) => <MaterialIcons name="shopping-cart" size={size} color={color} />,
      }}
    >
      {() => <CartScreen cartItems={cartItems} removeFromCart={removeFromCart} />}
    </Tab.Screen>

    {/* Details Page */}
    <Tab.Screen
      name="DETAILS"
      options={{
        tabBarIcon: ({ size, color }) => <MaterialIcons name="info" size={size} color={color} />,
      }}
    >
      {({ navigation }) => <DetailsPage cartItems={cartItems} navigation={navigation} />}
    </Tab.Screen>

    {/* Account Screen */}
    <Tab.Screen
      name="ACCOUNT"
      component={AccountScreen}
      options={{
        tabBarIcon: ({ size, color }) => <FontAwesome6 name="user" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    const alreadyInCart = cartItems.some((item) => item.id === product.id);
    if (alreadyInCart) {
      alert(`${product.name} is already in your cart!`);
    } else {
      setCartItems((prevCart) => [...prevCart, product]);
    }
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CART_TAB">
          {/* Tab Navigator (Main Screens) */}
          <Stack.Screen name="CART_TAB" options={{ headerShown: false }}>
            {() => <TabNavigator cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />}
          </Stack.Screen>

          {/* Stack Navigator for Cart and Shipping */}
          <Stack.Screen name="ShippingScreen" component={ShippingScreen} options={{ title: 'Shipping Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
