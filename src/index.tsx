import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import { ColorModeScript } from "@chakra-ui/react";
import Amplify, { Auth } from "aws-amplify";
import * as React from "react";
import ReactDOM from "react-dom";
import awsconfig from "./aws-exports";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

// Buffer is not define error対策
// @ts-ignore
window.Buffer = Buffer;

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
// Auth.configure({
//   oauth: {
//     domain: process.env.REACT_APP_COGNITO_DOMAIN,
//     scope: ["profile", "openid", "aws.cognito.signin.user.admin"],
//     redirectSignIn: process.env.REACT_APP_COGNITO_REDIRECT_URL,
//     redirectSignOut: process.env.REACT_APP_COGNITO_REDIRECT_URL,
//     responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
//   },
// });

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
