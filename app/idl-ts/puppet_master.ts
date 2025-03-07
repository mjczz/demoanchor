/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/puppet_master.json`.
 */
export type PuppetMaster = {
  "address": "A4YSiaX2jWBWuYcFgAW1AAgUehBBk2NYmWyrfJhFwaPE",
  "metadata": {
    "name": "puppetMaster",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor test for cpi"
  },
  "instructions": [
    {
      "name": "pullStrings",
      "discriminator": [
        13,
        252,
        243,
        149,
        120,
        132,
        189,
        145
      ],
      "accounts": [
        {
          "name": "puppet",
          "writable": true
        },
        {
          "name": "puppetProgram",
          "address": "6isZqi2DALvxQ7xMpJCnuomBSXRzynVdnCaLKhwhEghx"
        }
      ],
      "args": [
        {
          "name": "data",
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
