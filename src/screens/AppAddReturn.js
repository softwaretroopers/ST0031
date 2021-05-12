import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Snackbar,
  TextInput,
  Title,
  Text,
  Appbar,
  Divider,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

const totalPrice = 10000;

function AppAddReturns({ navigation, route }) {
  const { shop } = route.params;

  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [returns, setReturns] = React.useState("0");

  const dbRef = firebase.firestore();

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + "/" + month + "/" + year;
  };

  const addReturns = () => {
    {
      const data = {
        payMethod: shop.payMethod,
        shopName: shop.name,
        returns: returns,
        invoiceID: shop.docID,
        date: getCurrentDate(),
      };
      dbRef
        .collection("invoices")
        .doc(shop.docID)
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
          onPress={(values) => {
            onToggleSnackBar();
            addReturns();
            navigation.navigate("HomeScreen");
          }}
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
          <Text>Rs.{totalPrice - returns}</Text>
        </View>
      </View>
      <Divider />
      <TextInput
        placeholder="Returns (Rs)"
        mode="outlined"
        onChangeText={(text) => setReturns(text)}
        value={returns}
        keyboardType="number-pad"
        style={{ width: "60%", alignSelf: "center" }}
      ></TextInput>
      <Snackbar
        duration={500}
        visible={visibleSnack}
        onDismiss={onDismissSnackBar}
      >
        ඉන්වොයිසය නිකුත් කිරීම සාර්ථකයි
      </Snackbar>
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
