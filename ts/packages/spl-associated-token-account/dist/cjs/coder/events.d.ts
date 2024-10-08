import { Idl, Event, EventCoder } from "@coral-xyz/anchor";
import { IdlEvent } from "@coral-xyz/anchor/dist/cjs/idl";
export declare class SplAssociatedTokenAccountEventsCoder implements EventCoder {
    constructor(_idl: Idl);
    decode<E extends IdlEvent = IdlEvent, T = Record<string, string>>(_log: string): Event<E, T> | null;
}
//# sourceMappingURL=events.d.ts.map