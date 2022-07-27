import sdk from "./1-initialize-sdk.js"
import { readFileSync } from "fs"

const editionDrop = sdk.getEditionDrop("0x828102F33E3Fb4798E71434F94C29fe2a8EeC27F")

;(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Capacete Super Estilo",
        description: "Esse NFT vai te dar acesso ao MTBDAO!",
        image: readFileSync("scripts/assets/capacete.png"),
      },
    ])
    console.log("✅ Novo NFT criado com sucesso no drop!")
  } catch (error) {
    console.error("falha ao criar o novo NFT", error)
  }
})()
