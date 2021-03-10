import { Web3Provider } from '@ethersproject/providers';

/**
 *
 * @param provider
 * @return {Web3Provider}
 */
export default function getLibrary(provider) {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}
