import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import {
  DataTable,
  Text,
  Title,
  Appbar,
  Caption,
  Divider,
} from "react-native-paper";
import { firebase } from "../configs/Database";

function AppInvoice({ route, navigation }) {
  const { invoice } = route.params;

  const [InvoiceItem, setInvoiceItems] = React.useState([]);

  const invoiceItemRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID)
    .collection("invItems");

  React.useEffect(() => {
    invoiceItemRef.onSnapshot(
      (querySnapshot) => {
        const newInvoiceItem = [];
        querySnapshot.forEach((doc) => {
          const invoiceItem = doc.data();
          invoiceItem.id = doc.id;
          newInvoiceItem.push(invoiceItem);
        });
        setInvoiceItems(newInvoiceItem);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const [ReturnItems, setReturnItems] = React.useState([]);

  const returnItemsRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID)
    .collection("returnItems");

  React.useEffect(() => {
    returnItemsRef.onSnapshot(
      (querySnapshot) => {
        const newReturnItems = [];
        querySnapshot.forEach((doc) => {
          const returnItems = doc.data();
          returnItems.id = doc.id;
          newReturnItems.push(returnItems);
        });
        setReturnItems(newReturnItems);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <ScrollView>
      <Appbar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="ඉන්වොයිසය" subtitle={invoice.docID} />
      </Appbar>
      <View style={{ paddingBottom: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: "2%",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Caption>ඉන්වොයිසය : {invoice.docID}</Caption>
            <Caption>දිනය : {invoice.date.toString()}</Caption>
            <Caption>සාප්පුව : {invoice.shopName}</Caption>
          </View>
        </View>
        <Divider />
        <DataTable>
          <DataTable.Header>
            <DataTable.Cell>ගෙවීමේ ක්‍රමය :</DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={{ textTransform: "capitalize" }}>
                {invoice.payMethod}
              </Text>
            </DataTable.Cell>
          </DataTable.Header>
        </DataTable>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>භාණ්ඩ</DataTable.Title>
            <DataTable.Title numeric>ඒකක මිල</DataTable.Title>
            <DataTable.Title numeric>ප්‍රමාණය</DataTable.Title>
            <DataTable.Title numeric>මිල</DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={InvoiceItem}
            keyExtractor={(invoice) => invoice.id}
            renderItem={({ item }) => (
              <DataTable.Row>
                <DataTable.Cell>{item.itemName}</DataTable.Cell>
                <DataTable.Cell numeric>Rs.{item.unitPrice}</DataTable.Cell>
                <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                <DataTable.Cell numeric>
                  Rs.{item.unitPrice * item.quantity}
                </DataTable.Cell>
              </DataTable.Row>
            )}
          />
        </DataTable>
        <Title
          style={{
            fontWeight: "bold",
            fontSize: 16,
            alignSelf: "flex-end",
            marginEnd: "3.5%",
          }}
        >
          මුළු මුදල : Rs.{invoice.total}
        </Title>
        <Divider />
        <DataTable>
          <DataTable.Header>
            <DataTable.Cell style={{ justifyContent: "center" }}>
              ආපසු භාරගැනීම්
            </DataTable.Cell>
          </DataTable.Header>
        </DataTable>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>භාණ්ඩ</DataTable.Title>
            <DataTable.Title numeric>ඒකක මිල</DataTable.Title>
            <DataTable.Title numeric>ප්‍රමාණය</DataTable.Title>
            <DataTable.Title numeric>මිල</DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={ReturnItems}
            keyExtractor={(invoice) => invoice.id}
            renderItem={({ item }) => (
              <DataTable.Row>
                <DataTable.Cell>{item.itemName}</DataTable.Cell>
                <DataTable.Cell numeric>Rs.{item.unitPrice}</DataTable.Cell>
                <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                <DataTable.Cell numeric>
                  Rs.{item.unitPrice * item.quantity}
                </DataTable.Cell>
              </DataTable.Row>
            )}
          />
        </DataTable>
        <Title
          style={{
            fontWeight: "bold",
            fontSize: 16,
            alignSelf: "flex-end",
            marginEnd: "3.5%",
          }}
        >
          මුළු ආපසු භාරගැනීම්: Rs.{invoice.returns}
        </Title>
        <Divider />
        <Title
          style={{
            fontWeight: "bold",
            fontSize: 16,
            alignSelf: "flex-end",
            marginEnd: "3.5%",
          }}
        >
          ආපසු භාරගැනීම් අඩු කල පසු මුළු මුදල: Rs.{invoice.returns}
        </Title>
      </View>
    </ScrollView>
  );
}

export default AppInvoice;
