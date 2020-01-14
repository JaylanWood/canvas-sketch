var canvas = document.querySelector('.canvas')
var context = canvas.getContext('2d')

var pen = document.querySelector('.pen')
var eraser = document.querySelector('.eraser')
var clear = document.querySelector('.clear')
var download = document.querySelector('.download')
var color = document.querySelector('.color')
var linewidthSet = document.querySelector('.linewidth')
var lineWidthShow = document.querySelector('.lineWidthShow')

var lastPoint = {}
var drawing = false
var using = 'pen'
var linewidth = 3

autoResetCanvasSize()
listenToTools()
listenToUser()

// 自动适应 canvas 宽高
function autoResetCanvasSize() {
  setCanvasToPageSize()
  window.onresize = function () {
    setCanvasToPageSize()
  }
}

// 设置 canvas宽高 为 页面宽高
function setCanvasToPageSize() {
  var pageWidth = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  canvas.width = pageWidth
  canvas.height = pageHeight
}

// 画笔画线
function drawLine(x1, y1, x2, y2) {
  console.log('画笔')
  context.globalCompositeOperation = 'source-over';

  context.beginPath()
  context.lineWidth = linewidth
  context.lineCap = 'round'
  context.lineJoin = 'round';
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}
// 橡皮擦清线
function clearLine(x1, y1, x2, y2) {
  console.log('橡皮擦')
  context.globalCompositeOperation = 'destination-out';

  context.beginPath()
  context.lineWidth = 20
  context.lineCap = 'round'
  context.lineJoin = 'round';
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.closePath()
}
// 清空画板
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}
// 下载保存
function downloadImage() {
  var link = document.createElement('a');
  link.download = 'canvas.png';
  link.href = canvas.toDataURL("image/png")
  link.click();
}

// 监听工具栏
function listenToTools() {
  pen.addEventListener('click', function () {
    using = 'pen'
    pen.classList.add('active')
    eraser.classList.remove('active')
  })
  eraser.addEventListener('click', function () {
    using = 'eraser'
    eraser.classList.add('active')
    pen.classList.remove('active')
  })
  clear.addEventListener('click', function () {
    clearCanvas()
  })
  download.addEventListener('click', function () {
    downloadImage()
  })
  color.addEventListener('input', function (xxx) {
    context.strokeStyle = xxx.target.value
    lineWidthShow.style.background = xxx.target.value
  })
  linewidthSet.addEventListener('input', function (xxx) {
    linewidth = parseInt(xxx.target.value)
    lineWidthShow.style.width = xxx.target.value + 'px'
  })
}

// 监听鼠标
function listenToMouse() {
  // 鼠标按下
  canvas.addEventListener('mousedown', function (xxx) {
    var x = xxx.clientX
    var y = xxx.clientY
    lastPoint = {
      x: x,
      y: y
    }
    drawing = true
  })
  // 鼠标移动
  canvas.addEventListener('mousemove', function (xxx) {
    var x = xxx.clientX
    var y = xxx.clientY
    var newPoint = {
      x: x,
      y: y
    }
    if (drawing) {
      switch (using) {
        case 'pen':
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          break;
        case 'eraser':
          clearLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          break;
      }
    }
    lastPoint = newPoint
  })
  // 鼠标松开
  canvas.addEventListener('mouseup', function (xxx) {
    drawing = false
  })
}

// 监听触摸
function listenToTouch() {
  // 触摸开始
  canvas.addEventListener('touchstart', function (xxx) {
    var x = xxx.touches[0].clientX
    var y = xxx.touches[0].clientY
    lastPoint = {
      x: x,
      y: y
    }
    drawing = true
  })
  // 触摸移动
  canvas.addEventListener('touchmove', function (xxx) {
    var x = xxx.touches[0].clientX
    var y = xxx.touches[0].clientY
    var newPoint = {
      x: x,
      y: y
    }
    if (drawing) {
      switch (using) {
        case 'pen':
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          break;
        case 'eraser':
          clearLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          break;
      }
    }
    lastPoint = newPoint
  })
  // 触摸结束
  canvas.addEventListener('touchend', function (xxx) {
    drawing = false
  })
}

// 设备特性检测
function listenToUser() {
  if (document.body.ontouchstart !== undefined) {
    //触屏设备
    listenToTouch()
  } else {
    //非触屏设备
    listenToMouse()
  }
}