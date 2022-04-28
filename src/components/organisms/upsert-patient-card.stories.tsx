import type { ComponentStoryObj } from "@storybook/react";
import { useCallback } from "react";
import { useCaptureImage } from "../../hooks/use-capture-image";
import { User } from "../../hooks/use-fetch-user";
import { useUpsertPatient } from "../../hooks/use-upsert-patient";
import { Props, UpsertPatientCard } from "./upsert-patient-card";

const description = `

## Use Case

description

	dummy
	dummy

## Specs

## Back Office Ops

`;

const Wrapper: React.FC<Props> = (props) => {
  const data: User = {
    patientId: "dummy-ID",
    medicalRecordId: null,
    name: null,
    avatarImageUrl: null,
  };

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
    // setIsUpdate(false);
  }, [resetCaptureState, resetUpsertState]);

  return (
    <UpsertPatientCard
      data={data}
      webcamRef={webcamRef}
      isCaptureEnable={isCaptureEnable}
      isCaptureLoading={props.isCaptureLoading ?? isCaptureLoading}
      captureError={props.captureError ?? captureError}
      captureImage={props.captureImage ?? captureImage}
      analyzedNumbers={analyzedNumbers}
      captureButtonClickHandler={captureButtonClickHandler}
      upsertPatient={upsertPatient}
      isUpsertLoading={props.isUpsertLoading ?? isUpsertLoading}
      upsertError={props.upsertError ?? upsertError}
      resetState={resetState}
    />
  );
};

type Story = ComponentStoryObj<typeof Wrapper>;

export default { component: Wrapper };

export const Default: Story = {
  // args: { data: orderListMock },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Loading: Story = {
  ...Default,
  args: { isCaptureLoading: true, isUpsertLoading: true, captureImage: "" },
};

// export const ErrorOccurred: Story = {
//   ...Default,
//   args: {
//     captureError: Error("A error occurred during to capture image."),
//     upsertError: Error("It was returned null after the API had fetched data."),
//   },
// };
