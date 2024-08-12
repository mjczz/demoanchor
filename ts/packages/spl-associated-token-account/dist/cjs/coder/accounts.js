"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenAccountAccountsCoder = void 0;
class SplAssociatedTokenAccountAccountsCoder {
    constructor(_idl) { }
    async encode(accountName, account) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    memcmp(accountName, _appendData) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(accountName) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
}
exports.SplAssociatedTokenAccountAccountsCoder = SplAssociatedTokenAccountAccountsCoder;
//# sourceMappingURL=accounts.js.map