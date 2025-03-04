/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rent.json`.
 */
export type Rent = {
  "address": "5yhJHorpVDvCnF4Sxt4YdQ9aBs8oCoiyB4WizYYviFVB",
  "metadata": {
    "name": "rent",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createSystemAccount",
      "discriminator": [
        67,
        217,
        132,
        246,
        135,
        232,
        191,
        81
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "newAccount",
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
          "name": "addressData",
          "type": {
            "defined": {
              "name": "addressData"
            }
          }
        }
      ]
    }
  ],
  "types": [
    {
      "name": "addressData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "address",
            "type": "string"
          }
        ]
      }
    }
  ]
};
