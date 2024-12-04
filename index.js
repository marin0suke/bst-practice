import Tree from "./tree.js";

console.log("test");

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

  

const createRandomArray = (size) => {
    let randomNumbers = new Set(); // avoid duplicates.

    while (randomNumbers.size < size) {
        randomNumbers.add(Math.floor(Math.random() * 100)); // random numbers < 100.
    }

    return [...randomNumbers]; // convert Set to array.
}

const randomOne = createRandomArray(15);
console.log(randomOne);

const bst = new Tree(randomOne);
console.log(prettyPrint(bst.root));

console.log(bst.isBalanced(bst.root));
console.log(bst.levelOrder((node) => console.log(node.value)));
console.log(bst.inOrder(bst.root, (node) => console.log(node.value)));
console.log(bst.postOrder(bst.root, (node) => console.log(node.value)));
console.log(bst.preOrder(bst.root, (node) => console.log(node.value)));

bst.insert(101);
bst.insert(109);
bst.insert(105);
bst.insert(111);
bst.insert(145);

console.log(bst.isBalanced(bst.root));
bst.rebalance();
console.log(bst.isBalanced(bst.root));
console.log(prettyPrint(bst.root));

console.log(bst.levelOrder((node) => console.log(node.value)));
console.log(bst.inOrder(bst.root, (node) => console.log(node.value)));
console.log(bst.postOrder(bst.root, (node) => console.log(node.value)));
console.log(bst.preOrder(bst.root, (node) => console.log(node.value)));