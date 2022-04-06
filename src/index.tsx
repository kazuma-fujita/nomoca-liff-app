import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import { ColorModeScript } from "@chakra-ui/react";
import Amplify from "aws-amplify";
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
