import sdk from "./1-initialize-sdk.js"
import { MaxUint256 } from "@ethersproject/constants"
;(async () => {
  try {
    const editionDrop = await sdk.getContract(
      "0xE0a3C2135ac286eC3A1eaCF65C80bE91853661A1",
      "edition-drop"
    )
    // Especifique as condições.
    const claimConditions = [
      {
        // Quando as pessoas vão poder reivindicar seus NFTs
        startTime: new Date(),
        // Número máximo de NFTs
        maxQuantity: 50,
        // o preço do NFT (grátis)
        price: 0,
        // Quantos NFTs podem ser reivindicados por transação.
        quantityLimitPerTransaction: 1,
        // tempo de espera entre transações infinito significa que cada
        // pessoa só pode solicitar um único NFT.
        waitInSeconds: MaxUint256,
      },
    ]

    await editionDrop.claimConditions.set("0", claimConditions)

    console.log("✅ Condições de reinvidicação configuradas com sucesso!")
  } catch (error) {
    console.error("Falha ao definir condições de reinvidicação", error)
  }
})()
