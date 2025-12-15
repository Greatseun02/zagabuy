export type CompleteEnrollmentRequest = {
    userEmail: string,
    userPassword: string,
    userPasswordConfirmation: string
}
export const completeEnrollmentRequestInit = {
    userEmail: "",
    userPassword: "",
    userPasswordConfirmation: ""
}
