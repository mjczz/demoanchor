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
Object.defineProperty(exports, "__esModule", { value: true });
const toml = __importStar(require("toml"));
const snake_case_1 = require("snake-case");
const index_js_1 = require("./program/index.js");
const common_js_1 = require("./utils/common.js");
/**
 * The `workspace` namespace provides a convenience API to automatically
 * search for and deserialize [[Program]] objects defined by compiled IDLs
 * in an Anchor workspace.
 *
 * This API is for Node only.
 */
const workspace = new Proxy({}, {
    get(workspaceCache, programName) {
        var _a, _b;
        if (common_js_1.isBrowser) {
            throw new Error("Workspaces aren't available in the browser");
        }
        // Converting `programName` to snake_case enables the ability to use any
        // of the following to access the workspace program:
        // `workspace.myProgram`, `workspace.MyProgram`, `workspace["my-program"]`...
        programName = (0, snake_case_1.snakeCase)(programName);
        // Check whether the program name contains any digits
        if (/\d/.test(programName)) {
            // Numbers cannot be properly converted from camelCase to snake_case,
            // e.g. if the `programName` is `myProgram2`, the actual program name could
            // be `my_program2` or `my_program_2`. This implementation assumes the
            // latter as the default and always converts to `_numbers`.
            //
            // A solution to the conversion of program names with numbers in them
            // would be to always convert the `programName` to camelCase instead of
            // snake_case. The problem with this approach is that it would require
            // converting everything else e.g. program names in Anchor.toml and IDL
            // file names which are both snake_case.
            programName = programName
                .replace(/\d+/g, (match) => "_" + match)
                .replace("__", "_");
        }
        // Return early if the program is in cache
        if (workspaceCache[programName])
            return workspaceCache[programName];
        const fs = require("fs");
        const path = require("path");
        // Override the workspace programs if the user put them in the config.
        const anchorToml = toml.parse(fs.readFileSync("Anchor.toml"));
        const clusterId = anchorToml.provider.cluster;
        const programEntry = (_b = (_a = anchorToml.programs) === null || _a === void 0 ? void 0 : _a[clusterId]) === null || _b === void 0 ? void 0 : _b[programName];
        let idlPath;
        let programId;
        if (typeof programEntry === "object" && programEntry.idl) {
            idlPath = programEntry.idl;
            programId = programEntry.address;
        }
        else {
            idlPath = path.join("target", "idl", `${programName}.json`);
        }
        if (!fs.existsSync(idlPath)) {
            throw new Error(`${idlPath} doesn't exist. Did you run \`anchor build\`?`);
        }
        const idl = JSON.parse(fs.readFileSync(idlPath));
        if (programId) {
            idl.address = programId;
        }
        workspaceCache[programName] = new index_js_1.Program(idl);
        return workspaceCache[programName];
    },
});
exports.default = workspace;
//# sourceMappingURL=workspace.js.map