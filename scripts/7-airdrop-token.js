import sdk from "./1-initialize-sdk.js";

// Esse é o endereço do nosso contrato ERC-1155 do NFT de filiação.
const editionDrop = sdk.getEditionDrop("0x9331bE092483CC8e839b97fF77bc3dC4b466c3f0");

// Esse é o endereço do nosso contrato ERC-20 do nosso token.
const token = sdk.getToken("0x19a5426DBCe6DB454E7B4eDD00B6315CC64c3055");

(async () => {
    try {
        // Pegue o endereço de todas as pessoas que possuem o nosso NFT de filiação, que tem
        // o tokenId 0.
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log(
                "Ninguém mintou o NFT ainda, peça para alguns amigos fazerem isso e ganhar um NFT de graça!",
            );
            process.exit(0);
        }

        // faça um loop no array de endereços.
        const airdropTargets = walletAddresses.map((address) => {
            // Escolha um # aleatório entre 1000 e 10000.
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Vai enviar", randomAmount, "tokens para ", address);

            // Configure o alvo.
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        // Chame transferBatch em todos os alvos do airdrop.
        console.log("🌈 Começando o airdrop...")
        await token.transferBatch(airdropTargets);
        console.log("✅ Feito o airdrop de tokens para todos os donos de NFT!");
    } catch (err) {
        console.error("O airdrop de tokens falhou", err);
    }
})();