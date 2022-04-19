import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useAnalyzePicture } from "./use-analyze-picture";

const getCaptureDescription = (
  error: Error | null,
  isLoading: boolean,
  captureImage: string | null,
  analyzedNumbers: string[],
  isCaptureEnable: boolean
) => {
  let description = "カメラを起動して診察券番号を読み取ってください。";
  if (error) {
    description = "エラーが発生しました。";
  } else if (isLoading) {
    description = "読込中です。";
  } else if (captureImage && analyzedNumbers.length) {
    description = "診察券番号を選択してください。";
  } else if (captureImage && !analyzedNumbers.length) {
    description = "診察券を読み取れませんでした。";
  } else if (isCaptureEnable) {
    description =
      "診察券番号が書いてある面をカメラに向けて読み取るボタンをタップしてください。";
  }

  let icon = CheckIcon;
  if (error || (!isLoading && captureImage && !analyzedNumbers.length)) {
    icon = CloseIcon;
  }
  return { captureResultIcon: icon, captureResultDescription: description };
};

const getCaptureButtonLabel = (
  captureImage: string | null,
  isCaptureEnable: boolean
) => {
  let label = "カメラを起動する";
  if (captureImage) {
    label = "診察券番号を再度読み取る";
  } else if (isCaptureEnable) {
    label = "診察券番号を読み取る";
  }
  return { captureButtonLabel: label };
};

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

  const { captureResultIcon, captureResultDescription } = getCaptureDescription(
    error,
    isLoading,
    captureImage,
    analyzedNumbers,
    isCaptureEnable
  );

  const { captureButtonLabel } = getCaptureButtonLabel(
    captureImage,
    isCaptureEnable
  );

  return {
    webcamRef,
    isCaptureEnable,
    isLoading,
    error,
    captureImage,
    analyzedNumbers,
    captureResultIcon,
    captureResultDescription,
    captureButtonClickHandler,
    captureButtonLabel,
    resetState,
  };
};
