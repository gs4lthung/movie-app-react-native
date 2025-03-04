import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "./movie.interface";

// ✅ Fix: Ensure `loadData` always returns an array
const loadData = async (): Promise<Movie[]> => {
  try {
    const value = await AsyncStorage.getItem("favoriteMovies");
    return value ? JSON.parse(value) : []; // ✅ Return an empty array if no data
  } catch (error) {
    console.error("Error loading data:", error);
    return [];
  }
};

// ✅ Fix: Ensure data is always an array
const storeData = async (value: Movie[]) => {
  try {
    await AsyncStorage.setItem("favoriteMovies", JSON.stringify(value));
    console.log("Data stored successfully:", value);
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

// ✅ Fix: Ensure `addData` doesn't overwrite
const addData = async (value: Movie) => {
  try {
    const data = await loadData(); // ✅ Always return an array
    if (data.some((movie) => movie.id === value.id)) {
      console.log("Movie already exists in favorites");
      return; // ✅ Prevent duplicate entries
    }
    await storeData([...data, value]); // ✅ Append movie properly
    console.log("Movie added to favorites:", value);
  } catch (error) {
    console.error("Error adding data:", error);
  }
};

// ✅ Fix: Ensure deleteData removes correctly
const deleteData = async (value: Movie) => {
  try {
    const data = await loadData(); // ✅ Always return an array
    const updatedData = data.filter((movie) => movie.id !== value.id);
    await storeData(updatedData);
    console.log("Movie removed from favorites:", value);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

export { loadData, storeData, addData, deleteData };
