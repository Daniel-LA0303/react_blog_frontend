import useUserAuthContext from "../useUserAuthContext"

export const useSaveSession = () => {
  const { setUserAuth } = useUserAuthContext()

  return (d: any) => {
    localStorage.setItem('token', JSON.stringify(d.accessToken))
    localStorage.setItem('tokenAuthUser', d.accessToken)
    localStorage.setItem('refreshToken', d.refreshToken)
    localStorage.setItem('roles', JSON.stringify(d.roles))
    localStorage.setItem('email', d.email)
    localStorage.setItem('username', d.name)
    localStorage.setItem('userId', d._id)
    localStorage.setItem('profileImage', d.profileImage)
    localStorage.setItem('isFree', d.isFree)
    localStorage.setItem('expiresAt', d.expiresAt)
    localStorage.setItem('plan', JSON.stringify(d.plan))

    setUserAuth({
      userAuthToken: d.accessToken,
      refreshToken: d.refreshToken,
      roles: d.roles,
      username: d.name,
      profileImage: d.profileImage,
      email: d.email,
      userId: d._id,
      isFree: d.isFree,
      expiresAt: d.expiresAt,
      plan: d.plan,
    })
  }
}