import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react'
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  const address = useAddress()
  console.log("Address: ", address)

  const editionDropAddress = "0xE0a3C2135ac286eC3A1eaCF65C80bE91853661A1"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop")
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")
  const { contract: token } = useContract('0xA1403741dAF0c8c6D8bD009F7196a4c97ec99D05', 'token')

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([])
  const [memberAddresses, setMemberAddresses] = useState([])

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4)
  }

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  useEffect(() => {
    if (!hasClaimedNFT) return


    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0)
        setMemberAddresses(memberAddresses)
        console.log("🚀 Endereços de membros", memberAddresses)
      }
      catch (error) {
        console.error("falha ao pegar lista de membros", error)
      }
    }
    getAllAddresses()

  }, [hasClaimedNFT, editionDrop])

  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // Pega todos os saldos.
    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances()
        setMemberTokenAmounts(amounts)
        console.log("👜 Quantidades", amounts)
      } catch (error) {
        console.error("falha ao buscar o saldo dos membros", error)
      }
    }
    getAllBalances()
  }, [hasClaimedNFT, token])

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // Se o endereço não está no memberTokenAmounts, isso significa que eles não
      // detêm nada do nosso token.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address)

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })
  }, [memberAddresses, memberTokenAmounts]);


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

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🚴 Página dos membros da DAO</h1>
        <p>Parabéns por fazer parte desse clube de bikers!</p>
        <div>
          <div>
            <h2>Lista de Membros</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Endereço</th>
                  <th>Quantidade de Tokens</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="mint-nft">
      <h1>Cunhe seu NFT 🚲 ele mostra que você é membro desta DAO</h1>
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/mumbai/${editionDrop.getAddress()}/0`)
          }}
          onError={error => {
            console.error("Failed to mint NFT", error)
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );

}

export default App
