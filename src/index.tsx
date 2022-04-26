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

console.log("env:", process.env.NODE_ENV);

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

serviceWorker.unregister();

reportWebVitals();
