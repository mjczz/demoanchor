/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/my_nft_project.json`.
 */
export type MyNftProject = {
  "address": "5CYqYfU4QCq9krUaw2XbbtEPGkqR8xiMNwg7cgtY6DHW",
  "metadata": {
    "name": "myNftProject",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "nft",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "nft",
      "discriminator": [
        88,
        10,
        146,
        176,
        101,
        11,
        40,
        217
      ]
    }
  ],
  "types": [
    {
      "name": "nft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
