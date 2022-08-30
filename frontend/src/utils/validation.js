export const validPassword = (password, matchingPassword) => (
    password !== "" && matchingPassword !== "" &&
    password === matchingPassword &&
    password.length >= 8 && password.length <= 20
)

export const regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

export const validEmail = (email) => (
    email !== "" && regEmail.test(email)
)

export const RESEND_PERIOD = 60