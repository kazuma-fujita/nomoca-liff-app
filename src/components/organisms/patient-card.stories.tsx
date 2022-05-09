import type { ComponentStoryObj } from "@storybook/react";
import { User } from "../../hooks/use-fetch-user";
import { PatientCard } from "./patient-card";

const description = `

## Use Case

****

- CLINIC BOTからLIFFアプリを起動する
- LIFFアプリに対してLINE認証を行う
- カメラを起動し診察券を撮影する
- 診察券番号を登録する
- 診察券番号がQRコードとして表示される

	dummy
	dummy

## Specs

## Back Office Ops

`;

type Story = ComponentStoryObj<typeof PatientCard>;

export default { component: PatientCard };

const emptyData: User = {
  patientId: "dummy-ID",
  medicalRecordId: null,
  name: null,
  avatarImageUrl: null,
};

export const Default: Story = {
  args: {
    data: {
      ...emptyData,
      medicalRecordId: "1234",
      name: "佐藤 太郎",
      avatarImageUrl: "https://www.w3schools.com/howto/img_avatar.png",
    },
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const Empty: Story = {
  ...Default,
  args: { data: emptyData },
};
