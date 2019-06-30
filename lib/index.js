const toRadians = degree => degree * (Math.PI / 180);
const toDegree = radians => radians * (180 / Math.PI);

// $FlowFixMe
const c = document.getElementById("myCanvas");
const global_ctx = c.getContext("2d");
const drawSquare = (ctx, origin, size, van, distanceFactor) => {
  const x = origin[0];
  const y = origin[1];
  const px = van[0];
  const py = van[1];
  const getmid = (a, b) => a + (b - a) * distanceFactor;
  const tl = [x, y];
  const tr = [x + size, y];
  const bl = [x, y + size];
  const br = [x + size, y + size];
  const ptl = [getmid(tl[0], px), getmid(tl[1], py)];
  const ptr = [getmid(tr[0], px), getmid(tr[1], py)];
  const pbl = [getmid(bl[0], px), getmid(bl[1], py)];
  const pbr = [getmid(br[0], px), getmid(br[1], py)];
  // Front square
  ctx.moveTo(...tl);
  ctx.lineTo(...tr);
  ctx.lineTo(...br);
  ctx.lineTo(...bl);
  ctx.lineTo(...tl);
  // Lines between
  ctx.lineTo(...ptl);
  ctx.moveTo(...tr);
  ctx.lineTo(...ptr);
  ctx.moveTo(...bl);
  ctx.lineTo(...pbl);
  ctx.moveTo(...br);
  ctx.lineTo(...pbr);
  // Back square
  ctx.moveTo(...ptl);
  ctx.lineTo(...ptr);
  ctx.lineTo(...pbr);
  ctx.lineTo(...pbl);
  ctx.lineTo(...ptl);
};
const range = (start, stop) => [...Array(stop - start).keys()].map(n => n + start);
const animateFrame = (ctx, van, distanceFactor, it) => {
  ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width);
  ctx.beginPath();
  let fake_x = 0;
  let next_x = -1800 + -1 * (it * 2 % 1600);
  const init_size = 200;
  range(0, 127).map(x => {
    const factor_raw = Math.ceil((fake_x + 1) / 200) - 1 + 4;
    const factor = Math.abs(factor_raw % 8 - 4);
    const size_mod = Math.pow(2, factor);
    const size = init_size / size_mod;
    const cube_fit = Math.ceil(1001 / size);
    const iter = range(0, cube_fit);
    iter.map(y => {
      drawSquare(ctx, [next_x, y * size], size, van, distanceFactor);
    });
    next_x += size;
    fake_x += size;
  });
  ctx.stroke();
};

let it = 0;
const render = () => requestAnimationFrame(() => {
  const x = 500 + 300 * Math.cos(toRadians(it));
  const y = 500 + 300 * Math.sin(toRadians(it));
  it += Math.sin(toRadians(it)) + 1 + 0.1;
  const distanceFactor = (1 + Math.sin(toRadians(it))) / 2;
  console.log("vanish x  " + x);
  console.log("vanish y " + y);
  console.log("iter " + it);
  animateFrame(global_ctx, [x, y], distanceFactor, it);
  if (it < 1440) {
    render();
  }
});

render();