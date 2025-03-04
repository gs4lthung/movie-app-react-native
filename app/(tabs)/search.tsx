import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL, API_KEY } from "@env";

export default function SearchResultsScreen() {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${API_URL}/search/movie?query=${query}&language=en-US&include_adult=true`,
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
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchMovies();
  }, [query]);

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieContainer}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { movie: JSON.stringify(item) },
        })
      }
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        }}
        style={styles.movieImage}
      />
      <Text style={styles.movieTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔎 Results for: {query}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e74c3c" />
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noResults}>No movies found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingVertical: 40,
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  noResults: {
    fontSize: 16,
    color: "#bbb",
    marginTop: 20,
  },
  movieContainer: {
    alignItems: "center",
    padding: 10,
  },
  movieImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
});
