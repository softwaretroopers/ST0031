import React, { useCallback } from "react";
import { View, StyleSheet, StatusBar, Linking } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Title,
} from "react-native-paper";

import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppProfile(props) {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handlePress = useCallback(async () => {
    await Linking.openURL("tel:+94717827878");
  }, []);
  const handleEmailPress = useCallback(async () => {
    await Linking.openURL("mailto: support@expo.io");
  }, []);

  return (
    <Provider>
      <View>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.accountTop}>
          <Avatar.Image
            size={80}
            source={require("../assets/adaptive-icon.png")}
            style={{ margin: "2%", backgroundColor: "white" }}
          />
          <View style={{ flexDirection: "row" }}>
            <Chip style={{ margin: "3%" }} icon="phone" onPress={handlePress}>
              දුරකතන අංකය
            </Chip>
            <Chip
              style={{ margin: "3%" }}
              icon="email"
              onPress={handleEmailPress}
            >
              විද්‍යුත් තැපෑල
            </Chip>
          </View>

          <Button
            style={{ marginVertical: "5%" }}
            mode="contained"
            icon="logout"
            color={AppColors.primary}
            onPress={() => {
              firebase
                .auth()
                .signOut()
                .then(
                  () => {
                    showDialog();
                  },
                  function (error) {}
                );
            }}
          >
            ඉවත් වන්න
          </Button>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>නිවේදනය</Dialog.Title>
            <Dialog.Content>
              <Paragraph>ඉවත් වීම සාර්ථකයි</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>හරි</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  accountTop: {
    backgroundColor: AppColors.background,
    borderRadius: 20,
    margin: "2%",
    padding: "2%",
    alignItems: "center",
    elevation: 10,
  },
  accountMiddle: {
    padding: 20,
  },
  accountMiddleDetail: {
    marginTop: 20,
    marginLeft: 50,
    marginRight: 50,
    borderBottomWidth: 1,
    fontWeight: "bold",
  },
  accountBottom: {
    marginTop: 30,
    marginLeft: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "18%",
    height: 30,
    marginLeft: "40%",
  },
  title: {
    marginTop: 20,
    marginLeft: 10,
  },
});

export default AppProfile;
