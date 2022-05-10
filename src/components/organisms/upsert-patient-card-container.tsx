import { useCallback } from "react";
import { useCaptureImage } from "../../hooks/use-capture-image";
import { useFetchUser } from "../../hooks/use-fetch-user";
import { useUpsertPatient } from "../../hooks/use-upsert-patient";
import { UpsertPatientCard } from "./upsert-patient-card";

type Props = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpsertPatientCardContainer = ({ setIsUpdate }: Props) => {
  const { data } = useFetchUser();

  const {
    webcamRef,
    isCaptureEnable,
    isLoading: isCaptureLoading,
    error: captureError,
    captureImage,
    analyzedNumbers,
    captureButtonClickHandler,
    resetState: resetCaptureState,
  } = useCaptureImage();

  const {
    upsertPatient,
    isLoading: isUpsertLoading,
    error: upsertError,
    resetState: resetUpsertState,
  } = useUpsertPatient();

  const resetState = useCallback(() => {
    resetCaptureState();
    resetUpsertState();
    setIsUpdate(false);
  }, [resetCaptureState, resetUpsertState, setIsUpdate]);

  return (
    <UpsertPatientCard
      data={data}
      webcamRef={webcamRef}
      isCaptureEnable={isCaptureEnable}
      isCaptureLoading={isCaptureLoading}
      captureError={captureError}
      captureImage={captureImage}
      analyzedNumbers={analyzedNumbers}
      captureButtonClickHandler={captureButtonClickHandler}
      upsertPatient={upsertPatient}
      isUpsertLoading={isUpsertLoading}
      upsertError={upsertError}
      resetState={resetState}
    />
  );
};
