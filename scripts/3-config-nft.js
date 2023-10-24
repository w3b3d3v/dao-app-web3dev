import sdk from "./1-initialize-sdk.js"
import { readFileSync } from "fs"
;(async () => {
  try {
    const editionDrop = await sdk.getContract(
      "0xE0a3C2135ac286eC3A1eaCF65C80bE91853661A1",
      "edition-drop"
    )
    await editionDrop.createBatch([
      {
        name: "Capacete Super Estilo",
        description: "Esse NFT vai te dar acesso ao MTBDAO!",
        image: readFileSync("scripts/assets/capacete.jpeg"),
      },
    ])
    console.log("✅ Novo NFT criado com sucesso no !")
  } catch (error) {
    console.error("falha ao criar o novo NFT", error)
  }
})()
