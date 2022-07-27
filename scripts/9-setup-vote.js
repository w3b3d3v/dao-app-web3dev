import sdk from "./1-initialize-sdk.js"

// Esse é o nosso contrato de governança.
const vote = sdk.getVote("0xB6f4Dcb245638F5C1b694FA8f28E4C37400A437b")

// Esse é o nosso contrato ERC-20.
const token = sdk.getToken("0x551ab187397F8A2a7a599557C13cb2279071d4D5")

;(async () => {
  try {
    // Dê para a nosso tesouro o poder de cunhar tokens adicionais se necessário.
    await token.roles.grant("minter", vote.getAddress())

    console.log("✅ Módulo de votos recebeu permissão de manipular os tokens com sucesso")
  } catch (error) {
    console.error("falha ao dar acesso aos tokens ao módulo de votos", error)
    process.exit(1)
  }

  try {
    //Pegue o saldo de tokens da nossa carteira, lembre-se -- nós detemos basicamente o fornecimento inteiro agora!
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS)

    // Pegue 90% do fornecimento que nós detemos.
    const ownedAmount = ownedTokenBalance.displayValue
    const percent90 = (Number(ownedAmount) / 100) * 90

    // Transfira 90% do fornecimento para nosso contrato de votação.
    await token.transfer(vote.getAddress(), percent90)

    console.log("✅ Transferiu " + percent90 + " tokens para o módulo de votos com sucesso")
  } catch (err) {
    console.error("falhar ao transferir tokens ao módulo de votos", err)
  }
})()
