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
  }
  render() {}
  connectedCallback() {}
  attributeChangedCallback(attrName, oldValue, newValue) {}
}
customElements.define("opencv-wasm", Component)
