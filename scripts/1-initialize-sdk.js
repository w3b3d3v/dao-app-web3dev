import { ThirdwebSDK } from "@thirdweb-dev/sdk"

import dotenv from "dotenv"
dotenv.config()

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Chave privada não encontrada.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Endereço de carteira não encontrado.")
}

if (!process.env.THIRDWEB_CLIENT_ID || process.env.THIRDWEB_CLIENT_ID == "") {
  console.log("🛑 Client ID não encontrado.")
}

if (!process.env.THIRDWEB_SECRET_KEY || process.env.THIRDWEB_SECRET_KEY == "") {
  console.log("🛑 Secret Key não encontrada.")
}

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY,
  "mumbai", //A chave privada da nossa carteira. SEMPRE MANTENHA ISSO PRIVADO, NÃO COMPARTILHE COM NINGUÉM, adicione no seu arquivo .env e NÃO comite aquele arquivo para o github!
  {
    clientId: process.env.THIRDWEB_CLIENT_ID, // Cliente ID gerado pela API do ThirdWeb
    secretKey: process.env.THIRDWEB_SECRET_KEY, // Secret Key gerado pela API do ThirdWeb
  }
)
;(async () => {
  try {
    const address = await sdk.getSigner().getAddress()
    console.log("👋 SDK inicializado pelo endereço:", address)
  } catch (err) {
    console.error("Falha ao buscar apps no sdk", err)
    process.exit(1)
  }
})()

export default sdk
