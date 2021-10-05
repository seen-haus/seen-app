/**
 * Given a URI that may be ipfs, return the IPFS hash for the same content
 * @param uri to convert to IPFS hash
 */
 export default function uriToHash(uri) {
  const protocol = uri.split(':')[0].toLowerCase()
  switch (protocol) {
      case 'ipfs':
          // eslint-disable-next-line no-case-declarations
          let hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
          return hash;
      default:
          return false;
  }
}
