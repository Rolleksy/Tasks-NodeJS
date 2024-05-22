class Stack {
    constructor() {
        this.stack = [];
    }

    push(value) {
        if (this.stack.length === 0) {
            this.stack[0] = value;
            return;
        }
        for (let i = this.stack.length - 1; i >= 0; i--) {
            this.stack[i + 1] = this.stack[i];
        }
        this.stack[0] = value;
    }

    pop() {
        let popVal = this.stack[0];
        this.stack.forEach((val, index) => {
            this.stack[index] = this.stack[index + 1];
        });
        this.stack.length = this.stack.length - 1;
        return popVal;
    }

    peek() {
        return this.stack[0];
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    size() {
        return this.stack.length;
    }
}
class MinMaxStack {
    constructor() {
        this.stack = new Stack();
        this.minStack = new Stack();
        this.maxStack = new Stack();
    }

    push(value) {
        this.stack.push(value);

        if (this.minStack.length === 0 || value <= this.getMin()) {
            this.minStack.push(value);
        } else {
            this.minStack.push(this.getMin());
        }

        if (this.maxStack.length === 0 || value >= this.getMax()) {
            this.maxStack.push(value);
        } else {
            this.maxStack.push(this.getMax());
        }
    }

    pop() {
        if (this.stack.length === 0) {
            throw new Error("Stack is empty");
        }
        this.minStack.pop();
        this.maxStack.pop();
        return this.stack.pop();
    }

    getMin() {
        if (this.minStack.length === 0) {
            throw new Error("Stack is empty");
        }
        return this.minStack[this.minStack.length - 1];
    }

    getMax() {
        if (this.maxStack.length === 0) {
            throw new Error("Stack is empty");
        }
        return this.maxStack[this.maxStack.length - 1];
    }
}

class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(value) {
        if (this.queue.length === 0) {
            this.queue[0] = value;
            return;
        }
        this.queue[this.queue.length] = value;
    }

    dequeue() {
        let dequeuedVal = this.queue[0];
        this.queue.forEach((val, index) => {
            this.queue[index] = this.queue[index + 1];
        });
        this.queue.length = this.queue.length - 1;
        return dequeuedVal;
    }

    peek() {
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }
}

class BTNode {
    constructor(key, value, parent = null) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }

    get isLeaf() {
        return this.left === null && this.right === null;
    }

    get hasChildren() {
        return !this.isLeaf;
    }
}
class BinaryTree {
    constructor(key, value = key) {
        this.root = new BTNode(key, value);
    }

    inOrderTraversal(node = this.root) {
        const result = [];
        const stack = [];
        let current = node;

        while (current !== null || stack.length > 0) {
            while (current !== null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            result.push(current);
            current = current.right;
        }

        return result;
    }

    postOrderTraversal(node = this.root) {
        const result = [];
        const stack = [node];
        const output = [];

        while (stack.length > 0) {
            const current = stack.pop();
            output.push(current);
            if (current.left) stack.push(current.left);
            if (current.right) stack.push(current.right);
        }

        while (output.length > 0) {
            result.push(output.pop());
        }

        return result;
    }

    preOrderTraversal(node = this.root) {
        const result = [];
        const stack = [node];

        while (stack.length > 0) {
            const current = stack.pop();
            result.push(current);
            if (current.right) stack.push(current.right);
            if (current.left) stack.push(current.left);
        }

        return result;
    }

    insert(parentNodeKey, key, value = key, {
        left,
        right
    } = {
        left: true,
        right: true
    }) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                const canInsertLeft = left && node.left === null;
                const canInsertRight = right && node.right === null;
                if (!canInsertLeft && !canInsertRight) return false;
                if (canInsertLeft) {
                    node.left = new BTNode(key, value, node);
                    return true;
                }
                if (canInsertRight) {
                    node.right = new BTNode(key, value, node);
                    return true;
                }
            }
        }
        return false;
    }

    remove(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.left && node.left.key === key) {
                node.left = null;
                return true;
            }
            if (node.right && node.right.key === key) {
                node.right = null;
                return true;
            }
        }
        return false;
    }

    find(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }

    isBST() {
        return this.isBSTFunction(this.root, null, null);
    }

    isBSTFunction(node, min, max) {
        if (!node) return true;
        if ((min !== null && node.value <= min) || (max !== null && node.value >= max)) {
            return false;
        }
        return this.isBSTFunction(node.left, min, node.value) && this.isBSTFunction(node.right, node.value, max);
    }
}

