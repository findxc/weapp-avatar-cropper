// 在使用 context.drawImage 之前需要先用 canvas.createImage 来创建一个图片对象
export const loadCanvasImage = (canvas, src) => {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (e) => {
      reject(e)
    }
    img.src = src
  })
}
