/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePatient = /* GraphQL */ `
  subscription OnCreatePatient($owner: String) {
    onCreatePatient(owner: $owner) {
      id
      medicalRecordId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdatePatient = /* GraphQL */ `
  subscription OnUpdatePatient($owner: String) {
    onUpdatePatient(owner: $owner) {
      id
      medicalRecordId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeletePatient = /* GraphQL */ `
  subscription OnDeletePatient($owner: String) {
    onDeletePatient(owner: $owner) {
      id
      medicalRecordId
      createdAt
      updatedAt
      owner
    }
  }
`;
