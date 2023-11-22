const html = String.raw

class Component extends HTMLElement {
  name = "OpenCV"
  input = {}
  output = {}
  property = {}
  static observedAttributes = []
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: "closed" })
    this.shadow.innerHTML = html`<h1>opencv-wasm</h1>`
    const canvas = document.createElement("canvas")
    const dest = canvas.transferControlToOffscreen()
    this.shadow.appendChild(canvas)

    const worker = new Worker("./lib/worker.js")
    worker.addEventListener("message", (message) => {
      switch (message.data.type) {
        case "ready":
          const img = new Image()
          img.src = "./example.jpg"
          img.onload = () => {
            worker.postMessage(dest, [dest])
            worker.postMessage({ type: "imread", param: { element: img.src } })
            setTimeout(() => {
              const dataURL = canvas.toDataURL("image/png")
              const newTab = window.open("about:blank", "image from canvas")
              newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>")
            }, 1000)
          }
          break
        case "result":
          console.log("result", message.data)
          break
        default:
          break
      }
      worker.addEventListener("error", (error) => {
        console.log(error)
      })
    })
    this.worker = worker
  }
  render() {}
  connectedCallback() {}
  disconnectedCallback() {
    this.worker.terminate()
  }
  attributeChangedCallback(attrName, oldValue, newValue) {}
}
customElements.define("opencv-wasm", Component)
