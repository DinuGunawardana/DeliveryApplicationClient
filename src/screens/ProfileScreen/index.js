import { View, Text, TextInput, StyleSheet, Button, Alert, PermissionsAndroid, Platform} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';

const Profile = () => {
  const { dbUser } = useAuthContext();

  const [name, setName] = useState(dbUser?.name || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  // const [lat, setLat] = useState(dbUser?.lat + "" || "0");
  // const [lng, setLng] = useState(dbUser?.lng + "" || "0");
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const { sub, setDbUser } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const onSave = async () => {
     if (dbUser) {
       await updateUser();
    } else {
       await createUser();
    }
     navigation.goBack();
   };

  const updateUser = async () => {
    const user = await DataStore.save(
      User.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.address = address;
        updated.lat = parseFloat(currentLatitude);
        updated.lng = parseFloat(currentLongitude);
      })
    );
    setDbUser(user);
  };

const createUser = async () => {
  try {
    const user = await DataStore.save(
      new User({
        name,
        address,
        lat: parseFloat(currentLatitude),
        lng: parseFloat(currentLongitude),
        sub,
      })
    );
    setDbUser(user);
  } catch (e) {
    Alert.alert("Error", e.message);
  }
};

  return (
    <SafeAreaView>
      <Text style={{ fontSize: 36, textAlign:'center', color:'orange', fontWeight:'bold'}}>ALI EAT</Text>
       <TextInput
         value={name}
         onChangeText={setName}
         placeholder="Name"
         style={styles.input}
       />
       <TextInput
         value={address}
         onChangeText={setAddress}
         placeholder="Address"
         style={styles.input}
       />
       <TextInput
         value={currentLatitude}
         onChangeText={setCurrentLatitude}
         placeholder="Latitude"
         style={styles.input}
         keyboardType="numeric"
       />
       <TextInput
         value={currentLongitude}
         onChangeText={setCurrentLongitude}
         placeholder="Longitude"
         style={styles.input}
       />
       <View style={{marginTop: 20}}>
            <Button
              title="Refresh"
              onPress={getOneTimeLocation}
            />
        </View>
       <Button onPress={onSave} title="Save" />
      <Text
         onPress={() => Auth.signOut()}
         style={{ textAlign: "center", color: "red", margin: 10 }}
       >
         Sign out
       </Text>
       <Text style={styles.boldText}>
            {locationStatus}
        </Text>
    </SafeAreaView>

    );
};

// const Profile = () => {



const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
