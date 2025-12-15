import {string} from 'yup'

export const defaultValidator = (name: string) => string().required(`${name} is required`)
