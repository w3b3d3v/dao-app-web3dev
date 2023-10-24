import { useAddress, ConnectWallet } from "@thirdweb-dev/react"

const App = () => {
  const address = useAddress()
  console.log("Address: ", address)

  if (!address) {
    return (
      <div className="landing">
        <h1>Bem-vind@s à MTBDAO - a DAO dos pedaleiros de montanha</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    )
  }
  return (
    <div className="landing">
      <h1>Carteira conectada, e agora?</h1>
    </div>
  )
}

export default App
