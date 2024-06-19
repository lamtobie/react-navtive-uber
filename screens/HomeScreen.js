import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import axios from "axios";
import NavFavourites from "../components/NavFavourites";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const searchPlaces = async (query) => {
    if (query.length > 2) {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      setPlaces(response.data);
    }
  };
  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://links.papareact.com/gzs",
          }}
        />

        <TextInput
          style={styles.searchBox}
          placeholder="Where From?"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchPlaces(text);
          }}
        />
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.placeItem}
              onPress={() => {
                setSearchQuery(item.display_name);
                dispatch(
                  setOrigin({
                    location: { lat: parseFloat(item.lat), long: parseFloat(item.lon) },
                    description: item.display_name
                  })
                );
                setPlaces([]);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />

        <NavOptions />

        <NavFavourites />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    marginBottom: 10,
  },
  placeItem: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
