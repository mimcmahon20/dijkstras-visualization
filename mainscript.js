let game = document.getElementsByClassName("game")[0];
let gameWidth = game.offsetWidth;
let gameHeight = game.offsetHeight;
let description = document.getElementsByClassName("description")[0];

let totalSearched = 0;
let totalDistance = 0;


class box {
    constructor() {
        this.box = document.createElement("div");
        this.box.classList.add("box");
    }

    click() {
        this.box.addEventListener("click", function() {
            if(!this.classList.contains("start") && !this.classList.contains("goal")) {
                this.classList.toggle("clicked");
            }
        });
    }
}


class row {
    constructor() {
        this.row = document.createElement("div");
        this.row.classList.add("row");
        game.appendChild(this.row); 
        this.boxes = new Array();
    }

    addBox() {
        let boxy = new box();
        this.boxes.push(boxy);
        this.row.appendChild(boxy.box);
    }
}

let totalRows = 20;

//rows
let rows = new Array();
for(let i = 0; i < totalRows; i++) {
    rows[i] = new row();
    for(let j = 0; j < totalRows; j++) {
        rows[i].addBox();
        rows[i].boxes[j].click();
    }
}

//goal box
let startX, startY, goalX, goalY;

//Reset button
let reset = document.getElementsByClassName("reset")[0];
reset.addEventListener("click", function() {
    resetGame();
});

//Run button
let runButton = document.getElementsByClassName("run")[0];
runButton.addEventListener("click", function() {
    startGame(startX, startY, goalX, goalY);
});

//randomize button
let randomize = document.getElementsByClassName("randomize")[0];
randomize.addEventListener("click", function() {
    randomizeGame();
});
    


function dijkstra(startX, startY, goalX, goalY) {


      // Initialize the distances and paths to all nodes
  let distances = [];
  let paths = [];
  for (let i = 0; i < totalRows; i++) {
    distances[i] = new Array(totalRows).fill(Infinity);
    paths[i] = new Array(totalRows).fill(null);
  }
  distances[startX][startY] = 0;

  // Create a set of unvisited nodes
  let unvisited = new Set();
  for (let i = 0; i < totalRows; i++) {
    for (let j = 0; j < totalRows; j++) {
      unvisited.add([i, j]);
    }
  }

  // Loop until we visit all nodes
  while (unvisited.size > 0) {
    // Find the node with the shortest distance from the start node
    let minDistance = Infinity;
    let minNode;
    for (let node of unvisited) {
      if (distances[node[0]][node[1]] < minDistance) {
        minDistance = distances[node[0]][node[1]];
        minNode = node;
        totalSearched++;
        rows[node[0]].boxes[node[1]].box.style = "background-color: " + "rgb(" + (255 - minDistance * totalRows/3) + ", " + (255 - minDistance * totalRows) + ", " + (255 - minDistance * totalRows) + ")";
      }
    }

    // Remove the node from the unvisited set
    unvisited.delete(minNode);

    // If we have reached the end node, return the path
    if (minNode[0] === goalX && minNode[1] === goalY) {
      let path = [];
      let currentNode = minNode;
      while (currentNode !== null) {
        totalDistance++;
        rows[currentNode[0]].boxes[currentNode[1]].box.style = 'background-color: yellow';
        path.unshift(currentNode);
        currentNode = paths[currentNode[0]][currentNode[1]];
      }
      return path;
    }

    // Update the distances and paths of the neighboring nodes
    let neighbors = getNeighbors(minNode[0], minNode[1]);
    for (let neighbor of neighbors) {
      let distance = distances[minNode[0]][minNode[1]] + 1;
      if (distance < distances[neighbor[0]][neighbor[1]]) {
        distances[neighbor[0]][neighbor[1]] = distance;
        paths[neighbor[0]][neighbor[1]] = minNode;
      }
    }
  }

  // If we haven't found a path to the end node, return null
  description.innerHTML = "No path found";
  return null;

  function getNeighbors(x, y) {
    let neighbors = [];
    if (x > 0 && rows[x - 1].boxes[y].box.classList.contains("clicked") == false) {
      neighbors.push([x - 1, y]);
    }
    if (y > 0 && rows[x].boxes[y - 1].box.classList.contains("clicked") == false) {
      neighbors.push([x, y - 1]);
    }
    if (x < totalRows-1 && rows[x + 1].boxes[y].box.classList.contains("clicked") == false) {
      neighbors.push([x + 1, y]);
    }
    if (y < totalRows-1 && rows[x].boxes[y + 1].box.classList.contains("clicked") == false) {
      neighbors.push([x, y + 1]);
    }
    return neighbors;
  }

}

function resetGame() {
    rows.forEach(function(row) {
        row.boxes.forEach(function(box) {
            box.box.classList.remove("clicked");
            box.box.classList.remove("goal");
            box.box.classList.remove("start");
            box.box.style = "background-color: white";
        });
    });
    startX = Math.floor(Math.random() * totalRows);
    startY = Math.floor(Math.random() * totalRows);
    rows[startX].boxes[startY].box.classList.add("start");
    goalX = Math.floor(Math.random() * totalRows);
    goalY = Math.floor(Math.random() * totalRows);
    while(goalX == startX && goalY == startY) {
        goalX = Math.floor(Math.random() * totalRows);
        goalY = Math.floor(Math.random() * totalRows);
    }
    rows[goalX].boxes[goalY].box.classList.add("goal");
    totalSearched = 0;
    totalDistance = 0;
}

function startGame(startX, starty, goalX, goalY) {
    let distance = dijkstra(startX, startY, goalX, goalY);
    console.log(`Shortest distance from (${startX},${startY}) to (${goalX},${goalY}) is ${distance}`);
    description.innerHTML = `Shortest distance from (${startX},${startY}) to (${goalX},${goalY}) is ${totalDistance}. It searched ${totalSearched} nodes.`;
}

function randomizeGame(startX, starty, goalX, goalY) {
    for(let i = 0; i < totalRows*1.5; i++) {
        let randomX = Math.floor(Math.random() * totalRows);
        let randomY = Math.floor(Math.random() * totalRows);
        while(randomX == startX && randomY == startY || randomX == goalX && randomY == goalY) {
            randomX = Math.floor(Math.random() * totalRows);
            randomY = Math.floor(Math.random() * totalRows);
        }
        rows[randomX].boxes[randomY].box.classList.add("clicked");
    }
}

resetGame();