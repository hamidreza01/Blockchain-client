"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var hash_creator_1 = require("../../Addon/hash-creator");
var Block_1 = require("./Block");
var config_1 = require("../../../config");
var Transaction_1 = require("./Transaction");
var Wallet_1 = require("./Wallet");
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [Block_1.Block.genesis()];
    }
    Blockchain.prototype.addBlock = function (data) {
        var block = Block_1.Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
    };
    Blockchain.isValid = function (chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block_1.Block.genesis()))
            return false;
        for (var i = 1; i < chain.length; i++) {
            if (chain[i].hash !==
                (0, hash_creator_1.hashCreator)(chain[i].lastHash, JSON.stringify(chain[i].data), chain[i].nonce.toString(), chain[i].difficulty.toString(), chain[i].timestamp.toString())) {
                return false;
            }
            if (chain[i].lastHash !== chain[i - 1].hash) {
                return false;
            }
            if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
                return false;
            }
        }
        return true;
    };
    Blockchain.prototype.replaceChain = function (chain) {
        if (chain.length < this.chain.length) {
            return { message: "chain is short", code: 101 };
        }
        if (!Blockchain.isValid(chain)) {
            return { message: "chain is not valid", code: 102 };
        }
        this.chain = chain;
        return true;
    };
    Blockchain.prototype.validTransactionData = function (chain) {
        var _a, _b, _c, _d;
        for (var i = 1; i < (chain === null || chain === void 0 ? void 0 : chain.length); i++) {
            if (((_c = (_b = (_a = chain[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.transaction) === null || _c === void 0 ? void 0 : _c.length) < 1)
                return { message: "chain data is empty", code: 120 };
            for (var _i = 0, _e = chain[i].data.transaction; _i < _e.length; _i++) {
                var transaction = _e[_i];
                var rewardNumber = 0;
                if (((_d = transaction === null || transaction === void 0 ? void 0 : transaction.inputMap) === null || _d === void 0 ? void 0 : _d.address) === config_1.config.REWARD_TRANSACTION.address) {
                    rewardNumber++;
                    if (rewardNumber > 1) {
                        return {
                            message: "reward transaction length is ivalid",
                            code: 122
                        };
                    }
                    if (Object.values(transaction.outputMap).reduce(function (all, val) { return (all + val); }) > config_1.config.REWARD) {
                        return { message: "reward transaction is invalid", code: 121 };
                    }
                }
                else {
                    var transactionResualt = Transaction_1.Transaction.isValid(transaction);
                    if (transactionResualt !== true) {
                        return transactionResualt;
                    }
                    else {
                        var trueValue = Wallet_1.Wallet.calculateBalance(this.chain, transaction.inputMap.address);
                        if (trueValue !== transaction.inputMap.amount) {
                            return { message: "transaction amount is invalid", code: 123 };
                        }
                    }
                }
            }
        }
        return true;
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
