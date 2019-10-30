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

    // get the subdomain
    const subdomain = parts.shift()
    console.log('subdomain', subdomain)

    // get the domain name
    const domain = parts.shift()
    console.log('domain', domain)

    return domain
  } catch (e) {
    console.log('failed to parse hostname:', e)
    return false
  }
}
