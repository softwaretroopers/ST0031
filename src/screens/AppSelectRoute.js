import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableNativeFeedback,
} from "react-native";
import {
  Title,
  Caption,
  Avatar,
  Provider,
  Searchbar,
  Dialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";

function AppSelectRoute(props) {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const [shops, setShops] = useState([]);
  const invoiceId = Date.now().toString();

  const shopRef = firebase.firestore().collection("route");

  useEffect(() => {
    shopRef.onSnapshot(
      (querySnapshot) => {
        const newShops = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newShops.push(shop);
        });
        setShops(newShops);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  //create invoice
  const dbRef = firebase.firestore();

  const createInvoice = () => {
    {
      const data = {
        invoiceID: invoiceId,
      };
      dbRef
        .collection("invoices")
        .doc(invoiceId)
        .set(data)
        .catch((error) => {
          alert(error);
        });
    }
  };

    //search
    const shopeRef = firebase.firestore().collection("route");
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
  
    React.useEffect(() => {
      shopeRef.onSnapshot(
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
          const itemData = item.name
            ? item.name.toUpperCase()
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
    <Provider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.text}>ඉන්වොයිසය නිකුත් කරන ප්‍රදේශය තෝරන්න</Text>
        </View>
        <Searchbar
        style={{marginTop:"1%",marginBottom:"5%",borderRadius: 10,marginLeft:"6%",marginRight:"6%"}}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction('')}
        placeholder="ප්‍රදේශය සොයන්න"
        value={search}
      />
         <View
          style={[
            styles.footer,
            {
              backgroundColor: AppColors.background,
            },
          ]}
        > 
          <View>
            <FlatList
              data={filteredDataSource}
              keyExtractor={(shop) => shop.id.toString()}
              renderItem={({ item }) => (
              
                <TouchableNativeFeedback
                  onPress={(values) => {
                    createInvoice(),
                      props.navigation.navigate("AddShopScreen", {
                        area: {
                          name: item.name,
                        },
                      });
                  }}
                >
                  <View style={styles.card}>
                    <Avatar.Icon size={40} icon="road-variant" />
                    <Title style={styles.title}>{item.name}</Title>
                  </View>
                </TouchableNativeFeedback>
              
              )
            
            }
            />
          </View>
        </View>
      </View>
    </Provider>
  );
}

export default AppSelectRoute;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },
  footer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginTop: "5%",
  },
  forget: {
    color: AppColors.primaryVariant,
    fontSize: 16,
    marginTop: "3%",
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    color: AppColors.background,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
