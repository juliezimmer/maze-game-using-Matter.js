const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 14;
const cellsVertical = 10;

// using browser window object //
const width = window.innerWidth;
const height = window.innerHeight;

// in X direction: width of canvas //
const unitLengthX = width / cellsHorizontal; 
// in Y direction: height of canvas //
const unitLengthY = height / cellsVertical;

const engine = Engine.create();

// disables gravity //
engine.world.gravity.y = 0;

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
const grid = Array(cellsVertical) // outer array created //
   .fill(null)
      .map(() => Array(cellsHorizontal).fill(false)); 
// The above map statement builds out each inner array row, each with the number of elements of columns in the grid // 

// create verticals array //
const verticals = Array(cellsVertical) // creates 3 inner arrays
   .fill(null)
      .map(() => Array(cellsHorizontal - 1).fill(false));

// create horizontals array
const horizontals = Array(cellsVertical - 1) // creates 2 inner arrays
   .fill(null)
      .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
         nextRow >= cellsVertical || 
         nextColumn < 0 || 
         nextColumn >= cellsHorizontal
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
         (columnIndex * unitLengthX + unitLengthX / 2),
         (rowIndex * unitLengthY + unitLengthY),
         unitLengthX,
         5,
         {
            label: 'wall',
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
         (columnIndex * unitLengthX + unitLengthX),
         (rowIndex * unitLengthY + unitLengthY / 2),
         5,
         unitLengthY,
         {
            label: 'wall', 
            isStatic: true
         }
      );
      // add the segments to the canvas //
      World.add(world, wall);
   });
});

// goal
const goal = Bodies.rectangle(
   (width - unitLengthX / 2),
   (height - unitLengthY / 2),   
   unitLengthX * .7,
   unitLengthY * .7,
   {
      label: 'goal',
      isStatic: true
   }
);
// add to World/canvas //
World.add(world, goal); 

// ball
// ballRadius finds the smaller unitLength between X and Y //
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
   unitLengthX / 2,
   unitLengthY / 2,
   ballRadius, 
   {
      label: 'ball'
   }
);
// add ball to canvas
World.add(world, ball);

// detecting the ball and moving it //
document.addEventListener('keydown', (event) => {
   // get ball current velocity 
   // x and y are current ball velocity
   const { x, y } = ball.velocity;
   console.log(x, y);
   if(event.code === 'KeyW'){
     Body.setVelocity(ball, { x, y: y - 5 });
   }
   if (event.code === 'KeyA'){
      Body.setVelocity(ball, { x: x + 5, y });
   }
   if (event.code === 'KeyS'){
      Body.setVelocity(ball, { x, y: y + 5 });
   }
   if(event.code === 'KeyD'){
      Body.setVelocity(ball, { x: x - 5, y });
   }
}); 

// Win Condition //
Events.on(engine, 'collisionStart', (e) => {
   e.pairs.forEach((collision) => {
      const labels = ['ball', 'goal'];

      if (
         labels.includes(collision.bodyA.label) && 
         labels.includes(collision.bodyB.label)
      )  {
         world.gravity.y = 1; // turns gravity on //
         world.bodies.forEach((body) => {
            if (body.label === 'wall'){
               Body.setStatic(body, false);
            }
         });
      }
   });
});