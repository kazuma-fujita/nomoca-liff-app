import { Buffer } from "buffer";
import { LegacyRef } from "react";
import Webcam from "react-webcam";

// @ts-ignore
window.Buffer = Buffer;

const videoConstraints = {
  width: 320,
  height: 240,
  aspectRatio: 0.7,
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
            <img
              src={captureImage}
              alt="Screenshot"
              // height="27vh"
              // width="330px"
              // width="100%"
              // height={160}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Webcam
              audio={false}
              width={320}
              height={240}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              // style={
              //   {
              //     width: "100%",
              //     height: "27vh",
              //   }
              // }
            />
          </div>
        </>
      )}
    </>
  );
};
