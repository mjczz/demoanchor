/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/puppet.json`.
 */
export type Puppet = {
  "address": "GJbH3qTghYJm2cuGekEsBUPVZZKdWp8xqE1tx1trwtHF",
  "metadata": {
    "name": "puppet",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "puppet",
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
      "args": []
    },
    {
      "name": "setData",
      "discriminator": [
        223,
        114,
        91,
        136,
        197,
        78,
        153,
        153
      ],
      "accounts": [
        {
          "name": "puppet",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "dataParam",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pData",
      "discriminator": [
        199,
        118,
        15,
        171,
        159,
        230,
        8,
        152
      ]
    }
  ],
  "types": [
    {
      "name": "pData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pupData",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    }
  ]
};
