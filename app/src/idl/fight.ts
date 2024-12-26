/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fight.json`.
 */
export type Fight = {
  "address": "HF6biQrNj8PjfL675LzobDiyZB5venfriJMF5pPF6L9Z",
  "metadata": {
    "name": "fight",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "create",
      "discriminator": [
        24,
        30,
        200,
        40,
        5,
        28,
        7,
        119
      ],
      "accounts": [
        {
          "name": "actionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  116,
                  105,
                  111,
                  110,
                  45,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
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
      "args": []
    },
    {
      "name": "jump",
      "discriminator": [
        115,
        18,
        221,
        88,
        166,
        230,
        219,
        32
      ],
      "accounts": [
        {
          "name": "actionState",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "actionState"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "reset",
      "discriminator": [
        23,
        81,
        251,
        84,
        138,
        183,
        240,
        214
      ],
      "accounts": [
        {
          "name": "actionState",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "actionState"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "run",
      "discriminator": [
        203,
        27,
        228,
        218,
        208,
        69,
        35,
        84
      ],
      "accounts": [
        {
          "name": "actionState",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "actionState"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "walk",
      "discriminator": [
        117,
        227,
        10,
        68,
        128,
        250,
        50,
        154
      ],
      "accounts": [
        {
          "name": "actionState",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true,
          "relations": [
            "actionState"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "actionState",
      "discriminator": [
        68,
        223,
        59,
        227,
        180,
        86,
        142,
        180
      ]
    }
  ],
  "types": [
    {
      "name": "actionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "action",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
