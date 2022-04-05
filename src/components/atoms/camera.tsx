import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import Amplify from "aws-amplify";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Buffer } from "buffer";
import { LegacyRef } from "react";

// @ts-ignore
window.Buffer = Buffer;

const videoConstraints = {
  // width: 720,
  // height: 360,
  facingMode: "user",
};

type Props = {
  webcamRef?: LegacyRef<Webcam> | undefined;
  imageUrl: string | null;
};

export const Camera = ({ webcamRef, imageUrl }: Props) => {
  return (
    <>
      {imageUrl ? (
        <>
          <div>
            {/* <img src={imageUrl} alt="Screenshot" width={540} height={360} /> */}
            <img src={imageUrl} alt="Screenshot" />
          </div>
        </>
      ) : (
        <>
          <div>
            <Webcam
              audio={false}
              // width={540}
              // height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
        </>
      )}
    </>
  );
};
