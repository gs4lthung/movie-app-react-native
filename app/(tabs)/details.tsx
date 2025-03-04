import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // ✅ Import heart icon from Expo

export default function DetailsMovie() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movie =
    typeof params.movie === "string" ? JSON.parse(params.movie) : {};

  const [isFavorite, setIsFavorite] = useState(false); // ✅ Track favorite state

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Heart Button for Favorite */}
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <AntDesign
          name={isFavorite ? "heart" : "hearto"} // ✅ Toggle between filled & outlined heart
          size={30}
          color={isFavorite ? "red" : "black"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.movieImage}
          />
          {/* 🔞 Show "Adult" Badge */}
          {movie.adult && (
            <View style={styles.adultBadge}>
              <Text style={styles.adultBadgeText}>🔞</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{movie.title}</Text>

      {/* Popularity, Release Date, Vote Average, and Vote Count */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ⭐ Popularity: {movie.popularity}
        </Text>
        <Text style={styles.infoText}>
          📅 Release Date: {movie.release_date}
        </Text>
        <Text style={styles.infoText}>
          🎖️ Rating: {movie.vote_average} / 10
        </Text>
        <Text style={styles.infoText}>🗳️ Votes: {movie.vote_count}</Text>
      </View>

      <Text style={styles.overview}>{movie.overview}</Text>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}
        style={styles.movieBackDropImage}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  favoriteButton: {
    position: "absolute",
    top: 40, // ✅ Adjust based on your layout
    right: 20,
    zIndex: 1, // Ensure it stays on top
  },
  movieImage: {
    marginTop: 20,
    height: 500,
    width: "100%",
    borderRadius: 10,
  },
  movieBackDropImage: {
    marginTop: 20,
    height: 200,
    width: "100%",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  overview: {
    fontSize: 16,
    color: "#bbb",
    marginTop: 15,
    lineHeight: 22,
  },
  adultLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red", // Red to indicate adult content
    textAlign: "center",
    marginTop: 5,
  },
  imageWrapper: {
    position: "relative", // Needed for badge positioning
  },
  adultBadge: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adultBadgeText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
});
