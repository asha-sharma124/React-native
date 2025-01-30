import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const cities = [
  { label: 'Mumbai', value: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  { label: 'Delhi', value: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
  { label: 'Bangalore', value: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { label: 'Kolkata', value: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
  { label: 'Chennai', value: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
];

const rates = { transit: { cost: 2, speed: 50 }, flight: { cost: 10, speed: 700 } };

const calculateShipping = (distance, mode) => ({
  cost: distance * rates[mode].cost,
  time: distance / rates[mode].speed,
});

const ShippingScreen = () => {
  const [from, setFrom] = useState(cities[0]);
  const [to, setTo] = useState(cities[1]);
  const [mode, setMode] = useState('transit');
  const [distance, setDistance] = useState(null);
  const [cost, setCost] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!from || !to) return;
    fetchRoute();
  }, [from, to, mode]);

  const fetchRoute = async () => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false`
      );
      if (!data.routes.length) return Alert.alert('Error', 'No routes found');
      
      const dist = data.routes[0].distance / 1000;
      setDistance(dist.toFixed(2));
      const { cost, time } = calculateShipping(dist, mode);
      setCost(cost.toFixed(2));
      setTime(time.toFixed(2));
    } catch {
      Alert.alert('Error', 'Failed to fetch route');
    }
  };

  const handlePayment = () => {
    Alert.alert('Payment', `You have paid ₹${cost} for shipping.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Shipping Calculator</Text>
      </View>
      
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>From:</Text>
        <View style={styles.selectorBox}>
          <RNPickerSelect onValueChange={value => setFrom(cities.find(city => city.value === value))} items={cities} value={from.value} />
        </View>
      </View>
      
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>To:</Text>
        <View style={styles.selectorBox}>
          <RNPickerSelect onValueChange={value => setTo(cities.find(city => city.value === value))} items={cities} value={to.value} />
        </View>
      </View>
      
      <Text style={styles.label}>Shipping Mode: {mode}</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.result}>Distance: {distance} km</Text>
        <Text style={styles.result}>Cost: ₹{cost}</Text>
        <Text style={styles.result}>Time: {time} hours</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, mode === 'transit' && styles.activeButton]} onPress={() => setMode('transit')}>
          <Text style={styles.buttonText}>Cheapest (Transit)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, mode === 'flight' && styles.activeButton]} onPress={() => setMode('flight')}>
          <Text style={styles.buttonText}>Fastest (Flight)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', justifyContent: 'center' },
  headerContainer: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, marginBottom: 20 },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#fff' },
  selectorContainer: { marginBottom: 15 },
  selectorBox: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10, color: '#555' },
  resultContainer: { marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  result: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginVertical: 5, color: '#222' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { flex: 1, padding: 12, margin: 5, borderRadius: 8, backgroundColor: '#6c757d', alignItems: 'center' },
  activeButton: { backgroundColor: '#007bff' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  payButton: { marginTop: 30, padding: 15, borderRadius: 8, backgroundColor: '#28a745', alignItems: 'center' },
  payButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default ShippingScreen;
