/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      id
      medicalRecordId
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        medicalRecordId
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const queryPatientsByOwnerSortedCreatedAt = /* GraphQL */ `
  query QueryPatientsByOwnerSortedCreatedAt(
    $owner: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    queryPatientsByOwnerSortedCreatedAt(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        medicalRecordId
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
