#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fsExtra = require('fs-extra');
var flowgen = require('flowgen').default;
var path = require('path');
var chalk = require('chalk').default;
function containsNoExports(file) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContents, emptyExportRegExp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsExtra.readFile(file)];
                case 1:
                    fileContents = _a.sent();
                    emptyExportRegExp = /^[\s]*[export]?\{?[\s]*\}?[\s]*$/;
                    if (emptyExportRegExp.test(fileContents)) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function excapeRegExpString(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function getFlowName(file, topLevelDir) {
    return file
        .replace(/\.d\.ts$/, '.js')
        .replace(new RegExp('^' + excapeRegExpString(topLevelDir)), 'flow-typed' + path.sep)
        .replace(path.sep + path.sep, path.sep);
}
function processIfTS(entry, topLevelDir) {
    return __awaiter(this, void 0, void 0, function () {
        var flowCode, flowName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!entry.endsWith('.d.ts')) return [3 /*break*/, 3];
                    return [4 /*yield*/, containsNoExports(entry)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/];
                    }
                    flowCode = flowgen.beautify(flowgen.compiler.compileDefinitionFile(entry));
                    flowName = getFlowName(entry, topLevelDir);
                    console.log(entry + ' -> ' + chalk.green(flowName));
                    return [4 /*yield*/, fsExtra.outputFile(flowName, flowCode)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function processEntry(entry, topLevelDir) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 5]);
                    return [4 /*yield*/, fsExtra.ensureDir(entry)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, generateFlowTypes(entry, topLevelDir)];
                case 2:
                    _a.sent();
                    console.log(chalk.green("Processed " + entry));
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    return [4 /*yield*/, processIfTS(entry, topLevelDir)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function generateFlowTypes(dir, topLevelDir) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, dir_1, d, entries, _a, entries_1, entry;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(dir instanceof Array)) return [3 /*break*/, 5];
                    _i = 0, dir_1 = dir;
                    _b.label = 1;
                case 1:
                    if (!(_i < dir_1.length)) return [3 /*break*/, 4];
                    d = dir_1[_i];
                    return [4 /*yield*/, generateFlowTypes(d, topLevelDir)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 10];
                case 5: return [4 /*yield*/, fsExtra.readdir(dir)];
                case 6:
                    entries = _b.sent();
                    _a = 0, entries_1 = entries;
                    _b.label = 7;
                case 7:
                    if (!(_a < entries_1.length)) return [3 /*break*/, 10];
                    entry = entries_1[_a];
                    return [4 /*yield*/, processEntry(path.join(dir, entry), topLevelDir || dir)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10: return [2 /*return*/];
            }
        });
    });
}
var directories = process.argv.splice(2);
var _loop_1 = function (dir) {
    generateFlowTypes(dir).catch(function (e) {
        console.error(chalk.red("Could not process directory " + dir + "\n"), e);
    });
};
for (var _i = 0, directories_1 = directories; _i < directories_1.length; _i++) {
    var dir = directories_1[_i];
    _loop_1(dir);
}
