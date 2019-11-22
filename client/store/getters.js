// this software package
export const pkg = state => state.pkg
export const app = state => state.app
// what kind of device is viewing this website
export const device = state => state.app.device
export const effect = state => state.app.effect
// is this a cisco.com address? assume dcloud
export const isDcloud = (state, getters) => getters.domain === 'cisco'
// is this a cxdemo.net address? it is cxdemo
export const isCxdemo = (state, getters) => getters.domain === 'cxdemo'
export const isProduction = state => state.isProduction
export const endpoints = state => state.endpoints
// return domain name part for current user
export const domain = function (state) {
  try {
    // get current hostname of the browser location
    const hostname = window.location.hostname
    // console.log('hostname', hostname)

    // split FQDN into parts
    const parts = hostname.split('.')

    // get the subDomain
    const subDomain = parts.shift()
    console.log('subDomain', subDomain)

    // get the domain name
    const domain = parts.shift()
    console.log('domain', domain)

    return domain
  } catch (e) {
    console.log('failed to parse hostname:', e)
    return false
  }
}
// return domain name part for current user
export const subDomain = function (state) {
  try {
    // get current hostname of the browser location
    const hostname = window.location.hostname
    // console.log('hostname', hostname)

    // split FQDN into parts
    const parts = hostname.split('.')

    // get the subDomain
    const subDomain = parts.shift()
    console.log('subDomain', subDomain)

    return subDomain
  } catch (e) {
    console.log('failed to parse hostname:', e)
    return false
  }
}
export const datacenter = function (state, getters) {
  try {
    const parts = getters.subDomain.split('-')
    if (parts.length === 4) {
      // dcloud-collab-toolbox-rtp
      return parts.pop().toUpperCase()
    } else {
      // localhost probably
      return 'DEV'
    }
  } catch (e) {
    console.log('could not parse datacenter from subDomain', getters.subDomain, ':', e.message)
    // return DEV I guess
    return 'DEV'
  }
}
