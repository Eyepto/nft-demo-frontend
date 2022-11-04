function useTransactionsBuilder() {
	// Hardcoded request for a transaction, it could be obviously be generated and supplied with payload, see docs here: TODO
	const mintToken = {
		"v": "1",
		"p": "e",
		"n": "137",
		"t": "f",
		"ta": "0xAb3A20CCBBB8B9ab6DC721aa63B614cd89d87F45",
		"d": {
			"a": {
				"inputs": [], // there are no inputs for this function (mint), which is why we don't need a payload
				"name": "mint",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		}
	}
  return ({
	mintToken
  })
}

export default useTransactionsBuilder
