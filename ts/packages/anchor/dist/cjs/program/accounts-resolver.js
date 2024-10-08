"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsResolver = exports.isAccountsGeneric = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@solana/web3.js");
const idl_js_1 = require("../idl.js");
const token_account_layout_1 = require("./token-account-layout");
const index_js_1 = require("./index.js");
const methods_1 = require("./namespace/methods");
function isAccountsGeneric(accounts) {
    return !(accounts instanceof web3_js_1.PublicKey);
}
exports.isAccountsGeneric = isAccountsGeneric;
// Populates a given accounts context with PDAs and common missing accounts.
class AccountsResolver {
    constructor(_args, _accounts, _provider, _programId, _idlIx, accountNamespace, _idlTypes, _customResolver) {
        this._args = _args;
        this._accounts = _accounts;
        this._provider = _provider;
        this._programId = _programId;
        this._idlIx = _idlIx;
        this._idlTypes = _idlTypes;
        this._customResolver = _customResolver;
        this._accountStore = new AccountStore(_provider, accountNamespace, _programId);
    }
    args(args) {
        this._args = args;
    }
    // Note: We serially resolve PDAs one by one rather than doing them
    //       in parallel because there can be dependencies between
    //       addresses. That is, one PDA can be used as a seed in another.
    async resolve() {
        this.resolveEventCpi(this._idlIx.accounts);
        this.resolveConst(this._idlIx.accounts);
        // Auto populate pdas and relations until we stop finding new accounts
        let depth = 0;
        while ((await this.resolvePdasAndRelations(this._idlIx.accounts)) +
            (await this.resolveCustom()) >
            0) {
            depth++;
            if (depth === 16) {
                throw new Error("Reached maximum depth for account resolution");
            }
        }
    }
    resolveOptionals(accounts) {
        Object.assign(this._accounts, this.resolveOptionalsHelper(accounts, this._idlIx.accounts));
    }
    get(path) {
        // Only return if pubkey
        const ret = path.reduce((acc, subPath) => acc && acc[subPath], this._accounts);
        if (ret && ret.toBase58) {
            return ret;
        }
    }
    set(path, value) {
        let cur = this._accounts;
        path.forEach((p, i) => {
            var _a;
            const isLast = i === path.length - 1;
            if (isLast) {
                cur[p] = value;
            }
            cur[p] = (_a = cur[p]) !== null && _a !== void 0 ? _a : {};
            cur = cur[p];
        });
    }
    resolveOptionalsHelper(partialAccounts, accounts) {
        const nestedAccountsGeneric = {};
        // Looping through accountItem array instead of on partialAccounts, so
        // we only traverse array once
        for (const accountItem of accounts) {
            const accountName = accountItem.name;
            const partialAccount = partialAccounts[accountName];
            // Skip if the account isn't included (thus would be undefined)
            if (partialAccount === undefined)
                continue;
            if ((0, methods_1.isPartialAccounts)(partialAccount)) {
                // is compound accounts, recurse one level deeper
                if ((0, idl_js_1.isCompositeAccounts)(accountItem)) {
                    nestedAccountsGeneric[accountName] = this.resolveOptionalsHelper(partialAccount, accountItem["accounts"]);
                }
                else {
                    // Here we try our best to recover gracefully. If there are optionals we can't check, we will fail then.
                    nestedAccountsGeneric[accountName] = (0, methods_1.flattenPartialAccounts)(partialAccount, true);
                }
            }
            else {
                // if not compound accounts, do null/optional check and proceed
                if (partialAccount !== null) {
                    nestedAccountsGeneric[accountName] = (0, index_js_1.translateAddress)(partialAccount);
                }
                else if (accountItem["optional"]) {
                    nestedAccountsGeneric[accountName] = this._programId;
                }
            }
        }
        return nestedAccountsGeneric;
    }
    async resolveCustom() {
        if (this._customResolver) {
            const { accounts, resolved } = await this._customResolver({
                args: this._args,
                accounts: this._accounts,
                provider: this._provider,
                programId: this._programId,
                idlIx: this._idlIx,
            });
            this._accounts = accounts;
            return resolved;
        }
        return 0;
    }
    /**
     * Resolve event CPI accounts `eventAuthority` and `program`.
     *
     * Accounts will only be resolved if they are declared next to each other to
     * reduce the chance of name collision.
     */
    resolveEventCpi(accounts, path = []) {
        for (const i in accounts) {
            const accountOrAccounts = accounts[i];
            if ((0, idl_js_1.isCompositeAccounts)(accountOrAccounts)) {
                this.resolveEventCpi(accountOrAccounts.accounts, [
                    ...path,
                    accountOrAccounts.name,
                ]);
            }
            // Validate next index exists
            const nextIndex = +i + 1;
            if (nextIndex === accounts.length)
                return;
            const currentName = accounts[i].name;
            const nextName = accounts[nextIndex].name;
            // Populate event CPI accounts if they exist
            if (currentName === "eventAuthority" && nextName === "program") {
                const currentPath = [...path, currentName];
                const nextPath = [...path, nextName];
                if (!this.get(currentPath)) {
                    this.set(currentPath, web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], this._programId)[0]);
                }
                if (!this.get(nextPath)) {
                    this.set(nextPath, this._programId);
                }
                return;
            }
        }
    }
    resolveConst(accounts, path = []) {
        for (const accountOrAccounts of accounts) {
            const name = accountOrAccounts.name;
            if ((0, idl_js_1.isCompositeAccounts)(accountOrAccounts)) {
                this.resolveConst(accountOrAccounts.accounts, [...path, name]);
            }
            else {
                const account = accountOrAccounts;
                if ((account.signer || account.address) && !this.get([...path, name])) {
                    // Default signers to the provider
                    if (account.signer) {
                        if (!this._provider.wallet) {
                            throw new Error("This function requires the `Provider` interface implementor to have a `wallet` field.");
                        }
                        this.set([...path, name], this._provider.wallet.publicKey);
                    }
                    // Set based on `address` field
                    if (account.address) {
                        this.set([...path, name], (0, index_js_1.translateAddress)(account.address));
                    }
                }
            }
        }
    }
    async resolvePdasAndRelations(accounts, path = []) {
        let found = 0;
        for (const accountOrAccounts of accounts) {
            const name = accountOrAccounts.name;
            if ((0, idl_js_1.isCompositeAccounts)(accountOrAccounts)) {
                found += await this.resolvePdasAndRelations(accountOrAccounts.accounts, [...path, name]);
            }
            else {
                const account = accountOrAccounts;
                if ((account.pda || account.relations) && !this.get([...path, name])) {
                    found++;
                    // Accounts might not get resolved successfully if a seed depends on
                    // another seed to be resolved *and* the accounts for resolution are
                    // out of order. In this case, skip the accounts that throw in order
                    // to resolve those accounts later.
                    try {
                        if (account.pda) {
                            const seeds = await Promise.all(account.pda.seeds.map((seed) => this.toBuffer(seed, path)));
                            if (seeds.some((seed) => !seed)) {
                                continue;
                            }
                            const programId = await this.parseProgramId(account, path);
                            const [pubkey] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
                            this.set([...path, name], pubkey);
                        }
                    }
                    catch { }
                    try {
                        if (account.relations) {
                            const accountKey = this.get([...path, account.relations[0]]);
                            if (accountKey) {
                                const account = await this._accountStore.fetchAccount({
                                    publicKey: accountKey,
                                });
                                this.set([...path, name], account[name]);
                            }
                        }
                    }
                    catch { }
                }
            }
        }
        return found;
    }
    async parseProgramId(account, path = []) {
        var _a;
        if (!((_a = account.pda) === null || _a === void 0 ? void 0 : _a.program)) {
            return this._programId;
        }
        const buf = await this.toBuffer(account.pda.program, path);
        if (!buf) {
            throw new Error(`Program seed not resolved: ${account.name}`);
        }
        return new web3_js_1.PublicKey(buf);
    }
    async toBuffer(seed, path = []) {
        switch (seed.kind) {
            case "const":
                return this.toBufferConst(seed);
            case "arg":
                return await this.toBufferArg(seed);
            case "account":
                return await this.toBufferAccount(seed, path);
            default:
                throw new Error(`Unexpected seed: ${seed}`);
        }
    }
    toBufferConst(seed) {
        return this.toBufferValue("bytes", seed.value);
    }
    async toBufferArg(seed) {
        const [name, ...path] = seed.path.split(".");
        const index = this._idlIx.args.findIndex((arg) => arg.name === name);
        if (index === -1) {
            throw new Error(`Unable to find argument for seed: ${name}`);
        }
        const value = path.reduce((acc, path) => (acc !== null && acc !== void 0 ? acc : {})[path], this._args[index]);
        if (value === undefined) {
            return;
        }
        const type = this.getType(this._idlIx.args[index].type, path);
        return this.toBufferValue(type, value);
    }
    async toBufferAccount(seed, path = []) {
        const [name, ...paths] = seed.path.split(".");
        const fieldPubkey = this.get([...path, name]);
        if (!fieldPubkey)
            return;
        // The seed is a pubkey of the account.
        if (!paths.length) {
            return this.toBufferValue("pubkey", fieldPubkey);
        }
        if (!seed.account) {
            throw new Error(`Seed account is required in order to resolve type: ${seed.path}`);
        }
        // The key is account data.
        //
        // Fetch and deserialize it.
        const account = await this._accountStore.fetchAccount({
            publicKey: fieldPubkey,
            name: seed.account,
        });
        // Dereference all fields in the path to get the field value
        // used in the seed.
        let accountValue = account;
        let currentPaths = paths;
        while (currentPaths.length > 0) {
            accountValue = accountValue[currentPaths[0]];
            currentPaths = currentPaths.slice(1);
        }
        if (accountValue === undefined)
            return;
        const type = this.getType({ defined: { name: seed.account } }, paths);
        return this.toBufferValue(type, accountValue);
    }
    /**
     * Converts the given idl valaue into a Buffer. The values here must be
     * primitives, e.g. no structs.
     */
    toBufferValue(type, value) {
        switch (type) {
            case "u8":
            case "i8":
                return Buffer.from([value]);
            case "u16":
            case "i16":
                return new bn_js_1.default(value).toArrayLike(Buffer, "le", 2);
            case "u32":
            case "i32":
                return new bn_js_1.default(value).toArrayLike(Buffer, "le", 4);
            case "u64":
            case "i64":
                return new bn_js_1.default(value).toArrayLike(Buffer, "le", 8);
            case "u128":
            case "i128":
                return new bn_js_1.default(value).toArrayLike(Buffer, "le", 16);
            case "u256":
            case "i256":
                return new bn_js_1.default(value).toArrayLike(Buffer, "le", 32);
            case "string":
                return Buffer.from(value);
            case "pubkey":
                return value.toBuffer();
            case "bytes":
                return Buffer.from(value);
            default:
                if (type === null || type === void 0 ? void 0 : type.array) {
                    return Buffer.from(value);
                }
                throw new Error(`Unexpected seed type: ${type}`);
        }
    }
    /**
     * Recursively get the type at some path of either a primitive or a user
     * defined struct.
     */
    getType(type, path = []) {
        var _a;
        const typeName = (_a = type === null || type === void 0 ? void 0 : type.defined) === null || _a === void 0 ? void 0 : _a.name;
        if (typeName) {
            // Handle token account separately
            if (typeName === "tokenAccount") {
                switch (path.at(0)) {
                    case "mint":
                    case "owner":
                        return "pubkey";
                    case "amount":
                    case "delagatedAmount":
                        return "u64";
                    default:
                        throw new Error(`Unknown token account path: ${path}`);
                }
            }
            const definedType = this._idlTypes.find((t) => t.name === typeName);
            if (!definedType) {
                throw new Error(`Type not found: ${typeName}`);
            }
            // Only named structs are supported
            const [fieldName, ...subPath] = path;
            const fields = definedType.type
                .fields;
            const field = fields.find((field) => field.name === fieldName);
            if (!field) {
                throw new Error(`Field not found: ${fieldName}`);
            }
            return this.getType(field.type, subPath);
        }
        return type;
    }
}
exports.AccountsResolver = AccountsResolver;
// TODO: this should be configurable to avoid unnecessary requests.
class AccountStore {
    constructor(_provider, accounts, programId) {
        this._provider = _provider;
        this._cache = new Map();
        this._idls = {};
        this._idls[programId.toBase58()] = accounts;
    }
    async fetchAccount({ publicKey, name, }) {
        const address = publicKey.toBase58();
        if (!this._cache.has(address)) {
            const accountInfo = await this._provider.connection.getAccountInfo(publicKey);
            if (accountInfo === null) {
                throw new Error(`Account not found: ${address}`);
            }
            if (name === "tokenAccount") {
                const account = (0, token_account_layout_1.decodeTokenAccount)(accountInfo.data);
                this._cache.set(address, account);
            }
            else {
                const accounts = await this.getAccountsNs(accountInfo.owner);
                if (accounts) {
                    const accountNs = Object.values(accounts)[0];
                    if (accountNs) {
                        const account = accountNs.coder.accounts.decodeAny(accountInfo.data);
                        this._cache.set(address, account);
                    }
                }
            }
        }
        return this._cache.get(address);
    }
    async getAccountsNs(programId) {
        const programIdStr = programId.toBase58();
        if (!this._idls[programIdStr]) {
            const idl = await index_js_1.Program.fetchIdl(programId, this._provider);
            if (idl) {
                const program = new index_js_1.Program(idl, this._provider);
                this._idls[programIdStr] = program.account;
            }
        }
        return this._idls[programIdStr];
    }
}
//# sourceMappingURL=accounts-resolver.js.map