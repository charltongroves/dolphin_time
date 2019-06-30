const toRadians = degree => degree * (Math.PI / 180);
const toDegree = radians => radians * (180 / Math.PI);
const distBetween = (p1, p2) => Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

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

  // rect left
  ctx.strokeStyle = '#8A9BAE';

  ctx.fillStyle = '#E6E9ED';
  ctx.beginPath();
  ctx.moveTo(...tl);
  ctx.lineTo(...ptl);
  ctx.lineTo(...pbl);
  ctx.lineTo(...bl);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // rect top
  ctx.fillStyle = '#CAD2DE';
  ctx.beginPath();
  ctx.moveTo(...tl);
  ctx.lineTo(...ptl);
  ctx.lineTo(...ptr);
  ctx.lineTo(...tr);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // rect bottom
  ctx.fillStyle = '#CAD2DE';
  ctx.beginPath();
  ctx.moveTo(...bl);
  ctx.lineTo(...pbl);
  ctx.lineTo(...pbr);
  ctx.lineTo(...br);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // rect right
  ctx.fillStyle = '#E6E9ED';
  ctx.beginPath();
  ctx.moveTo(...tr);
  ctx.lineTo(...ptr);
  ctx.lineTo(...pbr);
  ctx.lineTo(...br);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Front square
  ctx.beginPath();
  ctx.moveTo(...tl);
  ctx.lineTo(...tr);
  ctx.lineTo(...br);
  ctx.lineTo(...bl);
  ctx.lineTo(...tl);
  ctx.stroke();
  ctx.closePath();
};

const range = (start, stop) => [...Array(stop - start).keys()].map(n => n + start);
const animateFrame = (ctx, van, distanceFactor, it) => {
  ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width);
  let fake_x = 0;
  let next_x = 0;
  const init_size = 200;
  const squares = range(0, 31).reduce((acc, x) => {
    const factor_raw = Math.ceil((fake_x + 1) / 200) - 1 + 4;
    const factor = Math.abs(factor_raw % 8 - 4);
    const size_mod = Math.pow(2, factor);
    const size = init_size / size_mod;
    const cube_fit = Math.ceil(1001 / size);
    const iter = range(0, cube_fit);
    const cubes = iter.map(y => {
      return {
        origin: [next_x, y * size],
        midpoint: [next_x + size / 2, y * size + size / 2],
        size: size
      };
    });
    next_x += size;
    fake_x += size;
    return [...acc, ...cubes];
  }, []);
  const sorted_squares = squares.sort((square1, square2) => {
    const dist1 = distBetween(square1.midpoint, van);
    const dist2 = distBetween(square2.midpoint, van);
    if (dist1 > dist2) {
      return -1;
    } else if (dist1 === dist2) {
      return 0;
    } else {
      return 1;
    }
  });
  sorted_squares.map(sq => drawSquare(ctx, sq.origin, sq.size, van, distanceFactor));
};

let it = 0;
const render = () => requestAnimationFrame(() => {
  const x = 500 + 300 * Math.cos(toRadians(it));
  const y = 500 + 300 * Math.sin(toRadians(it));
  const distanceFactor = 0.1;
  console.log("vanish x  " + x);
  console.log("vanish y " + y);
  console.log("iter " + it);
  animateFrame(global_ctx, [x, y], distanceFactor, it);
  if (it < 1440) {
    render();
  }
  it += 4;
});

render();