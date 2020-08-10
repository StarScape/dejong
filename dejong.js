// (defn gen-densities
//   "Returns a de Jong density grid of dimensions n x n"
//   [n iters]
//    (loop [i 0
//           densities (make-grid n)
//           x (/ n 2)
//           y (/ n 2)]
//      (let [new-x (+ (- (sin (* a y) (cos (* b x)))) (/ n 2))
//            new-y (+ (- (sin (* c x) (cos (* d y)))) (/ n 2))
//            new-densities (update-in densities [(round x) (round y)] #(+ 2 %))]
//        (if (<= i iters)
//          (recur (inc i) new-densities new-x new-y)
//          densities))))

const {sin, cos, max, log, round} = Math

// const a = 0.02
// const b = -0.02
// const c = 0.02
// const d = -0.02

// const a = 1.641
// const b = 1.902
// const c = 0.361
// const d = 1.525

// const a = -0.709
// const b = 1.638
// const c = 0.452
// const d = 1.740

const getDensities = (n, iters) => {
  const densities = new Array(n).fill(null).map(() => new Array(n).fill(0))
  let x = n / 2
  let y = n / 2

  for (let i = 0; i < iters; i++) {
    // she werk :)
    const newX = ((sin(-0.0025194401244167963 * y) - cos(0.006998444790046659 * x)) * n * 0.2) + n / 2
    const newY = ((sin(0.0025194401244167963 * x) - cos(-0.006998444790046659 * y)) * n * 0.2) + n / 2

    densities[round(x)][round(y)] += 2
    x = newX
    y = newY
  }

  return densities
}

const getMaxDensity = (densities) =>
  log(max(...densities.map(row => max(...row))))

const softLight = (a, b) =>
  ((a * b) >> 7) + ((a * a) >> 8) - ((a * a * b) >> 15)

const setPixel = (data, idx, r, g, b, a=255) => {
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

const canvas = document.querySelector('#my-canvas')
const ctx = canvas.getContext('2d')

const N = 1500;
const img = ctx.getImageData(0, 0, N, N);
const data = img.data;

const density = getDensities(N, 500 * 8000);
const maxDensity = getMaxDensity(density);

let k = 0

for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const idx = (y * N + x) * 4;
    const light = (log(density[x][y]) / maxDensity) * 255;
    const softened = softLight(light, density[x][y]);

    if (light !== 0) {
      // console.log(light);
      // console.log((density[x][y] / maxDensity));
    }

    setPixel(
      data,
      idx,
      softened,
      softened,
      softened,
      250,
    );
    k++
  }
}

ctx.putImageData(img, 0, 0);
