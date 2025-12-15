export type CompletePasswordResetRequest = {
    otp: string,
    userEmail: string
    userPassword: string
}

export const completePasswordResetRequestInit: CompletePasswordResetRequest = {
    otp: "",
    userEmail: "",
    userPassword: ""
}
