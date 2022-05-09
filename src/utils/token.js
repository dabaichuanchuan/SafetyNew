import Cookies from 'js-cookie'

const TokenKey = 'AccessTokenTest'

export function getToken() {
  const data = Cookies.get(TokenKey)
  return data ? JSON.parse(data) : {}
}

export function existsToken() {
  const data = Cookies.get(TokenKey)
  return !!data
}

export function setToken(token) {
  if(!token) return
  return Cookies.set(TokenKey, JSON.stringify(token))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
