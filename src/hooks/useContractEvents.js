import useWeb3 from "@/connectors/hooks"
import useCollectableInformation from "@/hooks/useCollectableInformation.js";
import {formatEther, parseEther} from "@ethersproject/units";
import {useV1AuctionContract, useV1NftContract} from "@/hooks/useContract";
import {BigNumber} from "@ethersproject/bignumber";
import {ref} from 'vue';

export default function useContractEvents() {
  const {account, provider} = useWeb3();
  const contractAddress = ref(null);
  const mergedEvents = ref([]);
  const lastBid = ref(null);

  const {
    collectable,
    collectableState,
    price,
    priceUSD,
    items,
    itemsOf,
    progress,
    isCollectableActive,
    isUpcomming,
    // Static
    type,
    media,
    // firstMedia,
    gallerySortedMedia,
    artist,
    title,
    description,
    events,
    startsAt,
    endsAt,
    liveStatus,
    is_sold_out,
    edition,
    edition_of,
    isTangible,
    isNft,
    isAuction,
    version,
    // Methods
    updateProgress,
    setCollectable,
    // updateInformation,
    // updateCollectableState,
  } = useCollectableInformation();

  const bid = async () => {
    // 1. get new contract
    if (contractAddress.value) return; // do toastr
    let contract = useV1AuctionContract(contractAddress.value, true)
    let amount = 1 // 1 ETH
    const gasPrice = await provider.getGasPrice();
    amount = parseEther((new BigNumber(amount)).toString())
    let tx = contract.bid(amount, {gasPrice})
    await tx.wait()
  }

  // If click on buy
  const buy = async () => {
    // 1. get new contract
    if (contractAddress.value) return; // do toastr
    let contract = useV1NftContract(contractAddress.value, true)
    let qty = (new BigNumber(1)) // 1 ETH
    const gasPrice = await provider.getGasPrice();
    const price = 1; // 1ETH
    let value = parseEther(qty * price);
    let tx = contract.buy(qty.toString(), {gasPrice, value, from: account.value})
    await tx.wait()
  }

  const initializeContractEvents = async (collectableData) => {
    setCollectable(collectableData);
    contractAddress.value = collectableData.contract_address;
    mergedEvents.value = collectableData.events;
    // !! IMPORTANT !! remove listeners on beforeDestroy

    // ============= IF is AUCTION =============
    if (isAuction.value) {
      // EXAMPLE https://etherscan.io/address/0xCEDC9a3c76746F288C87c0eBb0468A1b57484cb1#readContract
      if (version.value === 1) {
        console.log(contractAddress.value)
        let contract = useV1AuctionContract(contractAddress.value)
        // last bid
        lastBid.value = await contract.lastBid()
        console.log("lastBid in ETH ", formatEther(lastBid.value))

        // End Auction date
        let auctionLength = await contract.auctionLength()
        let startBidTime = await contract.startBidTime()
        console.log("ENDS auctionLength + startBidTime", auctionLength.toString(), startBidTime.toString())

        // End Subscribe to event
        await contract.on("Bid", (evt) => {
          // Handle bid event: add to events, check/update end time, update min bid!
        })
        // !! DONT FORGET !! await contract.off("Bid") https://docs.ethers.io/v5/api/contract/contract/#Contract-on
        // Get past bids
        // log_cab346fb
        // log_1e644af9
        let bids = await contract.queryFilter("Bid");
        console.log("==== PAST EVENTS START ==== ")
        bids.forEach(async (bid) => {
          var trx = await bid.getTransaction();
          var trxRec = await bid.getTransactionReceipt();
          let decodedEvent = bid.decode(bid.data, bid.topics);
          console.log(bid, trx, trxRec);
          // Map the event to current structure
          // The same event will cale through event listener
          let evt = bid.decode(bid.data, bid.topics)
          console.log("BIDDER", evt.who)
          console.log("Bid amount", formatEther(evt.amount))
        });
        console.log("==== PAST EVENTS END ====")

      }

      if (version.value === 2) {
        console.log("VERSION v2")
      }

      // ============= IF is SALE =============
    } else {

      if (version.value === 1) {
        // useV1TangibleContract
        console.log(contractAddress.value)
        let contract = useV1NftContract(contractAddress.value)
        let start = await contract.start()
        let price = await contract.price()
        let supply = await contract.supply()
        //
        console.log("START TIME ", start)
        console.log("PRICE ", price)
        console.log("SUPPLY LEFT ", supply)
        await contract.on("Buy", (evt) => {
          // Handle bid event: check SUPPLY LEFT, add evt to Events (same decoding process as auction)
        })

        let buys = await contract.queryFilter("Buy")
        console.log("==== PAST EVENTS START ==== ")
        buys.forEach(async (buy) => {
          let decodedEvent = buy.decode(buy.data, buy.topics);
          // Map the event to current structure
          // The same event will cale through event listener
          let evt = buy.decode(buy.data, buy.topics)
          console.log("buyer", evt.buyer)
          console.log("Qty ", evt.amount.toString())
          console.log("Price in ETH ", formatEther((price * (parseInt(evt.amount))).toString()))
          console.log("==== PAST EVENTS END ==== ")
        });

      }
      if (version.value === 2) {
        console.log("VERSION v2")
      }

    }

    return true;
  };

  return {
    mergedEvents,
    lastBid,
    initializeContractEvents,
    bid,
    buy,
  };
}
