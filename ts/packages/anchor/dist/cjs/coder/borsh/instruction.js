"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorshInstructionCoder = void 0;
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
const borsh = __importStar(require("@coral-xyz/borsh"));
const idl_js_1 = require("../../idl.js");
const idl_js_2 = require("./idl.js");
/**
 * Encodes and decodes program instructions.
 */
class BorshInstructionCoder {
    constructor(idl) {
        this.idl = idl;
        const ixLayouts = idl.instructions.map((ix) => {
            const name = ix.name;
            const fieldLayouts = ix.args.map((arg) => idl_js_2.IdlCoder.fieldLayout(arg, idl.types));
            const layout = borsh.struct(fieldLayouts, name);
            return [name, { discriminator: ix.discriminator, layout }];
        });
        this.ixLayouts = new Map(ixLayouts);
    }
    /**
     * Encodes a program instruction.
     */
    encode(ixName, ix) {
        const buffer = buffer_1.Buffer.alloc(1000); // TODO: use a tighter buffer.
        const encoder = this.ixLayouts.get(ixName);
        if (!encoder) {
            throw new Error(`Unknown method: ${ixName}`);
        }
        const len = encoder.layout.encode(ix, buffer);
        const data = buffer.slice(0, len);
        return buffer_1.Buffer.concat([buffer_1.Buffer.from(encoder.discriminator), data]);
    }
    /**
     * Decodes a program instruction.
     */
    decode(ix, encoding = "hex") {
        if (typeof ix === "string") {
            ix = encoding === "hex" ? buffer_1.Buffer.from(ix, "hex") : bs58_1.default.decode(ix);
        }
        for (const [name, layout] of this.ixLayouts) {
            const givenDisc = ix.subarray(0, layout.discriminator.length);
            const matches = givenDisc.equals(buffer_1.Buffer.from(layout.discriminator));
            if (matches) {
                return {
                    name,
                    data: layout.layout.decode(ix.subarray(givenDisc.length)),
                };
            }
        }
        return null;
    }
    /**
     * Returns a formatted table of all the fields in the given instruction data.
     */
    format(ix, accountMetas) {
        return InstructionFormatter.format(ix, accountMetas, this.idl);
    }
}
exports.BorshInstructionCoder = BorshInstructionCoder;
class InstructionFormatter {
    static format(ix, accountMetas, idl) {
        const idlIx = idl.instructions.find((i) => ix.name === i.name);
        if (!idlIx) {
            console.error("Invalid instruction given");
            return null;
        }
        const args = idlIx.args.map((idlField) => {
            return {
                name: idlField.name,
                type: InstructionFormatter.formatIdlType(idlField.type),
                data: InstructionFormatter.formatIdlData(idlField, ix.data[idlField.name], idl.types),
            };
        });
        const flatIdlAccounts = InstructionFormatter.flattenIdlAccounts(idlIx.accounts);
        const accounts = accountMetas.map((meta, idx) => {
            if (idx < flatIdlAccounts.length) {
                return {
                    name: flatIdlAccounts[idx].name,
                    ...meta,
                };
            }
            // "Remaining accounts" are unnamed in Anchor.
            else {
                return {
                    name: undefined,
                    ...meta,
                };
            }
        });
        return {
            args,
            accounts,
        };
    }
    static formatIdlType(idlType) {
        if (typeof idlType === "string") {
            return idlType;
        }
        if ("option" in idlType) {
            return `Option<${this.formatIdlType(idlType.option)}>`;
        }
        if ("coption" in idlType) {
            return `COption<${this.formatIdlType(idlType.coption)}>`;
        }
        if ("vec" in idlType) {
            return `Vec<${this.formatIdlType(idlType.vec)}>`;
        }
        if ("array" in idlType) {
            return `Array<${idlType.array[0]}; ${idlType.array[1]}>`;
        }
        if ("defined" in idlType) {
            const name = idlType.defined.name;
            if (idlType.defined.generics) {
                const generics = idlType.defined.generics
                    .map((g) => {
                    switch (g.kind) {
                        case "type":
                            return InstructionFormatter.formatIdlType(g.type);
                        case "const":
                            return g.value;
                    }
                })
                    .join(", ");
                return `${name}<${generics}>`;
            }
            return name;
        }
        throw new Error(`Unknown IDL type: ${idlType}`);
    }
    static formatIdlData(idlField, data, types) {
        if (typeof idlField.type === "string") {
            return data.toString();
        }
        if ("vec" in idlField.type) {
            return ("[" +
                data
                    .map((d) => this.formatIdlData({ name: "", type: idlField.type.vec }, d, types))
                    .join(", ") +
                "]");
        }
        if ("option" in idlField.type) {
            return data === null
                ? "null"
                : this.formatIdlData({ name: "", type: idlField.type.option }, data, types);
        }
        if ("defined" in idlField.type) {
            if (!types) {
                throw new Error("User defined types not provided");
            }
            const definedName = idlField.type.defined.name;
            const typeDef = types.find((t) => t.name === definedName);
            if (!typeDef) {
                throw new Error(`Type not found: ${definedName}`);
            }
            return InstructionFormatter.formatIdlDataDefined(typeDef, data, types);
        }
        return "unknown";
    }
    static formatIdlDataDefined(typeDef, data, types) {
        switch (typeDef.type.kind) {
            case "struct": {
                return ("{ " +
                    (0, idl_js_1.handleDefinedFields)(typeDef.type.fields, () => "", (fields) => {
                        return Object.entries(data)
                            .map(([key, val]) => {
                            const field = fields.find((f) => f.name === key);
                            if (!field) {
                                throw new Error(`Field not found: ${key}`);
                            }
                            return (key +
                                ": " +
                                InstructionFormatter.formatIdlData(field, val, types));
                        })
                            .join(", ");
                    }, (fields) => {
                        return Object.entries(data)
                            .map(([key, val]) => {
                            return (key +
                                ": " +
                                InstructionFormatter.formatIdlData({ name: "", type: fields[key] }, val, types));
                        })
                            .join(", ");
                    }) +
                    " }");
            }
            case "enum": {
                const variantName = Object.keys(data)[0];
                const variant = typeDef.type.variants.find((v) => v.name === variantName);
                if (!variant) {
                    throw new Error(`Unable to find variant: ${variantName}`);
                }
                const enumValue = data[variantName];
                return (0, idl_js_1.handleDefinedFields)(variant.fields, () => variantName, (fields) => {
                    const namedFields = Object.keys(enumValue)
                        .map((f) => {
                        const fieldData = enumValue[f];
                        const idlField = fields.find((v) => v.name === f);
                        if (!idlField) {
                            throw new Error(`Field not found: ${f}`);
                        }
                        return (f +
                            ": " +
                            InstructionFormatter.formatIdlData(idlField, fieldData, types));
                    })
                        .join(", ");
                    return `${variantName} { ${namedFields} }`;
                }, (fields) => {
                    const tupleFields = Object.entries(enumValue)
                        .map(([key, val]) => {
                        return (key +
                            ": " +
                            InstructionFormatter.formatIdlData({ name: "", type: fields[key] }, val, types));
                    })
                        .join(", ");
                    return `${variantName} { ${tupleFields} }`;
                });
            }
            case "type": {
                return InstructionFormatter.formatIdlType(typeDef.type.alias);
            }
        }
    }
    static flattenIdlAccounts(accounts, prefix) {
        return accounts
            .map((account) => {
            const accName = sentenceCase(account.name);
            if (account.hasOwnProperty("accounts")) {
                const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
                return InstructionFormatter.flattenIdlAccounts(account.accounts, newPrefix);
            }
            else {
                return {
                    ...account,
                    name: prefix ? `${prefix} > ${accName}` : accName,
                };
            }
        })
            .flat();
    }
}
function sentenceCase(field) {
    const result = field.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
//# sourceMappingURL=instruction.js.map