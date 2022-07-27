import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

// Importe o ThirdWeb
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

// Inclua que redes você quer dar suporte.
// 4 = Rinkeby.
const activeChainId = ChainId.Rinkeby

// Por último, envolva o App com o thirdweb provider.
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
