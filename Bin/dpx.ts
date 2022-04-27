#!/usr/bin/env node
import { Command } from "commander";
import axios from "axios";
import color from "ansicolor";

const cli = new Command();

const line = color.red("\n" + "-".repeat(process.stdout.columns) + "\n");
cli.version("1.0.0");

cli
  .command("start")
  .description("start node")
  .option("-a, --api", "enable api response")
  .action((option) => {
    axios
      .post("http://127.0.0.1:7612/start")
      .then((res) => {
        if (option.api) {
          return console.log(JSON.stringify(res.data));
        }
        console.log(
          `${line} ${color.bright.green(
            "node started"
          )}\n  Admin Wallet :\n   Public Key : ${color.blue(
            res.data.mainWallet.publicKey
          )}\n   Private Key : ${color.red(
            res.data.mainWallet.privateKey
          )}${line}`
        );
      })
      .catch(() => {});
  });
cli
  .command("chain")
  .description("manage your node chain")
  .option("-a, --api", "enable api response")
  .option("-l, --log", "save chain log")
  .option("-r, --restart", "restart chain")
  .action((option) => {
    if (option.restart) {
      axios
        .post("http://127.0.0.1:7612/restart")
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          if (!res.data.status) {
            return console.log(res.data.message);
          }
          return console.log(
            `${line} ${color.bright.green("chain restarted")}\n${line}`
          );
        })
        .catch(() => {});
    } else if (option.log) {
      axios
        .post("http://127.0.0.1:7612/chain/log", {
          location: process.cwd() + "/chain.log",
        })
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          if (!res.data.status) {
            return console.log(res.data.message);
          }
          console.log(
            `${line} ${color.bright.green(
              "chain log saved"
            )}\n  Location : ${color.blue(process.cwd() + "/chain.log")}${line}`
          );
        })
        .catch(() => {});
    }
  });

cli
  .command("wallet")
  .description("manage your node wallets")
  .option("-a, --api", "enable api response")
  .option("-c, --create", "create a wallet")
  .option("-b, --balance <publicKey>", "balance of wallet with address")
  .action((option) => {
    if (option.create) {
      axios
        .post("http://127.0.0.1:7612/wallet/create")
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          if (!res.data.status) {
            return console.log(res.data.message);
          }
          console.log(
            `${line} ${color.bright.green(
              "wallet created"
            )}\n  Wallet :\n   Public Key : ${color.blue(
              res.data.wallet.publicKey
            )}\n   Private Key : ${color.red(
              res.data.wallet.privateKey
            )}${line}`
          );
        })
        .catch(() => {});
    } else if (option.balance) {
      axios
        .post("http://127.0.0.1:7612/wallet/balance/" + option.balance)
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          if (!res.data.status) {
            return console.log(res.data.message);
          }
          console.log(
            `${line} ${color.bright.green(
              "wallet balance"
            )}\n  Balance : ${color.blue(res.data.wallet.balance)}${line}`
          );
        })
        .then(() => {});
    }
  });

cli
  .command("mine")
  .description("node mining manege")
  .option("-a, --api", "enable api response")
  .option("-c, --core <number>", "select cpu core for mining")
  .option("-s, --stop", "stop mining")
  .action((option) => {
    if (option.stop) {
      axios
        .post("http://127.0.0.1:7612/mine/stop")
        .then((res) => {
          console.log(res);
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          if (!res.data.status) {
            return console.log(res.data.message);
          }
          console.log(`${line} ${color.bright.green("mining stopped")}${line}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (option.core) {
      axios
        .post("http://127.0.0.1:7612/mine/start/" + option.core)
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          console.log(`${line} ${color.bright.green("mining started")}${line}`);
        })
        .catch(() => {});
    } else {
      axios
        .post("http://127.0.0.1:7612/mine/start/1")
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          console.log(`${line} ${color.bright.green("mining started")}${line}`);
        })
        .catch(() => {});
    }
  });

cli
  .command("transaction")
  .description("manage your node transactions")
  .option("-a, --api", "enable api response")
  .option("-fpub,--fromPublic <publicKey>", "from public address")
  .option("-fpri,--fromPrivate <privateKey>", "from private address")
  .option("-tpub,--toPublic <publicKey>", "to public address")
  .option("-v,--value <number>", "Transfer Value")
  .action((option) => {
    if (
      option.fromPublic &&
      option.toPublic &&
      option.fromPrivate &&
      option.value
    ) {
      axios
        .post("http://127.0.0.1:7612/transaction/create", {
          fromPublicKey: option.fromPublic,
          toPublic: option.toPublic,
          amount: option.value,
        })
        .then((res) => {
          if (option.api) {
            return console.log(JSON.stringify(res.data));
          }
          console.log(res.data);
        })
        .catch(() => {});
    }
  });

cli.parse(process.argv);
