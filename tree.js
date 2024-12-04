import Node from "./treeNode.js";

export default class Tree {
    constructor(arr = []) {
        this.root = this.buildTree(arr); // buildTree returns the root.
    }

    buildTree(arr) {
        if (!arr.length) return null; // if the array is empty return null.

        arr = [...new Set(arr)].sort((a, b) => a - b); // Set removes duplicates and sort = ascending.

        const build = (start, end) => { // recursive func. splits the array and constructs the tree.
            if (start > end) return null; // base case. if start exceeds end, exit.

            const mid = Math.floor((start + end) / 2); // start and end defined since this needs to work on portions of the array.
            const node = new Node(arr[mid]); 
            
            node.left = build(start, mid - 1);
            node.right = build(mid + 1, end);

            return node;
        };
        return build(0, arr.length - 1);
    }

    insert(value) {
        const insertNode = (node, value) => { 
            if (!node) return new Node(value); // inserts new node at correct position. (base case).

            if (value < node.value) { // traverses by comparing to the param.
                node.left = insertNode(node.left, value); // assign to left or right after traversing to "save" any potential changes before returning.
            } else if (value > node.value) {
                node.right = insertNode(node.right, value);
            }
            return node; 
        }    

        this.root = insertNode(this.root, value); // starts the recursive call by starting at top of tree. // updates this.root in case tree was previously empty.
    }

    deleteItem(value) {
        const deleteNode = (node, value) => {
            if (!node) return null;

            if (value < node.value) {
                node.left = deleteNode(node.left, value);
            } else if (value > node.value) {
                node.right = deleteNode(node.right, value);
            } else {
                if (!node.right) return node.left; // effectively replaces the node being deleted. overwrite to delete.
                if (!node.left) return node.right;

                let successor = node.right; // need to find the next value that will maintain BST. higher than all in left sub, but lower than rest of right sub.
                while (successor.left) { // go as far down as possible on left side of right sub.
                    successor = successor.left;
                }
                node.value = successor.value; // save the smallest value in right subtree to replace the deleted node.
                node.right = deleteNode(node.right, successor.value); // deletes the in-order successor from the tree.
            }
            return node;
        }
        this.root = deleteNode(this.root, value);
    }

    find(value) {
        const searchNode = (node, value) => {
            if (!node) return false;
            if (node.value === value) return true;

            if (value < node.value) {
                return searchNode(node.left, value);
            } else {
                return searchNode(node.right, value);
            }
        }
        return searchNode(this.root, value);
    }

    levelOrder(callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback required");
        }

        if (!this.root) return; // no tree = no traversal.

        const queue = [this.root]; // init queue with the root node.

        while (queue.length > 0) {
            const currentNode = queue.shift(); // dequeue
            callback(currentNode);
            if (currentNode.left) queue.push(currentNode.left);
            if (currentNode.right) queue.push(currentNode.right);
        }

    }

    levelOrderRecurse(callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback required");
        }

        const height = this.getTreeHeight(this.root);

        for (let level = 1; level <= height; level++) {
            this.printLevel(this.root, level, callback); // process each level 
        }
    }

    getTreeHeight(node) { // recursive helper function for levelOrder. this will recursively count how deep each sub array from the root is.
        if (!node) return 0; // if there is nothing to "count" we don't want to add to the height.

        const leftHeight = this.getTreeHeight(node.left);
        const rightHeight = this.getTreeHeight(node.right);
        return Math.max(leftHeight, rightHeight) + 1; // gets whichever is longer
    }

    printLevel(node, level) {
        if (!node) return; // if node is null, do nothing.

        if (level === 1) {
            console.log(node.value);
        } else {
            this.printLevel(node.left, level - 1); // recurse into left subtree
            this.printLevel(node.right, level - 1); // recurse into right subtree.
        }
    }

    height(node) { // given node to farthest leaf IN ITS SUBTREE. useful for: calc height difference between subtrees and defining balance.
        if (!node) return -1; // -1 to account for edges (there will be one less edge than there are nodes to the root.)

        const left = this.height(node.left);
        const right = this.height(node.right);
        return Math.max(left, right) + 1;
    }

    depth(root, targetNode) {
        if (!root) return - 1;
        if (root === targetNode) return 0; // if the root if the target, height is 0. we then exit and the next bit doesn't run.

        // if the root isn't the target, we recurse down (where the next node becomes the new root) and we check again.
        const leftHeight = this.depth(root.left, targetNode);
        const rightHeight = this.depth(root.right, targetNode);

        if (leftHeight !== -1) { // if we have found the node, we will be returning 0 from that node. so if 0, we will be + 1 (we start counting edges from node back to the root).
            return leftHeight + 1;
        }
        if (rightHeight !== -1) {
            return rightHeight + 1;
        }

        return -1; // if the node is not found in either subtree.
    }

    isBalanced(root) {
        const checkBalance = (node) => {
            if (!node) return 0; // base case. this will happen when we hit a node with no children (ie we got to the bottom)

            const leftHeight = checkBalance(node.left); // given the root, we calc height of each subtree.
            const rightHeight = checkBalance(node.right);

            if (leftHeight === -1 || rightHeight === -1 || Math.abs(leftHeight - rightHeight) > 1) {
                return -1; // unbalanced. 
            }

            return Math.max(leftHeight, rightHeight) + 1; // returns height of tree.
        };
        
        return checkBalance(root) !== -1; // if result is -1, tree is unbalanced. 
    }

    inOrder(node, callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback required");
        }

        if (!node) return; // base case if node is null stop recursion.

        this.inOrder(node.left, callback); // traverse left subtree.
        callback(node); // visit current node.
        this.inOrder(node.right, callback); // traverse right subtree.
    }

    preOrder(node, callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback required");
        }

        if (!node) return; // base case if node is null stop recursion.

        callback(node); // visit current node.
        this.preOrder(node.left, callback); // traverse left subtree.
        this.preOrder(node.right, callback); // traverse right subtree.
    }

    postOrder(node, callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback required");
        }

        if (!node) return; // base case if node is null stop recursion.

        this.postOrder(node.left, callback); // traverse left subtree.
        this.postOrder(node.right, callback); // traverse right subtree.
        callback(node); // visit current node.
    }


    rebalance() {
       let oldTree = this.root;

       if (!this.isBalanced(oldTree)) {
            const sortedValues = []; 
            this.inOrder(oldTree, (node) => sortedValues.push(node.value)); // in order traversal.
            this.root = this.buildTree(sortedValues);
       } 

       return this.root;
    }
}