class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2, weight = 1) {
        this.adjacencyList[vertex1].push({
            node: vertex2,
            weight
        });
        this.adjacencyList[vertex2].push({
            node: vertex1,
            weight
        });
    }

    removeEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
            v => v.node !== vertex2
        );
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
            v => v.node !== vertex1
        );
    }

    removeVertex(vertex) {
        while (this.adjacencyList[vertex].length) {
            const adjacentVertex = this.adjacencyList[vertex].pop().node;
            this.removeEdge(vertex, adjacentVertex);
        }
        delete this.adjacencyList[vertex];
    }

    depthFirstSearch(start) {
        const result = [];
        const visited = {};
        const adjacencyList = this.adjacencyList;

        (function dfs(vertex) {
            if (!vertex) return null;
            visited[vertex] = true;
            result.push(vertex);
            adjacencyList[vertex].forEach(neighbor => {
                if (!visited[neighbor.node]) {
                    return dfs(neighbor.node);
                }
            });
        })(start);

        return result;
    }

    breadthFirstSearch(start) {
        const queue = [start];
        const result = [];
        const visited = {};
        let currentVertex;

        visited[start] = true;

        while (queue.length) {
            currentVertex = queue.shift();
            result.push(currentVertex);

            this.adjacencyList[currentVertex].forEach(neighbor => {
                if (!visited[neighbor.node]) {
                    visited[neighbor.node] = true;
                    queue.push(neighbor.node);
                }
            });
        }

        return result;
    }

    dijkstra(start, end) {
        const distances = {};
        const priorityQueue = new PriorityQueue();
        const previous = {};
        const path = [];
        let smallest;

        // Initialize distances and priority queue
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                priorityQueue.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                priorityQueue.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        while (priorityQueue.values.length) {
            smallest = priorityQueue.dequeue().val;

            if (smallest === end) {
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }

            if (smallest || distances[smallest] !== Infinity) {
                this.adjacencyList[smallest].forEach(neighbor => {
                    let candidate = distances[smallest] + neighbor.weight;
                    let nextNeighbor = neighbor.node;

                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate;
                        previous[nextNeighbor] = smallest;
                        priorityQueue.enqueue(nextNeighbor, candidate);
                    }
                });
            }
        }

        return path.concat(smallest).reverse();
    }

    bfsShortestPath(start, end) {
        const queue = [start];
        const visited = {
            [start]: true
        };
        const previous = {};
        let current;

        while (queue.length) {
            current = queue.shift();

            if (current === end) {
                const pathStack = new Stack();
                while (current !== start) {
                    pathStack.push(current);
                    current = previous[current];
                }
                pathStack.push(start);

                const path = [];
                while (!pathStack.isEmpty()) {
                    path.push(pathStack.pop());
                }
                return path;
            }

            this.adjacencyList[current].forEach(neighbor => {
                if (!visited[neighbor.node]) {
                    visited[neighbor.node] = true;
                    previous[neighbor.node] = current;
                    queue.push(neighbor.node);
                }
            });
        }

        return [];
    }




}
class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({
            val,
            priority
        });
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
    }

    insertNode(value) {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    deleteNode(value) {
        if (!this.head) {
            console.log("List is empty, cannot delete node.");
            return false;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            return true;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.value === value) {
                current.next = current.next.next;
                return true;
            }
            current = current.next;
        }
        console.log("Node with value", value, "not found.");
        return false;
    }



    searchNode(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    printList() {
        const visited = new Set();
        let current = this.head;
        const elements = [];

        while (current) {
            if (visited.has(current)) {
                console.log("List is cyclic");
                console.log(elements.join(' -> '));
                break;
            }

            visited.add(current);
            elements.push(current.value);
            current = current.next;
        }
        if (!current) {
            console.log(elements.join(' -> '));
        }
    }


    cycleDetection() {
        let slow = this.head;
        let fast = this.head;

        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow === fast) {
                return true;
            }
        }

        return false;

    }
}


module.exports = {
    Stack,
    MinMaxStack,
    Queue,
    BinaryTree,
    Graph,
    LinkedList
};