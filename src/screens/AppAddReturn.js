import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  DataTable,
  IconButton,
  TextInput,
  Title,
  Text,
  Appbar,
  Divider,
  Searchbar,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

const totalPrice = 10000;

function AppAddReturns({ navigation, route }) {

  const { shop } = route.params;
  const [returns, setReturns] = React.useState('0');

  const dbRef = firebase.firestore();

  const addReturns = () => { {
    
  const timestamp = firebase.firestore.FieldValue.serverTimestamp(); 
  const data = {
    payMethod:shop.payMethod,
    shopName:shop.name,
    returns:returns,
    invoiceID:shop.docID,
    date:timestamp
  };
    dbRef.collection("invoices").doc(shop.docID)
    .set(data)
    .catch((error) => {
      alert(error);
    });
    }
  };

  return (
    <View>
      <Appbar>
        <Appbar.BackAction onPress={(values) => navigation.goBack()} />
        <Appbar.Content title="Deduct Returns" subtitle={shop.name} />
        <Appbar.Action
          onPress={(values) => {addReturns(),navigation.navigate("HomeScreen")}}
          icon="arrow-collapse-right"
        />
      </Appbar>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "1%",
          margin: "1%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title style={{ marginLeft: "5%", fontSize: 12 }}>මුළු මුදල: </Title>
          <Text>Rs.{totalPrice}</Text>
        </View>
        <Divider style={{ marginLeft: "2%", width: 1, height: "100%" }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title style={{ marginLeft: "5%", fontSize: 12 }}>
            නව මුළු මුදල:
          </Title>
          <Text>Rs.{totalPrice-returns}</Text>
        </View>
       
      </View>
      <Divider/>   
      <TextInput
        placeholder='Returns (Rs)'
        mode="outlined"
       onChangeText={(text) => setReturns(text)}
        value={returns}
       keyboardType="number-pad"
        style={{width:'60%',alignSelf:"center"}}
        >
      </TextInput>
    </View>
  );
}

export default AppAddReturns;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    marginHorizontal: "2%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    flexDirection: "row",
  },
  title: { fontSize: 16 },
});
