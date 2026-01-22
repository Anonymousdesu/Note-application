import { apiClient } from '../api/axiosConfig'

export interface SignupPayload {
  UserName: string
  Password: string
}

export interface LoginPayload {
  UserName: string
  Password: string
}

export async function signup(user: SignupPayload) {
  const response = await apiClient.post('/auth/User/SignUp', user)
  return response.data
}

export async function login(user: LoginPayload) {
  const response = await apiClient.post('/auth/User/LogIn', user)
  return response
}
