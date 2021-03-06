import express from "express";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import axios from "axios";
import { _Nodes } from "../../interfaces/Network/_Nodes";
export class Nodes implements _Nodes {
  list: Array<string> = [""];
  private app = express();
  private blockChain: any;
  constructor(private port: number) {}
  start(): void {
    this.app.use(express.json());
    this.app.listen(this.port/*,"0.0.0.0"*/);
  }
  async broadcast(name: string, data: any): Promise<void> {
    return new Promise(async (res) => {
      for (let i = 0; i < this.list.length; i++) {
        try {
          await axios.post(`http://${this.list[i]}/${name}`, data);
          console.log(`success send ${this.list[i]} with ${name} channel`);
        } catch (error) {
          console.log(`Error brodcast to ${this.list[i]} with ${name} channel`);
        }
      }
      res;
    });
  }
  bet(name: string, callback: Function): void {
    this.app.use(express.json());
    this.app.post("/" + name, (req, res) => {
      callback(req.body);
      res.send("ok");
    });
  }
}
