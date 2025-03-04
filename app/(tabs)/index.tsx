import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { API_URL, API_KEY } from "@env";
import { useNavigation, useRouter } from "expo-router";
import { Movie } from "@/movie.interface";
import { AntDesign } from "@expo/vector-icons"; // ✅ Import heart icon from Expo

export default function HomeScreen() {
  const router = useRouter();

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `${API_URL}/trending/movie/day?language=en-US`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const renderMovieItem = ({ item }: { item: Movie }) => {
    return (
      <TouchableOpacity
        style={styles.movieContainer}
        onPress={() => {
          router.push({
            pathname: "/details",
            params: { movie: JSON.stringify(item) },
          });
        }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            }}
            style={styles.movieImage}
          />
          {item.adult && (
            <View style={styles.adultBadge}>
              <Text style={styles.adultText}>18+</Text>
            </View>
          )}
        </View>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Trending Movies</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Movies"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => {
            if (searchQuery.trim() === "") {
              return;
            }
            router.push({
              pathname: "/search",
              params: { query: searchQuery },
            });
          }}
        >
          <AntDesign
            name="search1"
            size={24}
            color="black"
            // style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color={"#e74c3c"} />
      ) : (
        <FlatList
          data={trendingMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  movieContainer: {
    alignItems: "center",
    padding: 10,
  },
  imageWrapper: {
    position: "relative", // ✅ Allows positioning of the 18+ badge
  },
  movieImage: {
    width: 300,
    height: 550,
    borderRadius: 15,
  },
  adultBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adultText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // White background
    borderRadius: 25, // Rounded corners
    paddingHorizontal: 15, // Space inside input
    width: "80%", // Responsive width
    height: 50,
    shadowColor: "#000", // Add slight shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Works for Android shadow
    marginBottom: 20, // Space below search bar
  },
  searchInput: {
    flex: 1, // Take full width inside container
    fontSize: 16,
    color: "#000", // Black text
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 10, // Space between text input and icon
  },
});
