// this software package
export const pkg = state => state.pkg
export const app = state => state.app
// what kind of device is viewing this website
export const device = state => state.app.device
export const effect = state => state.app.effect
export const isCxdemo = function (state) {
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

    // get the TLD
    // const tld = parts.shift()
    // console.log('tld', tld)

    // return true for cxdemo.net, false for cisco.com
    return part2 === 'cxdemo'
  } catch (e) {
    console.log('failed to parse hostname:', e)
    return false
  }
}
