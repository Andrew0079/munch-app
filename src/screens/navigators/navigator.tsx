import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./main-navigator";
import AuthNavigator from "./auth-navigator";
// @ts-ignore
import { ActivityIndicator, Modal, Alert } from "@components";
// @ts-ignore
import { api } from "@api/api";
import { Recipe } from "../main";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/user-slice";
import { ROUTES } from "../../utils/common";
import { useSelector } from "react-redux";
import theme from "../../../theme";
import { RootState } from "../../redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/config";
import { setError } from "../../redux/slices/error-slice";
import { setLoading } from "../../redux/slices/loading-slice";

const { Navigator: StackNavigator, Screen } = createStackNavigator();

const commonScreenOptions = {
  headerShown: false,
};

function Navigator() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.value);

  const loading = useSelector((state: RootState) => state.loading.value);
  const error = useSelector(
    (state: RootState) => state.error.value
  ) as unknown as { error: string; visible: boolean } | undefined;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const customUser = firebaseUser as unknown as {
            email: string;
            uid: string;
            stsTokenManager: { accessToken: string };
            displayName: string;
          };
          dispatch(
            setUser({
              email: customUser.email,
              token: customUser.stsTokenManager.accessToken,
              uid: customUser.uid,
              username: customUser.displayName,
              emailVerified: firebaseUser.emailVerified,
            })
          );
        } else {
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const uid = currentUser?.uid;
        const customUserId = currentUser?.customUserId;
        if (uid && !customUserId) {
          const response = await api.getUser(uid);
          const customUserId = response?.id;
          dispatch(setUser({ ...currentUser, customUserId }));
        }
      } catch (error) {
        return;
      }
    };

    if (currentUser?.emailVerified) {
      getUser();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <ActivityIndicator loading={loading} />
        <Modal
          visible={error?.visible}
          onClose={() => {
            dispatch(setLoading(false));
            dispatch(setError({ error: null, visible: false }));
          }}
        >
          <Alert
            backgroundColor="white"
            errorMessage={error?.error}
            onPress={() => {
              dispatch(setLoading(false));
              dispatch(setError({ error: null, visible: false }));
            }}
          />
        </Modal>
        <StackNavigator
          screenOptions={{
            ...commonScreenOptions,
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            <>
              <Screen name={ROUTES.MAIN} component={MainNavigator} />
              <Screen name={ROUTES.RECIPE} component={Recipe} />
            </>
          ) : (
            <Screen name={ROUTES.AUTH} component={AuthNavigator} />
          )}
        </StackNavigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default Navigator;
