export type UpdateUserRequest = {
    userEmail: string,
    userFirstName: string,
    userId: number,
    userLastName: string,
    userPhoneNumber: string,
    userRoleId: number,
    userStatus: string
}
export const updateUserRequestInit: UpdateUserRequest = {
    userEmail: "",
    userFirstName: "",
    userId: 0,
    userLastName: "",
    userPhoneNumber: "",
    userRoleId: 0,
    userStatus: ""
}
