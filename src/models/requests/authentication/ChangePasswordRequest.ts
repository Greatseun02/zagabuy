export type ChangePasswordRequest = {
    oldPassword?: string,
    userPassword: string,
    username?: string
}

export const changePasswordRequestInit = {
    oldPassword: "",
    userPassword: "",
    username: "",
}
