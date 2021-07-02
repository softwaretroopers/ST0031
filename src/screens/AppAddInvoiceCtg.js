import React, { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Title,
  Searchbar,
  Provider,
  Snackbar,
  Divider,
  ToggleButton,
  List,
  Appbar,
} from "react-native-paper";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";

function AppAddInvoiceCtg({ navigation, route }) {
  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  //const { stockcategory } = route.params;

  const { invoice } = route.params;

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

  const updateStock = () => {
    const data = {
      stock: itemStock - quantity,
      itemName: itemName,
      unitPriceA: unitPriceA,
      unitPriceB: unitPriceB,
      unitPriceC: unitPriceC,
      stockPrice: stockPrice,
    };
    stockRef
      .doc(itemID)
      .set(data)
      .then((_doc) => {
        //navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const [value, setValue] = React.useState("cash");

  const [quantity, setQuantity] = React.useState(0);
  const [itemID, setItemID] = React.useState("");
  const [itemStock, setItemStock] = React.useState("");
  const [unitPriceA, setUnitPriceA] = React.useState(0);
  const [unitPriceB, setUnitPriceB] = React.useState(0);
  const [unitPriceC, setUnitPriceC] = React.useState(0);
  const [itemName, setItemName] = React.useState("");
  const [unitPrice, setunitPrice] = React.useState(0);
  const [stockPrice, setStockPrice] = React.useState(0);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = React.useState("");

  const invoiceRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID)
    .collection("invItems");

  const createInvoice = () => {
    {
      //      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      //    const invoiceid = Date.now();
      const data = {
        itemName: itemName,
        quantity: parseInt(quantity),
        stockPrice: parseFloat(stockPrice),
        unitPrice: parseFloat(unitPrice),
      };
      invoiceRef
        .add(data)
        .then((_doc) => {})
        .catch((error) => {
          alert(error);
        });
    }
  };

  //search

  const stockInvoiceRef = firebase.firestore().collection("category");
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  //const id = stockcategory.name
  // .where("category", "==", id)
  React.useEffect(() => {
    stockInvoiceRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newStock.push(shop);
        });
        setFilteredDataSource(newStock), setMasterDataSource(newStock);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
  var { height } = Dimensions.get("window");

  // //search
  // const stockInvoiceRef = firebase.firestore().collection("category");
  // const [search, setSearch] = useState('');
  // const [filteredDataSource, setFilteredDataSource] = useState([]);
  // const [masterDataSource, setMasterDataSource] = useState([]);

  // React.useEffect(() => {
  //   stockInvoiceRef.onSnapshot(
  //       (querySnapshot) => {
  //         const newStock = [];
  //         querySnapshot.forEach((doc) => {
  //           const shop = doc.data();
  //           shop.id = doc.id;
  //           newStock.push(shop);
  //         });
  //         setFilteredDataSource(newStock),
  //         setMasterDataSource(newStock);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }, []);

  // const searchFilterFunction = (text) => {
  //   // Check if searched text is not blank
  //   if (text) {
  //     // Inserted text is not blank
  //     // Filter the masterDataSource
  //     // Update FilteredDataSource
  //     const newData = masterDataSource.filter(function (item) {
  //       const itemData = item.name
  //         ? item.name.toUpperCase()
  //         : ''.toUpperCase();
  //       const textData = text.toUpperCase();
  //       return itemData.indexOf(textData) > -1;
  //     });
  //     setFilteredDataSource(newData);
  //     setSearch(text);
  //   } else {
  //     // Inserted text is blank
  //     // Update FilteredDataSource with masterDataSource
  //     setFilteredDataSource(masterDataSource);
  //     setSearch(text);
  //   }
  // };

  return (
    <Provider>
      <View style={styles.screen}>
        <View>
          <Appbar>
            <Appbar.BackAction onPress={(values) => navigation.goBack()} />
            <Appbar.Content title="නව ඉන්වොයිස" subtitle={invoice.name} />
            <Appbar.Action
              onPress={(values) =>
                navigation.navigate("AddReturnScreen", {
                  shop: {
                    name: invoice.name,
                    payMethod: value,
                    docID: invoice.docID,
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
              <Snackbar
                duration={500}
                visible={visibleSnack}
                onDismiss={onDismissSnackBar}
              >
                දත්ත එකතු කිරීම සාර්ථකයි
              </Snackbar>
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
            ></View>
          </View>
          {/* <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="කාණ්ඩය තෝරන්න"
          />
        </Appbar> */}
          <Searchbar
            style={{
              marginTop: "2%",
              marginBottom: "2%",
              borderRadius: 10,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction("")}
            placeholder="කාණ්ඩ සොයන්න"
            value={search}
          />
          <FlatList
            data={filteredDataSource}
            keyExtractor={(stock) => stock.id.toString()}
            renderItem={({ item }) => (
              <TouchableNativeFeedback
                onPress={(values) =>
                  navigation.navigate("AddInvoiceScreen", {
                    invoice: {
                      id: item.id,
                      name: item.name,
                      category: invoice.category,
                      docID:invoice.docID
                    },
                  })
                }
              >
                <View style={styles.card}>
                  <Avatar.Icon size={30} icon="marker" />
                  <Title style={styles.title}>{item.name}</Title>
                </View>
              </TouchableNativeFeedback>
            )}
          />
        </View>
      </View>
    </Provider>
  );
}

export default AppAddInvoiceCtg;

const styles = StyleSheet.create({
  title: { fontSize: 16 },
  screen: { flex: 1 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.secondary,
  },
  card: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    marginLeft: "25%",
    marginTop: "-15%",
  },
});
