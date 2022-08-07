import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x19a5426DBCe6DB454E7B4eDD00B6315CC64c3055");

(async () => {
    try {
        // Mostre os papeis atuais.
        const allRoles = await token.roles.getAll();

        console.log("👀 Papeis que existem agora:", allRoles);

        // Remova todos os superpoderes que sua carteira tinha sobre o contrato ERC-20.
        await token.roles.setAll({ admin: [], minter: [] });
        console.log(
            "🎉 Papeis depois de remover nós mesmos",
            await token.roles.getAll()
        );
        console.log("✅ Revogados nossos super-poderes sobre os tokens ERC-20");

    } catch (error) {
        console.error("Falha ao remover nossos direitos sobre o tesouro da DAO", error);
    }
})();