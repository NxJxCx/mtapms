'use client'

function success(msg: string, options?: { title?: string; timer?: number; id?: string; }) {

  const container = document.createElement("div")
  container.className = "fixed top-5 left-[calc(50%-200px)] z-50 min-w-[350px] max-w-[350px] transition-all translate-y-[-200px] duration-200 ease-linear"
  container.id = "toaster_" + (options?.id || '1')

  const toast = document.createElement("div")
  toast.className = "relative mx-auto min-w-[350px] max-w-[350px] p-2 bg-[#ebfaef] text-[#356925] rounded-md shadow-md shadow-[#356925]"
  container.appendChild(toast)

  // timer progress bar
  const topProgress = document.createElement("div")
  topProgress.className = "absolute top-0 left-0 rounded-tl-md rounded-b-0 rounded-r-0 bg-[#539f45] h-[5px] transition-all duration-[" + (!!options?.timer ? Math.ceil(options.timer / 1000) : 5) + "s] ease-linear"
  topProgress.style.width = "0"
  toast.appendChild(topProgress)

  // toaster title
  const titleElement = document.createElement("h2")
  titleElement.className = "text-xl font-bold mt-2 mx-3"
  titleElement.textContent = options?.title || "Success!"
  toast.appendChild(titleElement)

  // content message
  const messageElement = document.createElement("p")
  messageElement.className = "text-sm font-medium ml-3 mr-12 mb-4 text-justify"
  messageElement.textContent = msg
  toast.appendChild(messageElement)

  // close button
  const closeButton = document.createElement("button")
  closeButton.className = "absolute right-3 top-[calc(50%-10px)] w-[20px] h-[20px] border border-[#356925] cursor-pointer z-10 rounded-full text-lg text-[#356925] font-bold hover:text-red-500 cursor-pointer"
  const xMark = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  xPath.setAttribute("d", "M6 18L18 6M6 6l12 12")
  xPath.setAttribute("strokeLinecap", "round")
  xPath.setAttribute("strokeLinejoin", "round")
  xMark.setAttribute("fill", "none")
  xMark.setAttribute("viewBox", "0 0 24 24")
  xMark.setAttribute("strokeWidth", "2")
  xMark.setAttribute("stroke", "#356925")
  xMark.appendChild(xPath)
  closeButton.appendChild(xMark)
  toast.appendChild(closeButton)

  const removeToaster = () => {
    container.classList.add("translate-y-[-200px]")
    setTimeout(() => {
      container.remove()
    }, 200)
  }
  const timer = setTimeout(() => {
    removeToaster()
  }, options?.timer || 5000);
  closeButton.addEventListener("click", (e: any) => {
    e.preventDefault()
    clearTimeout(timer)
    removeToaster()
  }, false)

  document.body.appendChild(container);
  setTimeout(() => {
    topProgress.style.width = '100%'
    container.classList.remove("translate-y-[-200px]")
  }, 30)
}

const Toaster = {
  success
}

export default Toaster