import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

import {
  setJSExceptionHandler,
  getJSExceptionHandler,
} from "react-native-exception-handler";

//=================================================
// ADVANCED use case:
const exceptionhandler = (error, isFatal) => {
  console.error(error, isFatal);
  // your error handler function
};
setJSExceptionHandler(exceptionhandler, false);
// - exceptionhandler is the exception handler function
// - allowInDevMode is an optional parameter is a boolean.
//   If set to true the handler to be called in place of RED screen
//   in development mode also.

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
