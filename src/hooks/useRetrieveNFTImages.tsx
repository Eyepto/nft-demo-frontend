import { useEffect } from 'react';
import { useImmer } from "use-immer";

import { transfersQuery } from '../../.graphclient'

import { getData } from "../utils"

// use token metadata URI to retrieve images
function App(transfersData: transfersQuery | undefined, transfersOfUserData: transfersQuery | undefined) {
  const [uriToImage, updateUriToImage] = useImmer<Array<{uri: string, imageURL: string}>>([]);

  const addImage = (uri: string, imageURL: string) => {
    updateUriToImage(draft => {
      draft.push({uri, imageURL})
    });
  }

  useEffect(() => {
    if(transfersData)
      transfersData.transfers.forEach(transfer => {

        const found = uriToImage.find(element => element.uri === transfer.tokenURI);

        if(!found)
        getData(transfer.tokenURI).then((res) => {
          addImage(transfer.tokenURI, res.image)
        }).catch(e => {
          console.log('e: ', e);
        })

      });
  }, [transfersData])

  useEffect(() => {
    if(transfersOfUserData)
      transfersOfUserData.transfers.forEach(transfer => {

        const found = uriToImage.find(element => element.uri === transfer.tokenURI);

        if(!found)
        getData(transfer.tokenURI).then((res) => {
          addImage(transfer.tokenURI, res.image)
        }).catch(e => {
          console.log('e: ', e);
        })

      });
  }, [transfersOfUserData])

  return ({
    uriToImage
  })
}

export default App
