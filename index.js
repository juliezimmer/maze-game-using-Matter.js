const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 15;
const width = 600;
const height = 600;

// unitLength is one side of one cell //
const unitLength = width / cells; // could also use height because width = height in this case //

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
   element: document.body,
   engine: engine,
   options: {
      wireframes: true, // makes shapes random solid color
      width, // defined above
      height // defined above
   }
});

// tell render to start working  //
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
   Bodies.rectangle((width / 2), 0, width, 2, {
      isStatic: true
   }),
   Bodies.rectangle((width / 2), height, width, 2, {
      isStatic: true
   }),
   Bodies.rectangle(0, (height / 2), 2, height, {
      isStatic: true
   }),
   Bodies.rectangle(width, (height / 2), 2, height, {
      isStatic: true
   })
];
World.add(world, walls);

// Maze generation //
// randomizes neighboring cells for maze //
// This will take an array and randomly re-order all the elements inside of it //
const shuffle = (arr) => {
   let counter = arr.length;
   // runs while counter is greater than zero //
   while (counter > 0) {
      // get random index inside the array
      const index = Math.floor(Math.random() * counter); 
      // decrement counter //
      counter--;
      const temp = arr[counter];
      // update value at index[counter]
      arr[counter] = arr[index];
      arr[index] = temp;
   }
   return arr;
 };

// define grid array //
const grid = Array(cells) // creates 3 inner arrays
   .fill(null)
      .map(() => Array(cells).fill(false));
// map over null array to return 3 arrays with false elements 

// create verticals array //
const verticals = Array(cells) // creates 3 inner arrays
   .fill(null)
      .map(() => Array(cells - 1).fill(false));

// create horizontals array
const horizontals = Array(cells - 1) // creates 2 inner arrays
   .fill(null)
      .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

console.log(startRow, startColumn);

// function that iterates through maze //
const stepThroughCell = (row, column) => {
   // if cell at [row, column] has been visited, then return 
   if(grid[row][column]){
      return;  
   }
   // mark cell as visited
   grid[row][column] = true;
   
// Assemble randomly-ordered list of neighbors
const neighbors = shuffle([
   [row - 1, column, 'up'], // above
   [row, column + 1, 'right'], // right
   [row + 1, column, 'down'], // below
   [row, column - 1, 'left'] // left
]);
   
// For each neighbor...iterate over
for(let neighbor of neighbors){
   const [nextRow, nextColumn, direction] = neighbor;
      
      // See if neighbor is out of bounds //
      if (
         nextRow < 0 || 
         nextRow >= cells || 
         nextColumn < 0 || 
         nextColumn >= cells
      ){
        continue;    
      }
      // if neighbor has been visited, continue to next neighbor //
      if (grid[nextRow][nextColumn]){
         continue;
      }
      // remove wall from horizontals or verticals array
      // verticals
      if(direction === 'left'){
         verticals[row][column - 1] = true;
      } else if (direction === 'right'){
         verticals[row][column] = true;
      } else if (direction === 'up'){ 
         horizontals[row - 1][column] = true;
      } else if(direction === 'down'){
         horizontals[row][column] = true;
      }
      // visit that next cell (call function again with row and column trying to visit) //
      stepThroughCell(nextRow, nextColumn);
   } // end of for loop //
};

stepThroughCell(startRow, startColumn); // yields a random cell with two coordinates using indicies of grid array //

// iterate over horizontals array with forEach() to get horizontal segments on the canvas //
horizontals.forEach((row, rowIndex) => {
   row.forEach((open, columnIndex) => {
      if (open){
         return; // don't draw any segment
      }
      // if element is false, a segment has to be drawn //
      const wall = Bodies.rectangle(
         (columnIndex * unitLength + unitLength / 2),
         (rowIndex * unitLength + unitLength),
         unitLength,
         10,
         {
            isStatic: true
         }
      );
      World.add(world, wall);
   });
});

// iterate over verticals array with forEach() to get vertical segments or lines drawn on the canvas //
verticals.forEach((row, rowIndex) => {
   row.forEach((open,columnIndex) => {
      if(open){
         return;
      }
      // create wall segments //
      const wall = Bodies.rectangle(
         (columnIndex * unitLength + unitLength),
         (rowIndex * unitLength + unitLength / 2),
         10,
         unitLength,
         {
            isStatic: true
         }
      );
      // add the segments to the canvas //
      World.add(world, wall);
   });
});

// goal
const goal = Bodies.rectangle(
   (width - unitLength / 2),
   (height - unitLength / 2),   
   unitLength * .7,
   unitLength * .7,
   {
      isStatic: true
   }
);
// add to World/canvas //
World.add(world, goal); 

// ball
const ball = Bodies.circle(
   unitLength / 2,
   unitLength / 2,
   unitLength / 4 // ball is half the width of a cell //
);
// add ball to canvas
World.add(world, ball);

// detecting the ball and moving it //
document.addEventListener('keydown', (event) => {
   console.log(event);
   if(event.code === 'KeyW'){
     console.log('move ball up');
   }
   if (event.code === 'KeyA'){
      console.log('move ball right');
   }
   if (event.code === 'KeyS'){
      console.log('move ball down');
   }
   if(event.code === 'KeyD'){
      console.log('move ball left');
   }
}); 