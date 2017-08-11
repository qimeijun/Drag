;
(function () {
    var transform = getTransform();
    function Drag(selector) {
        // 放在构造函数中的属性，都是属于每一个实例单独拥有的。
        this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;

        this.init();
    }

    // 原型
    Drag.prototype = {
        constructor: Drag,
        init: function () {
            // 初始时需要做些什么事情
            this.setDrag();
        },
        // 稍作改造，仅用于获取当前元素的属性，类似于getName
        getStyle: function (property) {
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
        },

        // 获取当前元素的位置
        getPosition: function () {
            var pos = {x: 0, y: 0};
            if (transform) {
                var transformValue = this.getStyle(transform);
                if (transformValue === 'none') {
                    this.elem.style[transform] = 'translate(0,0)';
                } else {
                    var temp = transformValue.match(/-?\d+/g);
                    pos = {
                        x: parseInt(temp[4].trim()),
                        y: parseInt(temp[5].trim())
                    }
                }
            } else {
                if (this.getStyle('position') === 'static') {
                    this.elem.style.position = 'relative';
                } else {
                    pos = {
                        x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
                        y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0),
                    }
                }

            }
            return pos;
        },
        // 用来设置当前的位置
        setPosition: function (pos) {
            if(transform) {
                this.elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
            } else {
                this.elem.style.left = pos.x + 'px';
                this.elem.style.top = pos.y + 'px';
            }
        },

        // 事件绑定
        setDrag: function () {
            var self = this;
            this.elem.addEventListener('mousedown', start, false);
            function start(event) {
                self.startX = event.pageX;
                self.startY = event.pageY;

                var pos = self.getPosition();

                self.sourceX = pos.x;
                self.sourceY = pos.y;
                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', end, false);
            }

            function move(event) {
                var currentX = event.pageX;
                var currentY = event.pageY;
                
                var distanceX = currentX - self.startX
                var distanceY = currentY - self.startY;
                
                self.setPosition({
                    x: (self.sourceX + distanceX).toFixed(),
                    y: (self.sourceY + distanceY).toFixed()
                });
            }

            function end(event) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', move);
            }
        }
    }        

    // 私有方法，用于获取transform的兼容写法
    function getTransform() {
        var transform = '';
        var transformArr = transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
        var divStyle = document.createElement('div').style;

        for (var i = 0; i < transformArr.length; i++) {
            if (transformArr[i] in divStyle) {
                return transform = transformArr[i];
            }
        }
        return transform;
    }

    // 一种对外暴露的方式
    window.Drag = Drag;
})();
new Drag('firstbox');

