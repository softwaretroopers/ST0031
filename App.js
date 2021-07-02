import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppColors from "./src/configs/AppColors";
import { firebase } from "./src/configs/Database";

import AppLogin from "./src/screens/AppLogin";
import AppHome from "./src/screens/AppHome";
import AppStock from "./src/screens/AppStock";
import AppShop from "./src/screens/AppShop";
import AppProfile from "./src/screens/AppProfile";
import AppSelectShop from "./src/screens/AppSelectShop";
import AppAddInvoice from "./src/screens/AppAddInvoice";
import AppAddReturn from "./src/screens/AppAddReturn";
import AppInvoice from "./src/screens/AppInvoice";
import AppSelectRoute from "./src/screens/AppSelectRoute";
import AppRoute from "./src/screens/AppRoute";
import AppCategory from "./src/screens/AppCategory";
import AppAddInvoiceCtg from "./src/screens/AppAddInvoiceCtg"

const MainStack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const InvoiceStack = createStackNavigator();
const shopStack = createStackNavigator();
const StockStack = createStackNavigator();

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
      name="AppInvoice"
      component={AppInvoice}
      options={{
        title: "Invoice Details",
        headerShown: false,
      }}
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
      name="StockScreens"
      component={StockScreens}
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
      name="ShopScreens"
      component={ShopScreens}
      options={{
        title: "ප්‍රදේශ",
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
      name="AddRouteScreen"
      component={AppSelectRoute}
      options={{
        title: "ප්‍රදේශය තෝරන්න",
      }}
    />
    <InvoiceStack.Screen
      name="AddShopScreen"
      component={AppSelectShop}
      options={{
        title: "සාප්පුවක් තෝරන්න",
        headerShown:false,
      }}
    />
    <InvoiceStack.Screen
      name="AddInvoiceScreen"
      component={AppAddInvoice}
      options={{
        title: "නව ඉන්වොයිස",
        headerShown: false,
      }}
    />
      <InvoiceStack.Screen
      name="AddInvoiceCtgScreen"
      component={AppAddInvoiceCtg}
      options={{
        title: "නව ඉන්වොයිස",
        headerShown: false,
      }}
    />
    <InvoiceStack.Screen
      name="AddReturnScreen"
      component={AppAddReturn}
      options={{
        title: "Deduct Returns",
        headerShown: false,
      }}
    />
  </InvoiceStack.Navigator>
);

const ShopScreens = (props) => (
  <shopStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <shopStack.Screen
      name="RouteScreen"
      component={AppRoute}
      options={{
        title: "ප්‍රදේශය තෝරන්න",
        headerShown:false,
      }}
    />
    <shopStack.Screen
      name="ShopScreen"
      component={AppShop}
      options={{
        title: "සාප්පුවක් තෝරන්න",
        headerShown: false,
      }}
    />
  </shopStack.Navigator>
);

const StockScreens = (props) => (
  <StockStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <StockStack.Screen
      name="CategoryScreen"
      component={AppCategory}
      options={{
        title: "සාප්පුවක් තෝරන්න",
        headerShown: false,
      }}
    />
    <StockStack.Screen
      name="StockScreen"
      component={AppStock}
      options={{
        title: "ප්‍රදේශය තෝරන්න",
        headerShown:false,
      }}
    />
  </StockStack.Navigator>
);
