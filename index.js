const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

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
   Bodies.rectangle((width / 2), 0, width, 40, {
      isStatic: true
   }),
   Bodies.rectangle((width / 2), height, width, 40, {
      isStatic: true
   }),
   Bodies.rectangle(0, (height / 2), 40, height, {
      isStatic: true
   }),
   Bodies.rectangle(width, (height / 2), 40, height, {
      isStatic: true
   })
];
World.add(world, walls);

// Maze generation //
// define grid array //
const grid = Array(cells) // creates 3 inner arrays
   .fill(null)
      .map(() => Array(cells).fill(false));
// map over null array to return 3 arrays with false elements //
console.log(grid);

// create verticals array //
const verticals = Array(cells) // creates 3 inner arrays
   .fill(null)
      .map(() => Array(cells - 1).fill(false));
console.log(verticals);

// create horizontals array
const horizontals = Array(cells - 1) // creates 2 inner arrays
   .fill(null)
      .map(() => Array(cells).fill(false));
console.log(horizontals);