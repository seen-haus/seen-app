import WalletConnectConnector from "@/connectors/walletconnect-connector";
import InjectedConnector from "@/connectors/injected-connector";
import LatticeConnector from "@/connectors/lattice-connector";
import PortisConnector from "@/connectors/portis-connector";
import WalletLinkConnector from "@/connectors/walletlink-connector";
import FormaticConnector from "@/connectors/formatic-connector";

const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

export const walletConnect = new WalletConnectConnector({
    rpc: {1: process.env.VUE_APP_NETWORK_URL},
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

// mainnet only
export const lattice = new LatticeConnector({
    chainId: 1,
    url: process.env.VUE_APP_NETWORK_URL,
    appName: process.env.VUE_APP_NAME
});

// mainnet only
export const portis = new PortisConnector({
    dAppId: process.env.VUE_APP_PORTIS_ID ?? '',
    networks: [1]
});

// mainnet only
export const walletlink = new WalletLinkConnector({
    url: process.env.VUE_APP_NETWORK_URL,
    appName: process.env.VUE_APP_NAME,
    appLogoUrl:
        'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
});

export const fortmatic = new FormaticConnector({
  apiKey: process.env.VUE_APP_FORMATIC_KEY ?? '',
  chainId: 1
});

export default {
    walletConnect,
    injected,
    lattice,
    portis,
    walletlink,
    fortmatic
};
