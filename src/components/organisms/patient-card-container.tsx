import { useFetchUser } from "../../hooks/use-fetch-user";
import { PatientCard } from "./patient-card";

type Props = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PatientCardContainer = ({ setIsUpdate }: Props) => {
  const { data } = useFetchUser();
  return <PatientCard data={data} setIsUpdate={setIsUpdate} />;
};
