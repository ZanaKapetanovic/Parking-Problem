
/*For the purposes of this problem, I used the uninformed search algorithm Breadth-First Search (BFS).
BFS algorithm in case of the parking problem has an advantage due to the guarantee of finding the shortest path that ensures optimality and always finding a solution if it exists, which ensures completeness. 
Although this is not an ideal solution in terms of memory because it has higher memory requirements than Depth-First Search or Depth-Limited Search, the trade-off ensures that we meet the problem's requirements for accuracy, efficiency, and clarity of solution. 
Heuristic algorithms and solution approaches can also be considered for this problem but are more applicable for larger and more complex problems.*/


// function used to get the next states from the current state
function getNextStates(state, emptyIndex, size) {
    const nextStates = []; //an empty array is initialized in order to store next possible states
    const possibleDirections = [-size, size, -1, 1]; //directions represent possible moves: up, down, left and right as changes in the index of empty space

    // loops through each move and calculates new empty space's index after move
    possibleDirections.forEach(move => {
        const newEmptyIndex = emptyIndex + move;

        // checking if the new state is within the grid bounds and doesn't wrap around
        if (isMoveValid(emptyIndex, newEmptyIndex, size)) {
            const newState = state.slice(); // creates a shallow copy of the current state

            // swapping empty space with the new position and adding new state informayion to next states
            [newState[emptyIndex], newState[newEmptyIndex]] = [newState[newEmptyIndex], newState[emptyIndex]];
            nextStates.push({ state: newState, emptyIndex: newEmptyIndex }); 
        }
    });
    return nextStates; // returns array of all valid next states
}

// function that is used to check if a move from current state to new position is valid, that new position (newEmptyIndex) is within the bounds and that left and right moves don't wrap around grid edges
function isMoveValid(emptyIndex, newEmptyIndex, size) {
    const isWithinBounds = (index) => index >= 0 && index < size*size;
    const isNotWrapAround = () => {     
        if (Math.abs(emptyIndex - newEmptyIndex) === 1) {
            const startOfRow = Math.floor(emptyIndex/size) * size;
            const endOfRow = startOfRow + size - 1;
            return emptyIndex >= startOfRow && emptyIndex <= endOfRow;
        }
        return true;
    };
    return isWithinBounds(newEmptyIndex) && isNotWrapAround(); //final check, returns true if both conditions are met
}

// Implementation of Breadth - First Search Algorithm 

function bfsAlgorithm(start, goal) {
    const gridSize = Math.sqrt(start.length); 
    const startIndex = start.indexOf(0); // finding the index of the empty space in the start state

    // First step is initialization of the queue with the start state
    const queue = [{ state: start, emptyIndex: startIndex, path: [start.slice()] }];
    const visitedStates = new Set(); // set that will keep track of visited states
    visitedStates.add(start.toString()); // mark start state as visited 

    // loops until queue is empty and then dequeue the first state according to first in - first out(FIFO) principle
    while (queue.length > 0) {
        const { state, emptyIndex, path } = queue.shift(); 
        if (arraysEqual(state, goal)) { //checking if the current state is the goal state
            return path; //if the goal state is found , return the path
        }

        // get next states from current state
        const nextStates = getNextStates(state, emptyIndex, gridSize);
        nextStates.forEach(({ state: nextState, emptyIndex: nextEmptyIndex }) => {
            if (!visitedStates.has(nextState.toString())) {  // checking if the next state isn't visited yet
                visitedStates.add(nextState.toString()); // mark next state as visited

                // enqueue the next state with updated path
                const newStateInfo = {
                    state: nextState,
                    emptyIndex: nextEmptyIndex,
                    path: path.concat([nextState.slice()]) // this will create a new state information object with the updated state and path
                };
                queue.push(newStateInfo); //enqueue new state info
            }
        });
    }

    return null; // returns null if there is no solution 
}

// function that checks if two arrays are equal
function arraysEqual(array1, array2) {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}

const start = [2, 0, 1, 3]; 
const goal = [3, 1, 0, 2]; 
const result = bfsAlgorithm(start, goal);

if (result) {
    console.log(result.length - 1); // prints number of steps without start  state
    result.forEach(state => console.log(state.join(' '))); // prints each state in path
} else {
    console.log('There is no solution found');
}
