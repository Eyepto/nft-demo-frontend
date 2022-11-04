import { useQuery } from 'urql'
import { transfersDocument, transfersOfUserDocument, transfersQuery } from '../../.graphclient'

// Retrieve transfers data from TheGraph
function useTheGraph(userAddress : string | JSX.Element) {
  const [transfersResult, reexecuteTransfersQuery] = useQuery({
    query: transfersDocument,
  })

  const { data: transfersData, fetching: transfersFetching, error: transfersError } = transfersResult

  const [resultTransfersOfUser, reexecuteTransfersOfUserQuery] = useQuery({
    query: transfersOfUserDocument,
    variables: {
      address: userAddress,
    },
  })
  
  const { data: transfersOfUserData, fetching: transfersOfUserFetching, error: transfersOfUserError } = resultTransfersOfUser

  return ({
	reexecuteTransfersQuery,
	transfersData,
	transfersFetching,
	transfersError,

	reexecuteTransfersOfUserQuery,
	transfersOfUserData,
	transfersOfUserFetching,
	transfersOfUserError
  })
}

export default useTheGraph
