import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk'

const App = () => {
    // Usando os hooks que o thirdweb nos dá.
    const address = useAddress();
    const network = useNetwork();
    const connectWithMetamask = useMetamask();
    console.log("👋 Address:", address);

    // inicializar o contrato editionDrop
    const editionDrop = useEditionDrop("0x9331bE092483CC8e839b97fF77bc3dC4b466c3f0");
    const token = useToken("0x19a5426DBCe6DB454E7B4eDD00B6315CC64c3055");
    const vote = useVote("0xa0e90FFD486595256f7BaEfB56BD4410574a9fE0");
    // Variável de estado para sabermos se o usuário tem nosso NFT.
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    // isClaiming nos ajuda a saber se está no estado de carregando enquanto o NFT é cunhado.
    const [isClaiming, setIsClaiming] = useState(false);

    // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
    const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// O array guardando todos os endereços dos nosso membros.
    const [memberAddresses, setMemberAddresses] = useState([]);

// Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar a coisa toda.
    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

// Recupere todas as propostas existentes no contrato.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        // Uma chamada simples para vote.getAll() para pegar as propostas.
        const getAllProposals = async () => {
            try {
                const proposals = await vote.getAll();
                setProposals(proposals);
                console.log("🌈 Propostas:", proposals);
            } catch (error) {
                console.log("falha ao buscar propostas", error);
            }
        };
        getAllProposals();
    }, [hasClaimedNFT, vote]);

// Nós também precisamos checar se o usuário já votou.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Se nós não tivermos terminado de recuperar as propostas do useEffect acima
        // então ainda nao podemos checar se o usuário votou!
        if (!proposals.length) {
            return;
        }

        const checkIfUserHasVoted = async () => {
            try {
                const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
                setHasVoted(hasVoted);
                if (hasVoted) {
                    console.log("🥵 Usuário já votou");
                } else {
                    console.log("🙂 Usuário ainda não votou");
                }
            } catch (error) {
                console.error("Falha ao verificar se carteira já votou", error);
            }
        };
        checkIfUserHasVoted();

    }, [hasClaimedNFT, proposals, address, vote]);

// Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Do mesmo jeito que fizemos no arquivo 7-airdrop-token.js! Pegue os usuários que tem nosso NFT
        // com o tokenId 0.
        const getAllAddresses = async () => {
            try {
                const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
                setMemberAddresses(memberAddresses);
                console.log("🚀 Endereços de membros", memberAddresses);
            } catch (error) {
                console.error("falha ao pegar lista de membros", error);
            }

        };
        getAllAddresses();
    }, [hasClaimedNFT, editionDrop.history]);

// Esse useEffect pega o # de tokens que cada membro tem.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Pega todos os saldos.
        const getAllBalances = async () => {
            try {
                const amounts = await token.history.getAllHolderBalances();
                setMemberTokenAmounts(amounts);
                console.log("👜 Quantidades", amounts);
            } catch (error) {
                console.error("falha ao buscar o saldo dos membros", error);
            }
        };
        getAllBalances();
    }, [hasClaimedNFT, token.history]);


