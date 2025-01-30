// Rating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <View style={styles.ratingContainer}>
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <Text key={`full-${index}`} style={styles.star}>
            ★
          </Text>
        ))}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <Text key={`empty-${index}`} style={styles.emptyStar}>
            ☆
          </Text>
        ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  star: {
    fontSize: 20,
    color: '#FFD700', 
    marginHorizontal: 2,
  },
  emptyStar: {
    fontSize: 20,
    color: '#d3d3d3', 
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  }
});

export default Rating;
