const { Engine, Render, Runner, World, Bodies } = Matter;

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
const grid = Array(3)
   .fill(null)
      .map(() => Array(3).fill(false));
// map over null array to return 3 arrays with false elements //
console.log(grid);
