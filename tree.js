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
}