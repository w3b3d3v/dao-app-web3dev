import sdk from "./1-initialize-sdk.js";

// Esse é o endereço do nosso contrato ERC-20 impresso no passo anterior.
const token = sdk.getToken("0x19a5426DBCe6DB454E7B4eDD00B6315CC64c3055");

(async () => {
    try {
        // Qual o fornecimento máximo que você quer? 1,000,000 é um número legal!
        const amount = 1_000_000;
        // Interaja com o seu contrato ERC-20 e cunhe os tokens!
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Mostre quantos dos seus tokens existem agora!
        console.log("✅ Agora temos", totalSupply.displayValue, "$BIKES em circulação");
    } catch (error) {
        console.error("Falha ao imprimir o dinheiro", error);
    }
})();