import sdk from "./1-initialize-sdk.js"

// Esse é o endereço do nosso contrato ERC-20 impresso no passo anterior.
const token = await sdk.getContract("0xA1403741dAF0c8c6D8bD009F7196a4c97ec99D05", "token")
;(async () => {
  try {
    // Qual o fornecimento máximo que você quer? 1,000,000 é um número legal!
    const amount = 1_000_000
    // Interaja com o seu contrato ERC-20 e cunhe os tokens!
    await token.mint(amount)
    const totalSupply = await token.totalSupply()

    // Mostre quantos dos seus tokens existem agora!
    console.log("✅ Agora temos", totalSupply.displayValue, "$BIKES em circulação")
  } catch (error) {
    console.error("Falha ao imprimir o dinheiro", error)
  }
})()