// Agora, nós combinamos os memberAddresses e os memberTokenAmounts em um único array
    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {
            // Se o endereço não está no memberTokenAmounts, isso significa que eles não
            // detêm nada do nosso token.
            const member = memberTokenAmounts?.find(({ holder }) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || "0",
            }
        });
    }, [memberAddresses, memberTokenAmounts]);

    useEffect(() => {
        // Se ele não tiver uma carteira conectada, saia!
        if (!address) {
            return
        }

        const checkBalance = async () => {
            try {
                const balance = await editionDrop.balanceOf(address, 0)
                // Se o saldo for maior do que 0, ele tem nosso NFT!
                if (balance.gt(0)) {
                    setHasClaimedNFT(true)
                    console.log("🌟 esse usuário tem o NFT de membro!")
                } else {
                    setHasClaimedNFT(false)
                    console.log("😭 esse usuário NÃO tem o NFT de membro.")
                }
            } catch (error) {
                setHasClaimedNFT(false)
                console.error("Falha ao ler saldo", error)
            }
        }
        checkBalance()
    }, [address, editionDrop])

    const mintNft = async () => {
        try {
            setIsClaiming(true);
            await editionDrop.claim("0", 1);
            console.log(`🌊 Cunhado com sucesso! Olhe na OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
            setHasClaimedNFT(true);
        } catch (error) {
            setHasClaimedNFT(false);
            console.error("Falha ao cunhar NFT", error);
        } finally {
            setIsClaiming(false);
        }
    };

    if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
        return (
            <div className="unsupported-network">
                <h2>Por favor, conecte-se à rede Rinkeby</h2>
                <p>
                    Essa dapp só funciona com a rede Rinkeby, por favor
                    troque de rede na sua carteira.
                </p>
            </div>
        );
    }

    if (!address) {
        return (
            <div className="landing">
                <h1>Bem-vind@s à SubDAO</h1>
                <button onClick={connectWithMetamask} className="btn-hero">
                    Conecte sua carteira
                </button>
            </div>
        );
    }

    if (hasClaimedNFT) {
        return (
            <div className="member-page">
                <h1>Página dos membros da DAO</h1>
                <p>Parabéns por fazer parte desse clube!</p>
                <div>
                    <div>
                        <h2>Lista de Membros</h2>
                        <table className="card">
                            <thead>
                            <tr>
                                <th>Endereço</th>
                                <th>Quantidade de Tokens</th>
                            </tr>
                            </thead>
                            <tbody>
                            {memberList.map((member) => {
                                return (
                                    <tr key={member.address}>
                                        <td>{shortenAddress(member.address)}</td>
                                        <td>{member.tokenAmount}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h2>Propostas Ativas</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()

                                //antes de fazer as coisas async, desabilitamos o botão para previnir duplo clique
                                setIsVoting(true)

                                // pega os votos no formulário
                                const votes = proposals.map((proposal) => {
                                    const voteResult = {
                                        proposalId: proposal.proposalId,
                                        //abstenção é a escolha padrão
                                        vote: 2,
                                    }
                                    proposal.votes.forEach((vote) => {
                                        const elem = document.getElementById(
                                            proposal.proposalId + "-" + vote.type
                                        )

                                        if (elem.checked) {
                                            voteResult.vote = vote.type
                                            return
                                        }
                                    })
                                    return voteResult
                                })

                                // certificamos que o usuário delega seus tokens para o voto
                                try {
                                    //verifica se a carteira precisa delegar os tokens antes de votar
                                    const delegation = await token.getDelegationOf(address)
                                    // se a delegação é o endereço 0x0 significa que eles não delegaram seus tokens de governança ainda
                                    if (delegation === AddressZero) {
                                        //se não delegaram ainda, teremos que delegar eles antes de votar
                                        await token.delegateTo(address)
                                    }
                                    // então precisamos votar nas propostas
                                    try {
                                        await Promise.all(
                                            votes.map(async ({ proposalId, vote: _vote }) => {
                                                // antes de votar, precisamos saber se a proposta está aberta para votação
                                                // pegamos o último estado da proposta
                                                const proposal = await vote.get(proposalId)
                                                // verifica se a proposta está aberta para votação (state === 1 significa está aberta)
                                                if (proposal.state === 1) {
                                                    // se está aberta, então vota nela
                                                    return vote.vote(proposalId, _vote)
                                                }
                                                // se a proposta não está aberta, returna vazio e continua
                                                return
                                            })
                                        )
                                        try {
                                            // se alguma proposta está pronta para ser executada, fazemos isso
                                            // a proposta está pronta para ser executada se o estado é igual a 4
                                            await Promise.all(
                                                votes.map(async ({ proposalId }) => {
                                                    // primeiro pegamos o estado da proposta novamente, dado que podemos ter acabado de votar
                                                    const proposal = await vote.get(proposalId)

                                                    //se o estado é igual a 4 (pronta para ser executada), executamos a proposta
                                                    if (proposal.state === 4) {
                                                        return vote.execute(proposalId)
                                                    }
                                                })
                                            )
                                            // se chegamos aqui, significa que votou com sucesso, então definimos "hasVoted" como true
                                            setHasVoted(true)
                                            console.log("votado com sucesso")
                                        } catch (err) {
                                            console.error("falha ao executar votos", err)
                                        }
                                    } catch (err) {
                                        console.error("falha ao votar", err)
                                    }
                                } catch (err) {
                                    console.error("falha ao delegar tokens")
                                } finally {
                                    // de qualquer modo, volta isVoting para false para habilitar o botão novamente
                                    setIsVoting(false)
                                }
                            }}
                        >
                            {proposals.map((proposal) => (
                                <div key={proposal.proposalId} className="card">
                                    <h5>{proposal.description}</h5>
                                    <div>
                                        {proposal.votes.map(({ type, label }) => {
                                            const translations = {
                                                Against: "Contra",
                                                For: "A favor",
                                                Abstain: "Abstenção",
                                            }
                                            return (
                                                <div key={type}>
                                                    <input
                                                        type="radio"
                                                        id={proposal.proposalId + "-" + type}
                                                        name={proposal.proposalId}
                                                        value={type}
                                                        //valor padrão "abster" vem habilitado
                                                        defaultChecked={type === 2}
                                                    />
                                                    <label htmlFor={proposal.proposalId + "-" + type}>
                                                        {translations[label]}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                            <button disabled={isVoting || hasVoted} type="submit">
                                {isVoting
                                    ? "Votando..."
                                    : hasVoted
                                        ? "Você já votou"
                                        : "Submeter votos"}
                            </button>
                            {!hasVoted && (
                                <small>
                                    Isso irá submeter várias transações que você precisará assinar.
                                </small>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        )
    };

    // Renderiza a tela de cunhagem do NFT.
    return (
        <div className="mint-nft">
            <h1>Cunhe gratuitamente seu NFT da LaLuxe</h1>
            <button
                disabled={isClaiming}
                onClick={mintNft}
            >
                {isClaiming ? "Cunhando..." : "Cunhe seu NFT (GRATIS)"}
            </button>
        </div>
    );
};

export default App;

