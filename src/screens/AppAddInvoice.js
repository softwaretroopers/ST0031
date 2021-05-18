import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from "react-native";
import {
  Button,
  DataTable,
  TextInput,
  Title,
  ToggleButton,
  Divider,
  Searchbar,
  Appbar,
  Snackbar,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppAddInvoice({ navigation, route }) {
  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

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
  const stockInvoiceRef = firebase.firestore().collection("stockItems");
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  React.useEffect(() => {
    stockInvoiceRef.onSnapshot(
        (querySnapshot) => {
          const newStock = [];
          querySnapshot.forEach((doc) => {
            const shop = doc.data();
            shop.id = doc.id;
            newStock.push(shop);
          });
          setFilteredDataSource(newStock),
          setMasterDataSource(newStock);
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
        const itemData = item.itemName
          ? item.itemName.toUpperCase()
          : ''.toUpperCase();
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

  return (
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
      <Divider />
      <Searchbar
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction('')}
        placeholder="භාණ්ඩ සොයන්න"
        value={search}
      />
      <DataTable>
      <DataTable.Header>
      <DataTable.Title style={{ justifyContent: "center" }}>ඒකක මිල: Rs.</DataTable.Title>
      <DataTable.Title style={{ justifyContent: "center" }}>ප්‍රමාණය</DataTable.Title>
      <DataTable.Title style={{ justifyContent: "center" }}>ක්‍රියාව</DataTable.Title>
    </DataTable.Header>
        <FlatList
          style={{ marginBottom: "53%" }}
          data={filteredDataSource}
          keyExtractor={(invoiceItem) => invoiceItem.id.toString()}
          renderItem={({ item, index }) => (
            <>
              {AppRenderIf(
                0 < item.stock,
                <>
                  <DataTable.Row>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {item.itemName}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    {/* <DataTable.Cell style={{justifyContent:"center"}}>{item.itemName}</DataTable.Cell> */}
                    {AppRenderIf(
                      invoice.category == "a",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                       
                        {item.unitPriceA}
                      </DataTable.Cell>
                    )}
                    {AppRenderIf(
                      invoice.category == "b",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                    
                        {item.unitPriceB}
                      </DataTable.Cell>
                    )}
                    {AppRenderIf(
                      invoice.category == "c",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                       
                        {item.unitPriceC}
                      </DataTable.Cell>
                    )}
                    <DataTable.Cell
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {AppRenderIf(
                        invoice.category == "a",
                        <TextInput
                          placeholder={"" + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceA),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                      {AppRenderIf(
                        invoice.category == "b",
                        <TextInput
                          placeholder={"ප්‍රමාණය: " + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceB),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                      {AppRenderIf(
                        invoice.category == "c",
                        <TextInput
                          placeholder={"ප්‍රමාණය: " + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceC),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      <Button
                        mode="contained"
                        icon="plus-circle"
                        // color={Colors.red500}
                        size={20}
                        onPress={() => {
                          createInvoice();
                          onToggleSnackBar();
                          updateStock();
                        }}
                      >
                        Add
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                </>
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
