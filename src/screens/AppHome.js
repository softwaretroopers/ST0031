import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableNativeFeedback,
} from "react-native";
import {
  Button,
  Avatar,
  Title,
  Caption,
  Dialog,
  Portal,
  Paragraph,
  FAB,
  Provider,
} from "react-native-paper";

import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

function AppHome(props) {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [Invoices, setInvoices] = React.useState([]);

  const invoiceRef = firebase.firestore().collection("invoices");

  React.useEffect(() => {
    invoiceRef.onSnapshot(
      (querySnapshot) => {
        const newInvoice = [];
        querySnapshot.forEach((doc) => {
          const invoice = doc.data();
          invoice.id = doc.id;
          newInvoice.push(invoice);
        });
        setInvoices(newInvoice);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <FlatList
          data={Invoices}
          keyExtractor={(invoice) => invoice.id}
          renderItem={({ item }) => (
            <TouchableNativeFeedback
              onPress={(values) => {
                props.navigation.navigate("AppInvoice", {
                  invoice: {
                    docID: item.invoiceID,
                    payMethod: item.payMethod,
                    returns: item.returns,
                    shopName: item.shopName,
                    date: item.date,
                  },
                });
              }}
            >
              <View style={styles.invoiceInfoSection}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar.Icon size={40} icon="file-document" />
                    <Title style={{ fontSize: 12 }}>{item.invoiceID}</Title>
                  </View>

                  <View style={{ flexDirection: "column" }}>
                    <Title style={styles.title}>{item.shopName}</Title>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Caption style={styles.caption}>{item.date}</Caption>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          )}
        />
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>නිවේදනය</Dialog.Title>
            <Dialog.Content>
              <Paragraph>ඉන්වොයිසයක් නිකුත් කිරීම තහවුරු කරන්න</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideDialog}
              >
                අවලංගු කරන්න
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  hideDialog(), props.navigation.navigate("AddInvoiceScreens");
                }}
              >
                තහවුරු කරන්න
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <FAB style={styles.fab} icon="plus" onPress={showDialog} />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  screen: { flex: 1 },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  invoiceInfoSection: {
    backgroundColor: AppColors.background,
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
    margin: "1%",
    elevation: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.secondary,
  },
});

export default AppHome;
