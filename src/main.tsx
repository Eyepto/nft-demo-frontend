import React from 'react'
import './index.css'
import App from './App'
import './App.css'
import { createClient, Provider } from 'urql'
import { graphExchange } from '@graphprotocol/client-urql'
import * as GraphClient from '../.graphclient'
import ReactDOM from "react-dom/client";

const client = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [graphExchange(GraphClient)],
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
)
