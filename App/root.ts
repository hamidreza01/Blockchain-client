import { Root } from "../Src/classes/Network/Root";
import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";
import { _Nodes } from "../Src/interfaces/Network/_Nodes";
import { _Root } from "../Src/interfaces/Network/_Root";
import { _Block } from "../Src/interfaces/Blockchain/_Block";
export default function (
  blockChain: _Blockchain,
  nodes: _Nodes,
  port: number
): void {
  const root: _Root = new Root(port);
  root
    .start()
    .then((value) => {
      nodes.start(blockChain);
      root.addMe();
    })
    .catch((err) => {
      console.log(err);
    });

  root.bet("welcome", (data : any) => {
    nodes.list = data.nodeList;
    blockChain.chain = data.chain;
    
  });

  root.bet("sliceChain", (data: number) => {
    blockChain.chain = blockChain.chain.filter((x, i) => {
      return i < data;
    });
  });

  root.bet("reaplceChain", (data: Array<_Block>) => {
    blockChain.chain = data;
  });

  root.bet("replaceNodes", (data: Array<string>) => {
    nodes.list = data;
  });

  root.bet("newNode", (data: string) => {
    nodes.list.push(data);
    console.log(nodes.list);
  });

  root.bet("giveMeData", () => {
    root.giveData(blockChain.chain, nodes.list);
  });
}