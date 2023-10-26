import sdk from "./1-initialize-sdk.js"
;(async () => {
  try {
    const editionDrop = await sdk.getContract(
      "0xE0a3C2135ac286eC3A1eaCF65C80bE91853661A1",
      "edition-drop"
    )
    const token = await sdk.getContract("0xA1403741dAF0c8c6D8bD009F7196a4c97ec99D05", "token")

    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0)

    if (walletAddresses.length === 0) {
      console.log(
        "Ninguém mintou o NFT ainda, peça para alguns amigos fazerem isso e ganhar um NFT de graça!"
      )
      process.exit(0)
    }

    const airdropTargets = walletAddresses.map((address) => {
      // Escolha um # aleatório entre 1000 e 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
      console.log("✅ Vai enviar", randomAmount, "tokens para ", address)

      // Configure o alvo.
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      }

      return airdropTarget
    })

    console.log("🌈 Começando o airdrop...")
    await token.transferBatch(airdropTargets)
    console.log("✅ Feito o airdrop de tokens para todos os donos de NFT!")
  } catch (err) {
    console.error("O airdrop de tokens falhou", err)
  }
})()
