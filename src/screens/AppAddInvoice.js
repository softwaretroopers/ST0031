import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  DataTable,
  TextInput,
  Title,
  Text,
  ToggleButton,
  Divider,
  Searchbar,
  Appbar,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

const totalPrice = 10000;

function AppAddInvoice({ navigation, route }) {
  const { shop } = route.params;

  const [StockItems, setStockItems] = React.useState([]);

  const stockRef = firebase.firestore().collection("stockItems");

  React.useEffect(() => {
    stockRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newStock.push(shop);
        });
        setStockItems(newStock);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const [value, setValue] = React.useState("cash");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View>
      <Appbar>
        <Appbar.BackAction onPress={(values) => navigation.goBack()} />
        <Appbar.Content title="නව ඉන්වොයිස" subtitle={shop.name} />
        <Appbar.Action
          onPress={(values) =>
            navigation.navigate("AddReturnScreen", {
              shop: {
                id: shop.id,
                name: shop.name,
                category: shop.category,
              },
            })
          }
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
          <Title style={{ marginHorizontal: "2%", fontSize: 12 }}>
            ගෙවීමේ ක්‍රමය
          </Title>
          <ToggleButton.Row
            onValueChange={(value) => setValue(value)}
            value={value}
          >
            <ToggleButton icon="cash" value="cash"></ToggleButton>
            <ToggleButton icon="credit-card" value="card"></ToggleButton>
            <ToggleButton
              icon="card-text-outline"
              value="cheque"
            ></ToggleButton>
          </ToggleButton.Row>
        </View>
        <Divider style={{ marginLeft: "2%", width: 1, height: "100%" }} />
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
      </View>
      <Divider />
      <Searchbar
        placeholder="භාණ්ඩ සොයන්න"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>භාණ්ඩ</DataTable.Title>
          <DataTable.Title>ඒකක මිල (Rs)</DataTable.Title>
          <DataTable.Title>ප්‍රමාණය</DataTable.Title>
          <DataTable.Title>මිල (Rs)</DataTable.Title>
        </DataTable.Header>

        <FlatList
          style={{ marginBottom: "53%" }}
          data={StockItems}
          keyExtractor={(invoiceItem) => invoiceItem.id.toString()}
          renderItem={({ item }) => (
            <>
              {AppRenderIf(0 == item.stock, <></>)}
              {AppRenderIf(
                0 < item.stock,
                <DataTable.Row>
                  <DataTable.Cell>{item.itemName}</DataTable.Cell>
                  {AppRenderIf(
                    shop.category == "a",
                    <DataTable.Cell>{item.unitPriceA}</DataTable.Cell>
                  )}
                  {AppRenderIf(
                    shop.category == "b",
                    <DataTable.Cell>{item.unitPriceB}</DataTable.Cell>
                  )}
                  {AppRenderIf(
                    shop.category == "c",
                    <DataTable.Cell>{item.unitPriceC}</DataTable.Cell>
                  )}
                  <DataTable.Cell>
                    <TextInput
                      placeholder={item.stock}
                      mode="outlined"
                      onChangeText={(text) => setQuantity(text)}
                      keyboardType="number-pad"
                      style={{
                        backgroundColor: AppColors.background,
                        height: 25,
                      }}
                    ></TextInput>
                  </DataTable.Cell>
                  <DataTable.Cell>{item.unitPriceA * quantity}</DataTable.Cell>
                </DataTable.Row>
              )}
            </>
          )}
        />
      </DataTable>
    </View>
  );
}

export default AppAddInvoice;

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
