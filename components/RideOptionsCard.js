import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import tw from "tailwind-react-native-classnames";
import { Icon, Tile } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../slices/navSlice";

const data = [
  {
    id: "Uber-X-123",
    title: "Uber X",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
];

// If we have SURGE pricing, this goes up
const SURGE_CHARGE_RATE = 1.5;

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  return (
    <SafeAreaView style={[tw`bg-white flex-grow`,{marginBottom:10}]}>
      <View>
        <TouchableOpacity 
        onPress={() => navigation.navigate("NavigateCard")}
        style={tw`absolute top-3 left-4 z-50 p-3 rounded-full`}>
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <Text style={tw`text-center py-5 text-xl`}>Select a Ride - {travelTimeInformation?.distance?.text}</Text>
      </View>

      <FlatList 
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({item:{id, title, multiplier, image}, item }) => (
          <TouchableOpacity 
          onPress={() => setSelected(item)}
          style={tw`flex-row justify-between items-center px-5 ${id === selected?.id && "bg-gray-200"}`}>
            <Image
            style={{ width:80, height:80, resizeMode:"contain" }}
            source={{ uri: image }}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`font-semibold`}>{title}</Text>
              <Text>{travelTimeInformation?.duration?.text} Travel tine</Text>
            </View>
            <Text style={tw`text-xl`}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(
                (travelTimeInformation?.duration.value * SURGE_CHARGE_RATE * multiplier) / 500
              )}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity disabled={!selected} style={tw`bg-black py-3 m-2 ${!selected && 'bg-gray-300'}`}>
          <Text style={tw`text-center text-white`}>Choose {selected?.title}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
