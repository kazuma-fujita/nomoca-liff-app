import { Buffer } from "buffer";
import { LegacyRef } from "react";
import Webcam from "react-webcam";

// @ts-ignore
window.Buffer = Buffer;

const videoConstraints = {
  // width: 340,
  // height: 226,
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
            {/* <img src={captureImage} alt="Screenshot" width={340} height={226} /> */}
            <img src={captureImage} alt="Screenshot" />
          </div>
        </>
      ) : (
        <>
          <div>
            <Webcam
              audio={false}
              // width={340}
              // height={226}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                width: "100%",
                height: "226px",
                objectFit: "cover",
              }}
            />
          </div>
        </>
      )}
    </>
  );
};
