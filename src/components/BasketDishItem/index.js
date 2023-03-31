import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { Dish } from "../../models";

const BasketDishItem = ({ basketDish }) => {
  const [dish, setDish] = useState(null);

  useEffect (() => {
    DataStore.query(Dish, basketDish.basketDishDishId).then(setDish);
  }, [])

  console.log(basketDish.Dish._z);
  console.log(dish);
  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{basketDish.quantity}</Text>
      </View>
      <View>
        <Text style={{ fontWeight: "600" }}>{dish?.name}</Text>
      </View>
      <Text style={{ marginLeft: "auto" }}>Rs. {dish?.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },

  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 3,
  },
});

export default BasketDishItem;
