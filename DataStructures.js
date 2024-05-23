// Stack class - LIFO
class Stack {
    constructor() {
        this.stack = [];
    }

    // Adds an element to the top of the stack
    push(value) {
        this.stack.push(value);
    }

    // Removes and returns the top element from the stack
    pop() {
        return this.stack.pop();
    }

    // Returns the top element from the stack without removing it
    peek() {
        return this.stack[this.stack.length - 1];
    }

    // Checks if the stack is empty
    isEmpty() {
        return this.stack.length === 0;
    }

    // Returns the number of elements in the stack
    size() {
        return this.stack.length;
    }
}
// MinMaxStack class - helps to get min and max values from the stack
class MinMaxStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
        this.maxStack = [];
    }

    // Adds an element to the stack
    push(value) {
        this.stack.push(value);

        // Updates the minStack with the minimum value so far
        if (this.minStack.length === 0 || value <= this.getMin()) {
            this.minStack.push(value);
        } else {
            this.minStack.push(this.getMin());
        }

        // Updates the maxStack with the maximum value so far
        if (this.maxStack.length === 0 || value >= this.getMax()) {
            this.maxStack.push(value);
        } else {
            this.maxStack.push(this.getMax());
        }
    }

    // Removes and return the top element from the stack
    pop() {
        if (this.stack.length === 0) {
            throw new Error("Stack is empty");
        }
        this.minStack.pop();
        this.maxStack.pop();
        return this.stack.pop();
    }

    // Returns the minimum value in the stack
    getMin() {
        if (this.minStack.length === 0) {
            throw new Error("Stack is empty");
        }
        return this.minStack[this.minStack.length - 1];
    }

    // Returns the maximum value in the stack
    getMax() {
        if (this.maxStack.length === 0) {
            throw new Error("Stack is empty");
        }
        return this.maxStack[this.maxStack.length - 1];
    }
}

// Queue class - FIFO
class Queue {
    constructor() {
        this.queue = [];
    }

    // Adds an element to the end of the queue
    enqueue(value) {
        if (this.queue.length === 0) {
            this.queue[0] = value;
            return;
        }
        this.queue[this.queue.length] = value;
    }

    // Removes and return the first element from the queue
    dequeue() {
        let dequeuedVal = this.queue[0];
        this.queue.forEach((val, index) => {
            this.queue[index] = this.queue[index + 1];
        });
        this.queue.length = this.queue.length - 1;
        return dequeuedVal;
    }

    // Returns the first element from the queue without removing it
    peek() {
        return this.queue[0];
    }

    // Checks if the queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }

    // Returns the number of elements in the queue
    size() {
        return this.queue.length;
    }
}

// Binary Tree class
// Node class to represent the nodes in the binary tree
class BTNode {
    constructor(key, value, parent = null) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }

    // Checks if the node is a leaf node (has no children)
    get isLeaf() {
        return this.left === null && this.right === null;
    }

    // Checks if the node has any children
    get hasChildren() {
        return !this.isLeaf;
    }
}
class BinaryTree {
    constructor(key, value = key) {
        this.root = new BTNode(key, value);
    }

    // Performs in-order traversal of the binary tree
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

    // Performs post-order traversal of the binary tree
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

    // Performs pre-order traversal of the binary tree
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

    // Inserts a new node into the binary tree
    insert(key, value = key) {
        const newNode = new BTNode(key, value);
        const queue = [this.root];

        while (queue.length > 0) {
            const current = queue.shift();

            if (!current.left) {
                current.left = newNode;
                newNode.parent = current;
                return true;
            } else {
                queue.push(current.left);
            }

            if (!current.right) {
                current.right = newNode;
                newNode.parent = current;
                return true;
            } else {
                queue.push(current.right);
            }
        }

        return false;
    }

    // Removes a node from the binary tree
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

    // Finds a node in the binary tree
    find(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }

    // Checks if the binary tree is a binary search tree (BST)
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

// Graph class
class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    // Adds a vertex to the graph
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    // Adds an edge between two vertices in the graph
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

