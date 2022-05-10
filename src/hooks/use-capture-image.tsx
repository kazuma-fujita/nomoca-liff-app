import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAnalyzePicture } from "./use-analyze-picture";

export const useCaptureImage = () => {
  const {
    analyzePicture,
    analyzedNumbers,
    isLoading,
    error,
    resetAnalyzedData,
  } = useAnalyzePicture();

  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const resetState = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(false);
    resetAnalyzedData();
  }, [resetAnalyzedData]);

  const reLaunchCamera = useCallback(() => {
    setCaptureImage(null);
    setCaptureEnable(true);
    resetAnalyzedData();
  }, [resetAnalyzedData, setCaptureEnable]);

  const toggleLaunchCamera = useCallback(() => {
    setCaptureEnable(!isCaptureEnable);
  }, [isCaptureEnable, setCaptureEnable]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // キャプチャ画像確認用imgタグに値をセット
      setCaptureImage(imageSrc);
      // 画像解析実行
      analyzePicture(imageSrc);
    }
  }, [analyzePicture]);

  const captureButtonClickHandler = useCallback(() => {
    if (captureImage) {
      reLaunchCamera();
    } else if (isCaptureEnable) {
      capture();
    } else {
      toggleLaunchCamera();
    }
  }, [
    capture,
    captureImage,
    isCaptureEnable,
    reLaunchCamera,
    toggleLaunchCamera,
  ]);

  return {
    webcamRef,
    isCaptureEnable,
    isLoading,
    error,
    captureImage,
    analyzedNumbers,
    captureButtonClickHandler,
    resetState,
  };
};
