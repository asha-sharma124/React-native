import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoriesPage from './CategoriesPage';

const Header = () => {
  const navigation = useNavigation();  
  const [imageUri, setImageUri] = useState(null);  

  
  useEffect(() => {
    const getProfileImage = async () => {
      const storedImageUri = await AsyncStorage.getItem('profileImageUri');
      if (storedImageUri) {
        setImageUri(storedImageUri);  
      }
    };

    getProfileImage();
  }, []);

  const handleImagePress = () => {
    navigation.navigate('ACCOUNT'); };

  const handleImagesPress = () => {
    navigation.navigate('CategoriesPage');  
  };
  return (
    <View style={styles.container}>
      <View style={styles.appIconContainer}>
      <TouchableOpacity onPress={handleImagesPress}>
          <Image source={require("../assets/appIcon.png")} style={styles.appIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.boldText}>Shop Hub🛒</Text>
      
      <TouchableOpacity onPress={handleImagePress}>
        <Image 
          source={imageUri ? { uri: imageUri } : require("../assets/dp.png")} 
          style={styles.dp} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  appIconContainer: {
    backgroundColor: "#FFFFFF",
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center"
  },
  boldText: {
    fontWeight: 'bold', 
    fontSize: 21
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20
  },
  appIcon: {
    height: 28,
    width: 28
  },
  dp: {
    height: 44,
    width: 44,
    borderRadius: 22
  }
});
