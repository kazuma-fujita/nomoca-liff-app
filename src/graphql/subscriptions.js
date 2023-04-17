/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onCreatePatient(filter: $filter, owner: $owner) {
      id
      medicalRecordId
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onUpdatePatient(filter: $filter, owner: $owner) {
      id
      medicalRecordId
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient(
    $filter: ModelSubscriptionPatientFilterInput
    $owner: String
  ) {
    onDeletePatient(filter: $filter, owner: $owner) {
      id
      medicalRecordId
      owner
      createdAt
      updatedAt
    }
  }
`;
