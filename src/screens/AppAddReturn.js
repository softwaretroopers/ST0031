import React from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  DataTable,
  IconButton,
  TextInput,
  Title,
  Text,
  ToggleButton,
  Divider,
  Searchbar,
  Avatar,
  Chip,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

const totalPrice = 10000;
const invoiceItems = [
  {
    itemID: "#001",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "20",
  },
  {
    itemID: "#002",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "15",
  },
  {
    itemID: "#003",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "10",
  },
  {
    itemID: "#004",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "15",
  },
  {
    itemID: "#005",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "25",
  },
  {
    itemID: "#006",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "20",
  },
  {
    itemID: "#007",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "15",
  },
  {
    itemID: "#008",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "0",
  },
  {
    itemID: "#009",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "15",
  },
  {
    itemID: "#010",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "25",
  },
  {
    itemID: "#011",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "15",
  },
  {
    itemID: "#012",
    itemName: "Anonymous Item",
    unitPrice: "250",
    stock: "25",
  },
];

function AppAddReturns(props) {
  const [StockItems, setStockItems] = React.useState([]);

  const stockRef = firebase.firestore().collection("stockItems");
  const [quantity, setQuantity] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState("");

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

  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View>
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
          <Text>Rs.{totalPrice}</Text>
        </View>
        <Divider style={{ marginLeft: "2%", width: 1, height: "100%" }} />
        <IconButton
          onPress={(values) => props.navigation.navigate("HomeScreen")}
          icon="arrow-collapse-right"
          size={24}
          color={AppColors.primary}
        ></IconButton>
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
          <DataTable.Title>ඒකක මිල</DataTable.Title>
          <DataTable.Title>ප්‍රමාණය</DataTable.Title>
          <DataTable.Title>මිල</DataTable.Title>
        </DataTable.Header>

        <FlatList
          style={{ marginBottom: "53%" }}
          data={StockItems}
          keyExtractor={(invoiceItem) => invoiceItem.itemID.toString()}
          renderItem={({ item }) => (
            <DataTable.Row>
              <DataTable.Cell>{item.itemName}</DataTable.Cell>
              <DataTable.Cell>
                <TextInput
                  placeholder="Rs."
                  mode="outlined"
                  keyboardType="number-pad"
                  onChangeText={(text) => setUnitPrice(text)}
                  style={{
                    backgroundColor: AppColors.background,
                    height: 25,
                  }}
                ></TextInput>
              </DataTable.Cell>
              <DataTable.Cell>
                <TextInput
                  placeholder={item.stock}
                  mode="outlined"
                  keyboardType="number-pad"
                  onChangeText={(text) => setQuantity(text)}
                  style={{
                    backgroundColor: AppColors.background,
                    height: 25,
                  }}
                ></TextInput>
              </DataTable.Cell>
              <DataTable.Cell>{unitPrice * quantity}</DataTable.Cell>
            </DataTable.Row>
          )}
        />
      </DataTable>
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
