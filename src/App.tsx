import logo from './logo.png'
import './App.css'
import { CombinedError } from 'urql'
import { transfersQuery } from '../.graphclient'

import QRCode from "react-qr-code";
import { useMemo } from 'react';

import { isAddress } from './utils'

import useInput from "./utils/useInput"

import useTheGraph from "./hooks/useTheGraph"
import useRetrieveNFTImages from "./hooks/useRetrieveNFTImages"
import useTransactionsBuilder from "./hooks/useTransactionsBuilder"

function App() {
  // The user inputs their address, an initial improvement would be to access ens names for example
  const [userAddress, setUserAddress] = useInput({ type: "text" });

  const isUserAddressValid = useMemo(() => {
    return userAddress && typeof userAddress === "string" && isAddress(userAddress)
  }, [userAddress])

  const { mintToken } = useTransactionsBuilder()

  // We fetch data from theGraph
  const {
    reexecuteTransfersQuery,
    transfersData,
    transfersFetching,
    transfersError,
  
    reexecuteTransfersOfUserQuery,
    transfersOfUserData,
    transfersOfUserFetching,
    transfersOfUserError
    } = useTheGraph(userAddress)

  // We fetch the NFTs images from the URI
  const { uriToImage } = useRetrieveNFTImages(transfersData, transfersOfUserData)

  // display the images
  const displayNFTs = (payload : { data: transfersQuery | undefined; fetching: boolean; error: CombinedError | undefined; }) => {
    const display : Array<any> = []

    {
      payload.data?.transfers.forEach(transfer => {
        const found = uriToImage.find(element => element.uri === transfer.tokenURI);

        if(found)
          display.push( 
            <p key={transfer.tokenId}>
              <img style={{width: "400px", height:"400px"}} src={found.imageURL} />
              <br />
              <span>DemoNFT #{transfer.tokenId}</span>
            </p>
          )
      })
    } 

    return <>
      <p>{payload.fetching ? 'Loading..' : (payload.error ? 'Something went wrong.' : '')}</p>
      {display}
    </>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Frontend with only a QR code + TheGraph</p>
        <p>Demo for Eyepto, see the tutorial at this link: TODO</p>

        <QRCode style={{border: "white 10px solid"}} value={JSON.stringify(mintToken, null, 0)} />

        <p>
          See your NFTs by inputting your wallet address
          <br />
          {setUserAddress}
        </p>

        <p>{isUserAddressValid ? 'Showing your Demo NFTs' : 'Newest Demo NFTs'}</p>

        {displayNFTs(isUserAddressValid ? 
          {data: transfersOfUserData, fetching: transfersOfUserFetching, error: transfersOfUserError}
          :
          { data: transfersData, fetching: transfersFetching, error: transfersError }
        )}

        <p>
          <button type="button" onClick={() => isUserAddressValid ? reexecuteTransfersOfUserQuery() : reexecuteTransfersQuery()} disabled={transfersFetching}>
            Refresh data
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
