# Data structures

This project consists of data structers as follows implemented in JavaScript.
> Stack, Queue, Binary Tree, Graph and Linked List

Purpose of this project is to learn and solidify knowledge of those data structures. How to implment them and understand how they work.

All implementations of those data structures are in file `DataStructures.js`

## 1. Stack

Stack is data structure where data is stored in a Last In - First Out (LIFO) manner. It means tha the last object added to the stack is also the first one to be removed.

    Methods:
    - push(value): adds value to the stack
    - pop(): removes first item from the stack
    - peek(): allows user to receive first item from the stack without removing it
    - isEmpty(): returns true if the stack is empty, and false if its not
    - size(): returns number of items in the stack

## 2. MinMaxStack

MinMaxStack is a data structure that extends the functionality of a regular stack by providing methods to efficiently retrieve the minimum and maximum values stored in the stack

    Methods:
    - push(value): Adds the specified value to the stack. Additionally, updates internal minStack and maxStack to keep track of the minimum and maximum values.
    - pop(): Removes and returns the top element from the stack. Also updates minStack and maxStack accordingly.
    - getMin(): Returns the minimum value currently stored in the stack. Throws an error if the stack is empty.
    - getMax(): Returns the maximum value currently stored in the stack. Throws an error if the stack is empty.

## 3. Queue

Queue is data structure where data is stored in First In - First Out (FIFO) manner.
Elements are added to the end of the queue and removed from the front.

    Methods:
    - enqueue(value): Adds the specified value to the rear end of the queue.
    - dequeue(): Removes and returns the value at the front end of the queue.
    - peek(): Returns the value at the front end of the queue without removing it.
    - isEmpty(): Returns true if the queue is empty, and false otherwise.
    - size(): Returns the number of elements currently in the queue.


## 4. Binary Tree

Binary Tree is a hierarchical data structure composed of nodes. Each node has two children, called either left or right child.

### 4.1. Binary Tree Node (BTNode) Class:

    Constructor:
    - Creates a new node with specified key, value and parent node.
    Getters:
    - IsLeaf(): returns booleand value if node is a leaf node
    - hasChildren(): returns true if node has children

### 4.2. Binary Tree Class:

    Constructor:
    - Creates new Binary Tree object with root node containing specified key and value
    Methods:
    - inOrderTraversal(node): Performs an in-order traversal of the tree starting from the given node, returning an array of nodes visited in order.
    - postOrderTraversal(node): Performs a post-order traversal of the tree starting from the given node, returning an array of nodes visited in order.
    - preOrderTraversal(node): Performs a pre-order traversal of the tree starting from the given node, returning an array of nodes visited in order.
    - insert(key, value): Inserts a new node with the specified key and value.
    - remove(key): Removes the node with the specified key from the tree.
    - find(key): Finds and returns the node with the specified key.
    - isBST(): Checks whether the binary tree is a Binary Search Tree (BST), returning true if it satisfies the BST properties and false otherwise.
    - isBSTFunction(node, min, max): Helper function used by isBST() to recursively check if the tree is a BST within the specified range.

### 4.2.1. Traversals:

**In-Order Traversal**: During in-order traversal, we first visit the left subtree of a node, then the node itself, and finally the right subtree. This way, nodes are visited in ascending order of their key values.

**Pre-Order Traversal**: In pre-order traversal, we first visit the node itself, then the left subtree, and finally the right subtree. This way, nodes are visited in the order they are encountered while traversing the tree.

**Post-Order Traversal**: In post-order traversal, we first visit the left subtree, then the right subtree, and finally the node itself. This way, nodes are visited from leaves to the root.

## 5. Graph

Graph is a non-linear data structure consisting of a finite set of vertices (nodes) and a collection of edges that connect pairs of vertices. Each edge may have an associated weight, which represents the cost or distance between the connected vertices.

    Methods:
    - addVertex(vertex): Adds a new vertex to the graph.
    - addEdge(vertex1, vertex2, weight = 1): Adds a new edge between two vertices with an optional weight.
    - removeEdge(vertex1, vertex2): Removes the edge between two vertices.
    - removeVertex(vertex): Removes a vertex from the graph along with its associated edges.
    - depthFirstSearch(start): Traverses the graph using Depth First Search (DFS) algorithm, starting from the specified vertex, and returns an array of visited vertices.
    - breadthFirstSearch(start): Traverses the graph using Breadth First Search (BFS) algorithm, starting from the specified vertex, and returns an array of visited vertices.
    - dijkstra(start, end): Finds the shortest path between two vertices using Dijkstra's algorithm, starting from the specified start vertex and ending at the specified end vertex, and returns an array representing the shortest path. This algorithm needs weights.
    - bfsShortestPath(start, end): Finds the shortest path between two vertices using Breadth First Search (BFS) algorithm, starting from the specified start vertex and ending at the specified end vertex, and returns an array representing the shortest path.

### 5.1. Prority Queue

Priority Queue is a data structure similar to a regular queue, but each element has an associated priority. Elements with higher priorities are dequeued before elements with lower priorities. It's a helper data structure for Dijkstra Algorithm.

    Methods:
    - enqueue(val, priority): Adds an element to the priority queue with the specified priority.
    - dequeue(): Removes and returns the element with the highest priority from the queue.
    - sort(): Sorts the elements in the queue based on their priorities.

## 6. Linked List

Linked List is a linear data structure where elements are stored in a sequence. Each element in a linked list is called a node and consists of two parts: the data and a reference to the next node in the sequence.

### 6.1. Linked List Node Class (ListNode)

    Constructor:
    - Creates new node with provided value

### 6.2. Linked List Class

    Constructor: 
    - Initializes an empty linked list with a null head.
    Methods:
    - insertNode(value): Inserts a new node with the provided value at the end of the linked list.
    - deleteNode(value): Deletes the first occurrence of a node with the specified value from the linked list. If the value is found and deleted, returns true; otherwise, returns false.
    - searchNode(value): Searches for a node with the specified value in the linked list and returns it if found; otherwise, returns null.
    - printList(): Prints the elements of the linked list. If the linked list is cyclic, prints a message indicating it and stops printing.
    - cycleDetection(): Detects if the linked list contains a cycle (i.e., if there is a loop in the sequence of nodes). Returns true if a cycle is detected; otherwise, returns false.