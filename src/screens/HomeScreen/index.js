import {useState, useEffect} from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import RestaurantItem from "../../components/RestaurantItem";
import { DataStore } from "aws-amplify";
import { Restaurant }  from "../../models";

// const order = orders[0];

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
      DataStore.query(Restaurant).then(setRestaurants);  
  }, []);

  return (
    <View style={styles.page}>
      <Text style={{ fontSize: 36, textAlign:'center', color:'orange', fontWeight:'bold'}}>ALI EAT</Text>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <RestaurantItem restaurant={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    paddingBottom: 40,
  },
});
