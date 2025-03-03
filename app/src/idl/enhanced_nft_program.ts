/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/enhanced_nft_program.json`.
 */
export type EnhancedNftProgram = {
    "address": "FjgPnuFAxA6rVf87N1yd695sAhEZBtm5ZtdiQznRpVkE",
    "metadata": {
        "name": "enhancedNftProgram",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "createNft",
            "discriminator": [
                231,
                119,
                61,
                97,
                217,
                46,
                142,
                109
            ],
            "accounts": [
                {
                    "name": "nftData",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "mint",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "payer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "name": "maxSupply",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "mintNft",
            "discriminator": [
                211,
                57,
                6,
                167,
                15,
                219,
                35,
                251
            ],
            "accounts": [
                {
                    "name": "nftData",
                    "writable": true
                },
                {
                    "name": "mint",
                    "writable": true
                },
                {
                    "name": "tokenAccount",
                    "writable": true
                },
                {
                    "name": "payer",
                    "signer": true
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "transferNft",
            "discriminator": [
                190,
                28,
                194,
                8,
                194,
                218,
                78,
                78
            ],
            "accounts": [
                {
                    "name": "from",
                    "writable": true
                },
                {
                    "name": "to",
                    "writable": true
                },
                {
                    "name": "owner",
                    "signer": true
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "nftData",
            "discriminator": [
                40,
                79,
                175,
                54,
                89,
                0,
                192,
                47
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "maxSupplyExceeded",
            "msg": "The maximum supply has been exceeded."
        }
    ],
    "types": [
        {
            "name": "nftData",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "symbol",
                        "type": "string"
                    },
                    {
                        "name": "maxSupply",
                        "type": "u64"
                    },
                    {
                        "name": "supply",
                        "type": "u64"
                    }
                ]
            }
        }
    ]
};
