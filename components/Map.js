import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from "tailwind-react-native-classnames";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { selectDestination, selectOrigin, setTravelTimeInformation } from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";

const Map = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (origin && destination) {
        try {
          const response = await axios.get(
            `http://router.project-osrm.org/route/v1/driving/${origin.location.long},${origin.location.lat};${destination.location.long},${destination.location.lat}?overview=full&geometries=geojson`
          );
          const coords = response.data.routes[0].geometry.coordinates.map(
            (point) => ({
              latitude: point[1],
              longitude: point[0],
            })
          );
          setRouteCoords(coords);
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchRoute();
  }, [origin, destination]);

  useEffect(() => {
    if (!origin || !destination) return;

    const getTravelTime = async () => {
      try {
        const response = await axios.get('https://router.hereapi.com/v8/routes', {
          params: {
            apiKey: '9EdIUSTEt0GwVIwL6pldjW6j0or-i0RN3WFELq6-C3Y',
            transportMode: 'car',
            origin: `${origin.location.lat},${origin.location.long}`,
            destination: `${destination.location.lat},${destination.location.long}`,
            return: 'summary',
          },
        });

        const data = response.data;

        // Trích xuất dữ liệu khoảng cách và thời gian từ phản hồi
        const distance = data.routes[0].sections[0].summary.length; // Khoảng cách tính bằng mét
        const duration = data.routes[0].sections[0].summary.duration; // Thời gian tính bằng giây

        // Chuyển đổi khoảng cách từ mét sang km
        const distanceInMiles = (distance / 1000).toFixed(2);
        // Chuyển đổi thời gian từ giây sang giờ và phút
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);

        // Lưu thông tin vào Redux store
        const travelTimeInfo = {
          distance: {
            text: `${distanceInMiles} km`,
            value: distance,
          },
          duration: {
            text: `${hours} hours ${minutes} mins`,
            value: duration,
          },
        };

        console.log(travelTimeInfo);

        dispatch(setTravelTimeInformation(travelTimeInfo));
      } catch (error) {
        console.error(error);
      }
    };

    getTravelTime();
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.long,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.long,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.long,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="red" />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
