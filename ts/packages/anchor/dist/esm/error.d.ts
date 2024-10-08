import { PublicKey } from "@solana/web3.js";
export declare class IdlError extends Error {
    constructor(message: string);
}
interface ErrorCode {
    code: string;
    number: number;
}
interface FileLine {
    file: string;
    line: number;
}
type Origin = string | FileLine;
type ComparedAccountNames = [string, string];
type ComparedPublicKeys = [PublicKey, PublicKey];
type ComparedValues = ComparedAccountNames | ComparedPublicKeys;
export declare class ProgramErrorStack {
    readonly stack: PublicKey[];
    constructor(stack: PublicKey[]);
    static parse(logs: string[]): ProgramErrorStack;
}
export declare class AnchorError extends Error {
    readonly errorLogs: string[];
    readonly logs: string[];
    readonly error: {
        errorCode: ErrorCode;
        errorMessage: string;
        comparedValues?: ComparedValues;
        origin?: Origin;
    };
    private readonly _programErrorStack;
    constructor(errorCode: ErrorCode, errorMessage: string, errorLogs: string[], logs: string[], origin?: Origin, comparedValues?: ComparedValues);
    static parse(logs: string[]): AnchorError | null;
    get program(): PublicKey;
    get programErrorStack(): PublicKey[];
    toString(): string;
}
export declare class ProgramError extends Error {
    readonly code: number;
    readonly msg: string;
    readonly logs?: string[] | undefined;
    private readonly _programErrorStack?;
    constructor(code: number, msg: string, logs?: string[] | undefined);
    static parse(err: any, idlErrors: Map<number, string>): ProgramError | null;
    get program(): PublicKey | undefined;
    get programErrorStack(): PublicKey[] | undefined;
    toString(): string;
}
export declare function translateError(err: any, idlErrors: Map<number, string>): any;
export declare const LangErrorCode: {
    InstructionMissing: number;
    InstructionFallbackNotFound: number;
    InstructionDidNotDeserialize: number;
    InstructionDidNotSerialize: number;
    IdlInstructionStub: number;
    IdlInstructionInvalidProgram: number;
    IdlAccountNotEmpty: number;
    EventInstructionStub: number;
    ConstraintMut: number;
    ConstraintHasOne: number;
    ConstraintSigner: number;
    ConstraintRaw: number;
    ConstraintOwner: number;
    ConstraintRentExempt: number;
    ConstraintSeeds: number;
    ConstraintExecutable: number;
    ConstraintState: number;
    ConstraintAssociated: number;
    ConstraintAssociatedInit: number;
    ConstraintClose: number;
    ConstraintAddress: number;
    ConstraintZero: number;
    ConstraintTokenMint: number;
    ConstraintTokenOwner: number;
    ConstraintMintMintAuthority: number;
    ConstraintMintFreezeAuthority: number;
    ConstraintMintDecimals: number;
    ConstraintSpace: number;
    ConstraintAccountIsNone: number;
    ConstraintTokenTokenProgram: number;
    ConstraintMintTokenProgram: number;
    ConstraintAssociatedTokenTokenProgram: number;
    ConstraintMintGroupPointerExtension: number;
    ConstraintMintGroupPointerExtensionAuthority: number;
    ConstraintMintGroupPointerExtensionGroupAddress: number;
    ConstraintMintGroupMemberPointerExtension: number;
    ConstraintMintGroupMemberPointerExtensionAuthority: number;
    ConstraintMintGroupMemberPointerExtensionMemberAddress: number;
    ConstraintMintMetadataPointerExtension: number;
    ConstraintMintMetadataPointerExtensionAuthority: number;
    ConstraintMintMetadataPointerExtensionMetadataAddress: number;
    ConstraintMintCloseAuthorityExtension: number;
    ConstraintMintCloseAuthorityExtensionAuthority: number;
    ConstraintMintPermanentDelegateExtension: number;
    ConstraintMintPermanentDelegateExtensionDelegate: number;
    ConstraintMintTransferHookExtension: number;
    ConstraintMintTransferHookExtensionAuthority: number;
    ConstraintMintTransferHookExtensionProgramId: number;
    RequireViolated: number;
    RequireEqViolated: number;
    RequireKeysEqViolated: number;
    RequireNeqViolated: number;
    RequireKeysNeqViolated: number;
    RequireGtViolated: number;
    RequireGteViolated: number;
    AccountDiscriminatorAlreadySet: number;
    AccountDiscriminatorNotFound: number;
    AccountDiscriminatorMismatch: number;
    AccountDidNotDeserialize: number;
    AccountDidNotSerialize: number;
    AccountNotEnoughKeys: number;
    AccountNotMutable: number;
    AccountOwnedByWrongProgram: number;
    InvalidProgramId: number;
    InvalidProgramExecutable: number;
    AccountNotSigner: number;
    AccountNotSystemOwned: number;
    AccountNotInitialized: number;
    AccountNotProgramData: number;
    AccountNotAssociatedTokenAccount: number;
    AccountSysvarMismatch: number;
    AccountReallocExceedsLimit: number;
    AccountDuplicateReallocs: number;
    DeclaredProgramIdMismatch: number;
    TryingToInitPayerAsProgramAccount: number;
    InvalidNumericConversion: number;
    Deprecated: number;
};
export declare const LangErrorMessage: Map<number, string>;
export {};
//# sourceMappingURL=error.d.ts.map