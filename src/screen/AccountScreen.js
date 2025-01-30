import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';


const AccountScreen = ({ navigation }) => {
  const { login } = useAuth();  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedPassword = await AsyncStorage.getItem('password');
      if (storedName && storedPassword) {
        setIsLoggedIn(true);
        setName(storedName);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!name || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    const storedName = await AsyncStorage.getItem('name');
    const storedPassword = await AsyncStorage.getItem('password');

    if (storedName === name && storedPassword === password) {
      setIsLoggedIn(true);
      login(name);  
      Alert.alert('Login Successful');
      navigation.navigate('CART');
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  const handleSignup = async () => {
    if (!name || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('password', password);
    Alert.alert('Account Created');
    setIsSignup(false); 
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('password');
    setIsLoggedIn(false);
    setName('');
    setPassword('');
    navigation.navigate('HOME');
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.formContainer}>
          {isSignup ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Button title="Signup" onPress={handleSignup} />
              <Button title="Already have an account? Login" onPress={() => setIsSignup(false)} />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Button title="Login" onPress={handleLogin} />
              <Button title="Don't have an account? Signup" onPress={() => setIsSignup(true)} />
            </>
          )}
        </View>
      ) : (
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>Welcome, {name}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  profileCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default AccountScreen;
