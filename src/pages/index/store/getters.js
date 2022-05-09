const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  account: state => state.user.account,
  roles: state => state.user.roles,
	principal: state => state.user.principal,
  user: state => state.user.detail,
	addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
}
export default getters