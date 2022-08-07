import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x9331bE092483CC8e839b97fF77bc3dC4b466c3f0");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Rei da SubDAO",
                description: "Esse NFT vai te dar acesso ao SubDAO!",
                image: readFileSync("scripts/assets/rei.jpg"),
            },
        ]);
        console.log("✅ Novo NFT criado com sucesso no !");
    } catch (error) {
        console.error("falha ao criar o novo NFT", error);
    }
})()