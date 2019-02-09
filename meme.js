document.addEventListener("mousedown", ʕಠᴥಠʔ)
document.addEventListener("dragover", ʕಠᴥಠʔ)
document.addEventListener("keydown", handleKeyPress)

const spinKey = 83 // s
let total_pics_made = 0
let interval = 0
let spinning = true
let speed = 1
const all_santis = []

function ʕಠᴥಠʔ (ᕕ〳ಠل͜ಠ〵ᕗ) {
  const window_x = window.innerWidth - 200
  const window_y = window.innerHeight - 100
  const click_x = ᕕ〳ಠل͜ಠ〵ᕗ.clientX  
  const click_y = ᕕ〳ಠل͜ಠ〵ᕗ.clientY
  const [w1, h1] = [click_x, click_y]
  const [w2, h2] = [window_x-click_x, click_y]
  const [w3, h3] = [click_x, window_y-click_y]
  const [w4, h4] = [window_x - click_x, window_y-click_y]

  createImage(w1, h1)
  createImage(w2, h2)
  createImage(w3, h3)
  createImage(w4, h4)
  // const 〳ಠʖಠ〵 = document.createElement("audio")
  // 〳ಠʖಠ〵.setAttribute("src", `./bloops.mp3`)
  // 〳ಠʖಠ〵.play()
}

function get_image() {
  total_pics_made = total_pics_made + 1
  const mod = total_pics_made % 360
  if ((mod >= 120) && (mod < 240)) {
    return "./flower1.png"
  } else if (mod >= 240) {
    return "./flower2.png"
  } else {
    return "./catt.png"
  }
}

function createImage (x, y) {
  const ಠωಠ = document.createElement("img")
  ಠωಠ.setAttribute("src", get_image())
  ಠωಠ.style.left = `${x - 50}px`
  ಠωಠ.style.top = `${y - 75}px`
  document.body.appendChild(ಠωಠ)
  all_santis.push(ಠωಠ)
  if (all_santis.length > 500) {
    all_santis[0].parentNode.removeChild(all_santis[0]);
    all_santis.shift() // [1:] in python
  }
}



function handleKeyPress (e) {
  if (e.keyCode == spinKey) {
    spinning ? stop() : spin()
  } else if (e.keyCode == 38) {
    speed++
  } else if (e.keyCode == 40) {
    speed--
  }
}

function spin () {
  const images = all_santis
  let rot = 0
  interval = setInterval(() => {
    rot += speed
    Array.prototype.forEach.call(images, (el, i) => {
      el.style.transform = `rotate(${rot/4 - i}deg)`
    })
  }, 16)
  spinning = true
}

function stop () {
  clearInterval(interval)
  const els = document.body.getElementsByTagName("img")
  Array.prototype.forEach.call(els, (el) => {
    el.style.transform = "rotate(0deg)"
  })
  spinning = false
  speed = 1
}

ʕಠᴥಠʔ({
  clientX: window.innerWidth / 4,
  clientY: window.innerHeight / 4,
})
spin()