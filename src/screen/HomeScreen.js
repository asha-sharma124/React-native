import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import client from "../../contentful";
import Rating from "./Rating";
import Header from "./Header";
import LinearGradient from "react-native-linear-gradient";
import Fontisto from "react-native-vector-icons/dist/Fontisto";

const { width } = Dimensions.get("window");

const HomeScreen = ({ addToCart,navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const sliderImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjE5MTQzMjcz&ixlib=rb-1.2.1&q=80&w=1080",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjE5MTQzMjcz&ixlib=rb-1.2.1&q=80&w=1080",
    "https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await client.getEntries({ content_type: "product" });
        const fetchedProducts = response.items.map((item) => ({
          id: item.sys.id,
          name: item.fields.productName,
          price: item.fields.productPrice,
          image: `https:${item.fields.productImage.fields.file.url}`,
          rating: item.fields.ratings || 0,
          description: item.fields.description || "No description available.",
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchProducts();

   
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 1000); 

   
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };
  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };
  if (selectedProduct) {
    return (
      <ScrollView style={styles.detailsContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: selectedProduct.image }}
          style={styles.detailsImage}
        />
        <Text style={styles.detailsName}>{selectedProduct.name}</Text>
        <Text style={styles.detailsPrice}>Rs. {selectedProduct.price}</Text>
        <Text style={styles.detailsDescription}>
        ✨ {selectedProduct.description} 🌸
        </Text>
        <Text style={styles.detailsRating}>Rating: {selectedProduct.rating} ★</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            addToCart(selectedProduct);
            handleBack();
          }}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }


  return (
    <LinearGradient colors={["#FDF0F3", "#FFFBFC"]} style={styles.container}>
      <Header navigation={navigation} />
      <Text style={styles.matchText}>Match Your Style</Text>

      <View style={styles.inputContainer}>
        <Fontisto name={"search"} size={20} color={"#C0C0C0"} />
        <TextInput
          style={styles.textInput}
          placeholder="Search Products"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {searchQuery.trim() === "" && (
        <View style={styles.sliderContainer}>
          <Image source={{ uri: sliderImages[currentImageIndex] }} style={styles.sliderImage} />
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardClick(item)}>
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>Rs. {item.price}</Text>
            <Rating rating={item.rating} />
            

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FDF0F3",
  },
  matchText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  detailsDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "justify", 
    fontStyle: "italic", 
    paddingHorizontal: 10,
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  sliderContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FDF0F3",
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
    
  },
  backButtonText: {
    color: "#FF6347",
    fontSize: 22,
  },
  detailsImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  detailsPrice: {
    fontSize: 20,
    color: "#FF6347",
    textAlign: "center",
    marginBottom: 10,
  },
  detailsDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  detailsRating: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
