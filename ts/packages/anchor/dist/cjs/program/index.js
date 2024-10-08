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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const pako_1 = require("pako");
const index_js_1 = require("../coder/index.js");
const idl_js_1 = require("../idl.js");
const provider_js_1 = require("../provider.js");
const index_js_2 = require("../utils/bytes/index.js");
const common_js_1 = require("./common.js");
const event_js_1 = require("./event.js");
const index_js_3 = __importDefault(require("./namespace/index.js"));
__exportStar(require("./common.js"), exports);
__exportStar(require("./context.js"), exports);
__exportStar(require("./event.js"), exports);
__exportStar(require("./namespace/index.js"), exports);
/**
 * ## Program
 *
 * Program provides the IDL deserialized client representation of an Anchor
 * program.
 *
 * This API is the one stop shop for all things related to communicating with
 * on-chain programs. Among other things, one can send transactions, fetch
 * deserialized accounts, decode instruction data, subscribe to account
 * changes, and listen to events.
 *
 * In addition to field accessors and methods, the object provides a set of
 * dynamically generated properties, also known as namespaces, that
 * map one-to-one to program methods and accounts. These namespaces generally
 *  can be used as follows:
 *
 * ## Usage
 *
 * ```javascript
 * program.<namespace>.<program-specific-method>
 * ```
 *
 * API specifics are namespace dependent. The examples used in the documentation
 * below will refer to the two counter examples found
 * [here](https://github.com/coral-xyz/anchor#examples).
 */
class Program {
    /**
     * Address of the program.
     */
    get programId() {
        return this._programId;
    }
    /**
     * IDL in camelCase format to work in TypeScript.
     *
     * See {@link rawIdl} field if you need the original IDL.
     */
    get idl() {
        return this._idl;
    }
    /**
     * Raw IDL i.e. the original IDL without camelCase conversion.
     *
     * See {@link idl} field if you need the camelCased version of the IDL.
     */
    get rawIdl() {
        return this._rawIdl;
    }
    /**
     * Coder for serializing requests.
     */
    get coder() {
        return this._coder;
    }
    /**
     * Wallet and network provider.
     */
    get provider() {
        return this._provider;
    }
    /**
     * @param idl       The interface definition.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     * @param getCustomResolver A function that returns a custom account resolver
     *                          for the given instruction. This is useful for resolving
     *                          public keys of missing accounts when building instructions
     */
    constructor(idl, provider = (0, provider_js_1.getProvider)(), coder, getCustomResolver) {
        const camelCasedIdl = (0, idl_js_1.convertIdlToCamelCase)(idl);
        // Fields.
        this._idl = camelCasedIdl;
        this._rawIdl = idl;
        this._provider = provider;
        this._programId = (0, common_js_1.translateAddress)(idl.address);
        this._coder = coder !== null && coder !== void 0 ? coder : new index_js_1.BorshCoder(camelCasedIdl);
        this._events = new event_js_1.EventManager(this._programId, provider, this._coder);
        // Dynamic namespaces.
        const [rpc, instruction, transaction, account, simulate, methods, views] = index_js_3.default.build(camelCasedIdl, this._coder, this._programId, provider, getCustomResolver);
        this.rpc = rpc;
        this.instruction = instruction;
        this.transaction = transaction;
        this.account = account;
        this.simulate = simulate;
        this.methods = methods;
        this.views = views;
    }
    /**
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async at(address, provider) {
        const programId = (0, common_js_1.translateAddress)(address);
        const idl = await Program.fetchIdl(programId, provider);
        if (!idl) {
            throw new Error(`IDL not found for program: ${address.toString()}`);
        }
        return new Program(idl, provider);
    }
    /**
     * Fetches an idl from the blockchain.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async fetchIdl(address, provider) {
        provider = provider !== null && provider !== void 0 ? provider : (0, provider_js_1.getProvider)();
        const programId = (0, common_js_1.translateAddress)(address);
        const idlAddr = await (0, idl_js_1.idlAddress)(programId);
        const accountInfo = await provider.connection.getAccountInfo(idlAddr);
        if (!accountInfo) {
            return null;
        }
        // Chop off account discriminator.
        let idlAccount = (0, idl_js_1.decodeIdlAccount)(accountInfo.data.slice(8));
        const inflatedIdl = (0, pako_1.inflate)(idlAccount.data);
        return JSON.parse(index_js_2.utf8.decode(inflatedIdl));
    }
    /**
     * Invokes the given callback every time the given event is emitted.
     *
     * @param eventName The PascalCase name of the event, provided by the IDL.
     * @param callback  The function to invoke whenever the event is emitted from
     *                  program logs.
     */
    addEventListener(eventName, callback, commitment) {
        return this._events.addEventListener(eventName, callback, commitment);
    }
    /**
     * Unsubscribes from the given eventName.
     */
    async removeEventListener(listener) {
        return await this._events.removeEventListener(listener);
    }
}
exports.Program = Program;
//# sourceMappingURL=index.js.map