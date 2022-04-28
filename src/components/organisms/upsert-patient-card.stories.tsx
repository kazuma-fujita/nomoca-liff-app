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
  // args: { isLoading: true },
};

export const Empty: Story = {
  ...Default,
  // args: { isEmptyList: true },
};

export const FetchError: Story = {
  ...Default,
  // args: { error: Error("The API fetched data but it returned null.") },
};
