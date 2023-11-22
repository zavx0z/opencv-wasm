self.HTMLImageElement = ImageBitmap
self.HTMLCanvasElement = OffscreenCanvas
self.document = {
  createElement() {
    return new OffscreenCanvas(300, 150)
  },
}
async function fetchAsBlob(url) {
  const resp = await fetch(url)
  if (!resp.ok) {
    throw "Network Error"
  }
  return resp.blob()
}
;(async function () {
  const loadWasm = (await import("./opencv.js")).default
  const cv = await loadWasm()
  try {
    postMessage({ type: "ready" })
    addEventListener("error", (event) => {
      console.log(event)
    })
    let dest
    addEventListener("message", async (event) => {
      switch (event.data.type) {
        case "imread":
          const source = await fetchAsBlob(event.data.param.element)
          const inputBmp = await createImageBitmap(source)

          const src = cv.imread(inputBmp)
          const dst = new cv.Mat()

          let dst2 = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3)

          cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0)
          cv.threshold(src, src, 128, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU)
          // cv.bitwise_not(src)
          cv.imshow(dest, src)
          console.log(JSON.stringify(src))
          // cv.Canny(src, dst, 90, 100, 3, false)
          // cv.imshow(dest, dst)

          // cv.threshold(src, src, 120, 200, cv.THRESH_BINARY)

          // let contours = new cv.MatVector()
          // let hierarchy = new cv.Mat()
          // cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
          // // draw contours with random Scalar
          // for (let i = 0; i < contours.size(); ++i) {
          //   let color = new cv.Scalar(
          //     Math.round(Math.random() * 255),
          //     Math.round(Math.random() * 255),
          //     Math.round(Math.random() * 255)
          //   )
          //   cv.drawContours(dst2, contours, i, color, 1, cv.LINE_8, hierarchy, 100)
          // }
          // cv.imshow(dest, dst2)

          src.delete()
          dst.delete()
          inputBmp.close()
          break
        default:
          console.log("worker", event.data)
          dest = event.data
          break
      }
    })
  } catch {
    postMessage({ error: { code: 200, message: "Not loaded" } })
  }
})()
