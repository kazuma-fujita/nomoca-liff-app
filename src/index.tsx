import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import { ColorModeScript } from "@chakra-ui/react";
import Amplify, { AWSCloudWatchProvider, Logger } from "aws-amplify";
import * as React from "react";
import ReactDOM from "react-dom";
import UUID from "uuidjs";
import { App } from "./App";
import awsconfig from "./aws-exports";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

// Buffer is not define error対策
// @ts-ignore
// window.Buffer = Buffer;

const loggerPrefix = "nomoca-liff-app-logger";
const appName = "nomoca-liff-app";
const logStreamName = UUID.generate(); // ユニークなID

// sends Amplify logs to Cloud Watch
Amplify.configure({
  Logging: {
    logGroupName: `/${loggerPrefix}/${appName}/${process.env.NODE_ENV}`,
    logStreamName: logStreamName,
  },
  ...awsconfig,
});

// uses an Amplify Predictions category such as AI/ML
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const logLevel = process.env.REACT_APP_LOG_LEVEL as string; //どのレベルのログまでロギングするか
export const logger = new Logger("Logger", logLevel);
Amplify.register(logger);
logger.addPluggable(new AWSCloudWatchProvider());

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
