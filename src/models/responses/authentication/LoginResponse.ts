export type LoginResponse = {
  businesses: {
    businessAddressCountry: string;
    businessAddressPostalCode: string;
    businessAddressStreetName: string;
    businessAnnualTurnover: string;
    businessCityName: string;
    businessCreatedAt: string;
    businessCustomSettings: string;
    businessDescription: string;
    businessEntityId: number;
    businessErpSystem: string;
    businessFirsId: string;
    businessId: number;
    businessIrnTemplate: string;
    businessNotificationChannels: string;
    businessPartyName: string;
    businessReference: string;
    businessSector: string;
    businessStatus: string;
    businessSupportPeppol: boolean;
    businessTelephone: string;
    businessTin: string;
    businessUpdatedAt: string;
  }[];
  entityCompanyName: string;
  entityCustomSettings: string;
  entityFirsId: string;
  entityId: string;
  entityPostalAddressCityName: string;
  entityPostalAddressCountry: string;
  entityPostalAddressLga: string;
  entityPostalAddressPostalCode: string;
  entityPostalAddressState: string;
  entityPostalAddressStreetName: string;
  entityRcNumber: string;
  entityReference: string;
  entitySector: string;
  entityTin: string;
  privileges: string[];
  responseCode: string;
  responseMessage: string;
  token: string;
  userCreatedAt: string;
  userEmail: string;
  userFirstName: string;
  userId: number;
  userLastName: string;
  userPhoneNumber: string;
  userRoleName: string;
  userRoleId: number;
  userStatus: string;
  userUpdatedAt: string;
};
//     {
//     entityCompanyName: string,
//     entityCustomSettings: string,
//     entityId: string,
//     entityOwnerId: string,
//     entityPostalAddressCityName: string,
//     entityPostalAddressCountry: string,
//     entityPostalAddressLga: string,
//     entityPostalAddressPostalCode: string,
//     entityPostalAddressState: string,
//     entityPostalAddressStreetName: string,
//     entityRcNumber: string,
//     entityReference: string,
//     entitySector: string,
//     entityTin: string,
//     privileges: string[],
//     responseCode: string,
//     responseMessage: string,
//     token: string,
//     userCreatedAt: string,
//     userEmail: string,
//     userFirstName: string,
//     userId: number,
//     userLastName: string,
//     userPhoneNumber: string,
//     userRoleId: number,
//     userStatus: string,
//     userUpdatedAt: string
// }
