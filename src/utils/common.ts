import { Platform, StatusBar } from "react-native";

const getPlatFormStyle = () =>
  Platform.OS === "android"
    ? { paddingTop: StatusBar.currentHeight }
    : { paddingTop: 0 };

const ROUTES = {
  AUTH: "Auth",
  MAIN: "Main",
  SIGN_IN: "SignIn",
  SIGN_UP: "SignUp",
  SIGN_IN_OR_SIGN_UP: "SignInOrSignUp",
  VERIFICATION: "Verification",
  MAIN_THREAD: "MainThread",
};
export { getPlatFormStyle, ROUTES };
