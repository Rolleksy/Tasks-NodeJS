const { Stack, MinMaxStack, Queue, BinaryTree, Graph, LinkedList } = require('./DataStructures');


// ------------- Stack testing -------------
// const stack = new Stack();

// stack.push(1);
// stack.push(2);
// stack.push(3);

// console.log(stack.size());

// let poppedVal = stack.pop();
// // console.log(poppedVal);

// console.log(stack);
// -------------------------------------------



// ------------- Stack min/max testing -------------

// const stack = new MinMaxStack();
// stack.push(5);
// stack.push(3);
// stack.push(8);
// stack.push(1);

// console.log("Min Stack: ",stack.minStack);
// console.log("Max Stack: ",stack.maxStack);

// console.log("Get min: ",stack.getMin()); // 1
// console.log("Get max: ",stack.getMax()); // 8

// console.log("Popping", stack.pop()); // 1
// console.log("Get min: ",stack.getMin()); // 3
// console.log("Get max: ",stack.getMax()); // 8
// -------------------------------------------
// 



// ------------- Queue testing -------------

// const queue = new Queue();

// queue.enqueue(1);
// queue.enqueue(2);
// queue.enqueue(3);

// console.log(queue);
// console.log(queue.size());

// let dequeuedVal = queue.dequeue();
// console.log(dequeuedVal);

// console.log(queue);
// -------------------------------------------





// ------------- Binary Tree testing -------------

// Creating instance of BinaryTree
// const tree = new BinaryTree(10, 10);

// console.log("Adding nodes:");
// tree.insert(10, 5); 
// tree.insert(10, 15); 
// tree.insert(5, 3);   
// tree.insert(5, 7);    
// tree.insert(15, 12);  
// tree.insert(15, 17); 

// console.log("Tree traversal:");

// const inOrder = tree.inOrderTraversal().map(node => node.key);
// console.log("In-order traversal:", inOrder.join(" -> "));

// const preOrder = tree.preOrderTraversal().map(node => node.key);
// console.log("Pre-order traversal:", preOrder.join(" -> "));

// const postOrder = tree.postOrderTraversal().map(node => node.key);
// console.log("Post-order traversal:", postOrder.join(" -> "));

// console.log("Searching for nodes:");
// console.log("Find 10:", tree.find(10) ? "Found" : "Not found");
// console.log("Find 5:", tree.find(5) ? "Found" : "Not found");
// console.log("Find 15:", tree.find(15) ? "Found" : "Not found");
// console.log("Find 3:", tree.find(3) ? "Found" : "Not found");
// console.log("Find 7:", tree.find(7) ? "Found" : "Not found");
// console.log("Find 12:", tree.find(12) ? "Found" : "Not found");
// console.log("Find 17:", tree.find(17) ? "Found" : "Not found");
// console.log("Find 100:", tree.find(100) ? "Found" : "Not found");

// console.log("Deleting nodes:");
// tree.remove(3);
// console.log("Removed 3. Find 3:", tree.find(3) ? "Found" : "Not found");
// tree.remove(17);
// console.log("Removed 17. Find 17:", tree.find(17) ? "Found" : "Not found");

// console.log("Tree traversal post deletion:");
// const inOrderAfterRemoval = tree.inOrderTraversal().map(node => node.key);
// console.log("In-order traversal after removal:", inOrderAfterRemoval.join(" -> "));

// console.log("Is this Tree a Binary Search Tree (BST)?");
// console.log("Is BST:", tree.isBST() ? "Yes" : "No");

// console.log(tree);
// -------------------------------------------





// -------------  Graph testing -------------

// const graph = new Graph();

// console.log("Adding vertices:");
// graph.addVertex("A");
// graph.addVertex("B");
// graph.addVertex("C");
// graph.addVertex("D");
// graph.addVertex("E");
// graph.addVertex("F");

// console.log("Adding edges with weights:");
// graph.addEdge("A", "B", 4);
// graph.addEdge("A", "C", 2);
// graph.addEdge("B", "E", 3);
// graph.addEdge("C", "D", 2);
// graph.addEdge("C", "F", 4);
// graph.addEdge("D", "E", 3);
// graph.addEdge("D", "F", 1);
// graph.addEdge("E", "F", 1);

// console.log("Depth first (DFS):");
// console.log(graph.depthFirstSearch("A")); // ["A", "B", "E", "D", "C", "F"]

// console.log("Breadth first (BFS):");
// console.log(graph.breadthFirstSearch("A")); // ["A", "B", "C", "E", "D", "F"]

// console.log("Shortest path according to Dijkstra:");
// console.log(graph.dijkstra("A", "E")); // ["A", "C", "D", "F", "E"]

// console.log("Shortest path according to BFS:");
// console.log(graph.bfsShortestPath("A", "E")); // ["A", "B",  "E"]
// -------------------------------------------





// ------------- Linked List test -------------

// // Creating instance of LinkedList
// const list = new LinkedList();

// // Adding nodes to the list
// console.log("Adding nodes:");
// list.insertNode("A");
// list.insertNode("B");
// list.insertNode("C");
// list.insertNode("D");
// list.insertNode("E");
// list.insertNode("F");

// // Logging the list
// console.log("List after adding nodes:");
// list.printList(); // A -> B -> C -> D -> E -> F

// // Looking for cycle in the list
// console.log("Cycle detection:");
// console.log(list.cycleDetection()); // Expecting false, because the list does not contain a cycle

// // Add a cycle to the list
// list.searchNode("F").next = list.searchNode("A");

// // Once again, test the cycleDetection method
// console.log("Cycle detection after adding cycle:");
// console.log(list.cycleDetection()); // Expecting true, because we added a cycle to the list

// list.deleteNode("C");
// console.log("List after deleting C:");
// list.printList(); // A -> B -> D -> E -> F
