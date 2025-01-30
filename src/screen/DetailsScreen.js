import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetailsScreen = ({ route }) => {
  const { shippingOptions } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shipping Details</Text>
      {shippingOptions ? (
        <View>
          <Text>Mode: {shippingOptions.mode}</Text>
          <Text>Cost: ₹{shippingOptions.cost}</Text>
          <Text>Time: {shippingOptions.time.toFixed(2)} hrs</Text>
        </View>
      ) : (
        <Text>No shipping options available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default DetailsScreen;
