// @flow
const SIZE = 500
const PADDING = 250
const ACTUAL_SIZE = 1000
const BG = '#000'
const STROKE = '#fff'
const toRadians = (degree) => degree * (Math.PI / 180)
const toDegree = (radians) => radians * (180 / Math.PI)
const distBetween = (p1: [number, number], p2: [number, number]): number =>
  Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))


// $FlowFixMe
const c: HTMLCanvasElement = document.getElementById("myCanvas");
const global_ctx = c.getContext("2d");
const drawSquare = (ctx: CanvasRenderingContext2D, origin: [number, number], size: number, van: [number, number], distanceFactor: number) => {
  const x = origin[1]
  const y = origin[0]
  const px = van[0]
  const py = van[1]
  const getmid = (a,b) => (a + (b-a)*distanceFactor)
  const tl = [x, y]
  const tr = [x+size, y]
  const bl = [x, y + size]
  const br = [x + size, y + size]
  const ptl = [getmid(tl[0], px), getmid(tl[1], py)]
  const ptr = [getmid(tr[0], px), getmid(tr[1], py)]
  const pbl = [getmid(bl[0], px), getmid(bl[1], py)]
  const pbr = [getmid(br[0], px), getmid(br[1], py)]

  // rect left
  ctx.strokeStyle = STROKE;

  ctx.fillStyle = BG;
  ctx.beginPath();

  ctx.beginPath();
  ctx.moveTo(...tl);
  ctx.lineTo(...ptl);
  ctx.lineTo(...pbl);
  ctx.lineTo(...bl);
  ctx.lineTo(...tl);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();


  // rect top
  ctx.fillStyle = BG;
  ctx.beginPath();

  ctx.moveTo(...tl);
  ctx.lineTo(...ptl);
  ctx.lineTo(...ptr);
  ctx.lineTo(...tr);
  ctx.lineTo(...tl);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // rect bottom
  ctx.fillStyle = BG;
  ctx.beginPath();

  ctx.moveTo(...bl);
  ctx.lineTo(...pbl);
  ctx.lineTo(...pbr);
  ctx.lineTo(...br);
  ctx.lineTo(...bl);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // rect right
  ctx.fillStyle = BG;
  ctx.beginPath();

  ctx.moveTo(...tr);
  ctx.lineTo(...ptr);
  ctx.lineTo(...pbr);
  ctx.lineTo(...br);
  ctx.lineTo(...tr);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // Front square
  ctx.beginPath();
  ctx.moveTo(...tl);
  ctx.lineTo(...tr);
  ctx.lineTo(...br);
  ctx.lineTo(...bl);
  ctx.lineTo(...tl);
  ctx.stroke();
  ctx.closePath();

  // Back square
  ctx.beginPath();
  ctx.moveTo(...ptl);
  ctx.lineTo(...ptr);
  ctx.lineTo(...pbr);
  ctx.lineTo(...pbl);
  ctx.lineTo(...ptl);
  ctx.stroke();
  ctx.closePath();

}

type SquareType = {|
  +origin: [number, number],
  +midpoint: [number, number],
  +size: number
|}
const range = (start: number, stop: number): number[] => [...Array(stop-start).keys()].map(n => n+start)
const animateFrame = (ctx: CanvasRenderingContext2D, van: [number, number], distanceFactor: number, it: number) => {
  ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width)
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, ctx.canvas.height, ctx.canvas.width)
  let fake_x = 0
  let next_x = PADDING
  const init_size = SIZE / 5
  const squares: SquareType[] = range(0, 31).reduce((acc: SquareType[],x) => {
    const factor_raw = (Math.ceil((fake_x + 1) / init_size) - 1) + 4
    const factor = Math.abs(factor_raw % 8 - 4)
    const size_mod = Math.pow(2, factor)
    const size = (init_size / (size_mod)) * (Math.cos(toRadians(it / 2))+1.5) / 2
    const cube_fit = Math.ceil((SIZE ) / size)
    const iter = range(0, cube_fit)
    const cubes = iter.map(y => {
      const next_y = PADDING + (y * size)
      return {
        origin: [next_x, next_y],
        midpoint: [next_x + (size / 2), next_y + (size / 2)],
        size: size,
      }
    })
    next_x += size
    fake_x += size
    return [...acc, ...cubes]
  }, [])
  const sorted_squares = squares.sort((square1: SquareType, square2: SquareType) => {
    const dist1 = distBetween(square1.midpoint, van)
    const dist2 = distBetween(square2.midpoint, van)
    if (dist1 > dist2) {
      return - 1
    } else if (dist1 === dist2) {
      return 0
    } else {
      return 1
    }
  })
  sorted_squares.map((sq: SquareType) => drawSquare(ctx, sq.origin, sq.size, van, distanceFactor))
}


let it = 0
const render = () => requestAnimationFrame(() => {
  const x = ACTUAL_SIZE / 2 + (SIZE * 0.5 * Math.cos(toRadians(it)))
  const y = ACTUAL_SIZE / 2 + (SIZE * 0.5 * Math.sin(toRadians(it)))
  const distanceFactor = Math.cos(toRadians(it/2)) * 5
  animateFrame(global_ctx, [x, y], distanceFactor, it)
  if (it < 1440) {
    render()
  }
  it += 6
})

function startRecording() {
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  const stream = c.captureStream(); // grab our canvas MediaStream
  // $FlowFixMe
  const rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = e => {
    console.log("LOGGING E")
    console.log(e)
    chunks.push(e.data)
  }
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = e => exportVid(new Blob(chunks, { type: 'image/gif' }));

  rec.start();
  setTimeout(() => rec.stop(), 18000); // stop recording in 3s
}

function exportVid(blob) {
  const vid = document.createElement('video');
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body && document.body.appendChild(vid);
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = vid.src;
  a.textContent = 'download the video';
  document.body && document.body.appendChild(a);
}

render()
startRecording()