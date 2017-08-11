
/**
    使用原生js完成图像拖拽
 */


// 获取目标对象
var oElem = document.getElementById('firstbox');
// 声明两个变量来保存鼠标初始位置的x,y坐标
var startX = 0;
var startY = 0;
// 声明2个变量来保存目标元素初始位置的x,y坐标
var sourceX = 0;
var sourceY = 0;
oElem.addEventListener('mousedown', start, false);
// 开始
function start (event) {
    startX = event.pageX;
    startY = event.pageY;
    // 获取元素的初始位置
    var pos = getTargetPos(oElem);
    sourceX = pos.x;
    sourceY = pos.y;
    // 绑定
    document.addEventListener('mousemove', move, false);
    document.addEventListener('mouseup', end, false)
}

// 移动
function move(event) {
    // 获取鼠标当前的位置
    var currentX = event.pageX;
    var currentY = event.pageY;

    // 计算差值
    var distanceX = currentX - startX;
    var distanceY = currentY - startY;
    // 计算并设置当前元素的位置
    setTargetPos(oElem, {
        x: (sourceX + distanceX).toFixed(),
        y: (sourceY + distanceY).toFixed()
    })
}

// 结束
function end(event) {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', end);
}

// 获取元素的样式，兼容任何浏览器
function getStyle(elem, property) {
    return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, false)[property] : elem.currentStyle[property];
}

// 查看浏览器是否支持transform属性
function getTransform () {
    var transform = '';
    var transformArr = ['tranform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
    var divStyle = document.createElement('div').style;

    for (var i = 0; i < transformArr.length; i++) {
        if (transformArr[i] in divStyle) {
            return transform = transformArr[i];
        }
    }
    return transform;
} 

// 获取目标元素的位置
function getTargetPos(elem) {
    var pos = {x: 0, y: 0};
    var transform = getTransform();
    if (transform) {
        var transformValue = getStyle(elem, transform);
        if (transformValue === 'none') {
            elem.style[transform] = 'translate(0, 0)';
            return pos;
        } else {
            var temp = transformValue.match(/-?\d+/g);
            return pos = {
                x: parseInt(temp[4].trim()),
                y: parseInt(temp[5].trim())
            }
        }
    } else {
        if (getStyle(elem, 'position') === 'static') {
            elem.style.position = 'relative';
            return pos;
        } else {
            var x = parseInt(getStyle(elem, 'left') ? getStyle(elem, 'left') : 0);
            var y = parseInt(getStyle(elem, 'top') ? getStyle(elem, 'top') : 0);
            return pos = {
                x: x,
                y: y
            }
        }
     }
}

// 在拖拽的过程中我们要不停的设置目标元素的新位置，这样才会移动，因此我们需要一个设置目标元素位置的方法
// pos = {x: 200, y: 200}
function setTargetPos(elem, pos) {
    var transform = getTransform();
    if (transform) {
        elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
    } else {
        elem.style.left = pos.x;
        elem.style.top = pos.y
    }
    return elem;
}