    // Removes an edge between two vertices in the graph
    removeEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
            v => v.node !== vertex2
        );
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
            v => v.node !== vertex1
        );
    }

    // Removes a vertex from the graph
    removeVertex(vertex) {
        while (this.adjacencyList[vertex].length) {
            const adjacentVertex = this.adjacencyList[vertex].pop().node;
            this.removeEdge(vertex, adjacentVertex);
        }
        delete this.adjacencyList[vertex];
    }

    // Performs depth-first search (DFS) on the graph
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

    // Performs breadth-first search (BFS) on the graph
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

    // Finds the shortest path between two vertices using Dijkstra's algorithm - weighted graph
    dijkstra(start, end) {
        const distances = {}; // Object to store the shortest distance to each vertex
        const priorityQueue = new PriorityQueue(); // Priority queue to manage the next vertex to process
        const previous = {}; // Object to store the previous vertex in the shortest path
        const path = []; // Array to store the shortest path
        let smallest; // Variable to hold the current vertex with the smallest distance

        // Initializes distances and priority queue
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0; // Distance to the start vertex is 0
                priorityQueue.enqueue(vertex, 0); // Enqueue start vertex with priority 0
            } else {
                distances[vertex] = Infinity; // Distance to all other vertices is Infinity
                priorityQueue.enqueue(vertex, Infinity); // Enqueue other vertices with priority Infinity
            }
            previous[vertex] = null; // No previous vertex for any vertex initially
        }

        // Loop until there are vertices in the priority queue
        while (priorityQueue.values.length) {
            smallest = priorityQueue.dequeue().val; // Dequeue vertex with the smallest distance

            if (smallest === end) {
                // Reconstructs the shortest path
                while (previous[smallest]) {
                    path.push(smallest); // Push the vertex to the path
                    smallest = previous[smallest]; // Move to the previous vertex
                }
                break; // Exit loop when the end vertex is reached
            }

            if (smallest || distances[smallest] !== Infinity) {
                // Updates distances and previous for neighboring vertices
                this.adjacencyList[smallest].forEach(neighbor => {
                    let candidate = distances[smallest] + neighbor.weight; // Calculate new distance to neighbor
                    let nextNeighbor = neighbor.node; // Get neighbor vertex

                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate; // Update distance to neighbor
                        previous[nextNeighbor] = smallest; // Update previous vertex for neighbor
                        priorityQueue.enqueue(nextNeighbor, candidate); // Enqueue neighbor with new priority
                    }
                });
            }
        }

        return path.concat(smallest).reverse(); // Return the shortest path in the correct order
    }

    // Finds the shortest path between two vertices using breadth-first search (BFS)
    bfsShortestPath(start, end) {
        const queue = [start]; // Queue to manage the vertices to process
        const visited = {
            [start]: true
        }; // Object to track visited vertices
        const previous = {}; // Object to store the previous vertex in the shortest path
        let current; // Variable to hold the current vertex being processed

        // Loop until there are vertices in the queue
        while (queue.length) {
            current = queue.shift(); // Dequeue the first vertex

            if (current === end) {
                // Reconstructs the shortest path
                const pathStack = new Stack(); // Stack to store the path in reverse order
                while (current !== start) {
                    pathStack.push(current); // Push the vertex to the stack
                    current = previous[current]; // Move to the previous vertex
                }
                pathStack.push(start); // Push the start vertex to the stack

                const path = []; // Array to store the shortest path
                while (!pathStack.isEmpty()) {
                    path.push(pathStack.pop()); // Pop vertices from the stack to get the path in correct order
                }
                return path; // Return the shortest path
            }

            // Process all neighbors of the current vertex
            this.adjacencyList[current].forEach(neighbor => {
                if (!visited[neighbor.node]) {
                    visited[neighbor.node] = true; // Mark neighbor as visited
                    previous[neighbor.node] = current; // Set previous vertex for neighbor
                    queue.push(neighbor.node); // Enqueue neighbor
                }
            });
        }

        return []; // Return empty path if no path is found
    }

}
// Priority Queue class - helps to get the element with the highest priority
class PriorityQueue {
    constructor() {
        this.values = [];
    }

    // Adds an element to the priority queue with a priority
    enqueue(val, priority) {
        this.values.push({
            val,
            priority
        });
        this.sort();
    }

    // Removes and returns the element with the highest priority from the priority queue
    dequeue() {
        return this.values.shift();
    }

    // Sorts the elements in the priority queue based on their priorities
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

// Linked List Class - Singly Linked List
// Node class to represent the nodes in the linked list
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

    // Inserts a node at the end of the linked list
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

    // Deletes a node from the linked list
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

    // Searches for a node with a specific value in the linked list
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

    // Prints the linked list
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

    // Checks if the linked list contains a cycle using Floyd's cycle detection algorithm
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