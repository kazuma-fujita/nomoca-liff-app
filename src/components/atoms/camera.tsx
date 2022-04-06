import { Buffer } from "buffer";
import { LegacyRef } from "react";
import Webcam from "react-webcam";

// @ts-ignore
window.Buffer = Buffer;

const videoConstraints = {
  // width: 720,
  // height: 360,
  facingMode: "environment", // environment=背面カメラ、user=インナーカメラ
};

type Props = {
  webcamRef?: LegacyRef<Webcam> | undefined;
  captureImage: string | null;
};

export const Camera = ({ webcamRef, captureImage }: Props) => {
  return (
    <>
      {captureImage ? (
        <>
          <div>
            {/* <img src={captureImage} alt="Screenshot" width={540} height={360} /> */}
            <img src={captureImage} alt="Screenshot" />
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