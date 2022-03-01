/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export default function uriToHttp(uri) {
    const protocol = uri.split(':')[0].toLowerCase()
    switch (protocol) {
        case 'https':
            return [uri]
        case 'http':
            return ['https' + uri.substr(4), uri]
        case 'ipfs':
            // eslint-disable-next-line no-case-declarations
            let hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
            return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`, `https://seenhaus.mypinata.cloud/ipfs/${hash}/`]
        case 'ipns':
            // eslint-disable-next-line no-case-declarations
            let name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
            return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`]
        default:
            return []
    }
}
