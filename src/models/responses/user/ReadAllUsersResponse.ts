export type ReadAllUsersResponse = {
    data:
        {
            userCreatedAt: string,
            userEmail: string,
            userFirstName: string,
            userId: number,
            userLastName: string,
            userPassword: string,
            userPhoneNumber: string,
            userRoleId: number,
            userStatus: string,
            userUpdatedAt: string
        }[],
    responseCode: string,
    responseMessage: string
}
