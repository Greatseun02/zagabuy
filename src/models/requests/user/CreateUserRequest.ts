export type CreateUserRequest = {
    userEmail: string,
    userFirstName: string,
    userLastName: string,
    userPhoneNumber: string,
    userRoleId: number
}
export const createUserRequestInit = {
    userEmail: "",
    userFirstName: "",
    userLastName: "",
    userPhoneNumber: "",
    userRoleId: 0
}
