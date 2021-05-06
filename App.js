import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import AppColors from "./src/configs/AppColors";
import { firebase } from "./src/configs/Database";

import AppLogin from "./src/screens/AppLogin";
import AppHome from "./src/screens/AppHome";
import AppStock from "./src/screens/AppStock";
import AppShop from "./src/screens/AppShop";
import AppProfile from "./src/screens/AppProfile";
import AppAddShop from "./src/screens/AppAddShop";
import AppAddInvoice from "./src/screens/AppAddInvoice";
import AppAddReturn from "./src/screens/AppAddReturn";

const MainStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const InvoiceStack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: AppColors.primary },
          headerTintColor: AppColors.background,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {user ? (
          <MainStack.Screen name="HomeNav" options={{ headerShown: false }}>
            {(props) => <HomeNav {...props} extraData={user} />}
          </MainStack.Screen>
        ) : (
          <MainStack.Screen
            component={AppLogin}
            name="LoginScreen"
            options={{
              title: "Login",
              headerShown: false,
            }}
          ></MainStack.Screen>
        )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

const HomeNav = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <HomeStack.Screen
      name="TabNav"
      component={TabNav}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="AddInvoiceScreens"
      component={AddInvoiceScreens}
      options={{
        title: "Add Invoice",
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

const TabNav = ({ App }) => (
  <Tab.Navigator
    initialRouteName="HomeScreens"
    activeColor={AppColors.background}
    barStyle={{ backgroundColor: AppColors.primary }}
  >
    <Tab.Screen
      name="HomeScreen"
      component={AppHome}
      options={{
        title: "ඉන්වොයිස",
        tabBarIcon: () => (
          <MaterialCommunityIcons
            name="note-text"
            size={24}
            color={AppColors.background}
          />
        ),
      }}
    />

    <Tab.Screen
      name="StockScreen"
      component={AppStock}
      options={{
        title: "තොග",
        tabBarIcon: () => (
          <MaterialCommunityIcons
            name="package-variant"
            size={24}
            color={AppColors.background}
          />
        ),
      }}
    />
    <Tab.Screen
      name="ShopScreen"
      component={AppShop}
      options={{
        title: "සාප්පු",
        tabBarIcon: () => (
          <MaterialCommunityIcons
            name="store"
            size={24}
            color={AppColors.background}
          />
        ),
      }}
    />

    <Tab.Screen
      name="ProfileScreen"
      component={AppProfile}
      options={{
        title: "සැකසුම්",
        tabBarIcon: () => (
          <MaterialCommunityIcons
            name="tools"
            size={24}
            color={AppColors.background}
          />
        ),
      }}
    ></Tab.Screen>
  </Tab.Navigator>
);

const AddInvoiceScreens = (props) => (
  <InvoiceStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <InvoiceStack.Screen
      name="AddShopScreen"
      component={AppAddShop}
      options={{
        title: "සාප්පුවක් තෝරන්න",
      }}
    />
    <InvoiceStack.Screen
      name="AddInvoiceScreen"
      component={AppAddInvoice}
      options={{
        title: "නව ඉන්වොයිස",
      }}
    />
    <InvoiceStack.Screen
      name="AddReturnScreen"
      component={AppAddReturn}
      options={{
        title: "Deduct Returns",
      }}
    />
  </InvoiceStack.Navigator>
);