;
// 使用jQuery插件的形式写的拖拽
(function () {
    // 构造
    function Drag(selector) {
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
            this.setDrag();
        },
        // 获取元素的属性
        getStyle: function (property) {
            return document.defaultView.getComputedStyle ?  document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
        },
        // 获取当前位置信息
        getPosition: function () {
            var pos = {x: 0, y:0};
            var transform = getTransform();
            if (transform) {
                var transformValue = this.getStyle(transform);
                if (transformValue === 'none') {
                    this.elem.style[transform] = 'translate(0, 0)';
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
                        y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
                    }
                }
            }
            return pos;
        },
        // 设置元素位置
        setPosition: function (pos) {
            var transform = getTransform();
            if (transform) {
                this.elem.style[transform] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
            } else {
                this.elem.style.left = pos.x;
                this.elem.style.top = pos.y;
            }
        },
        // 给元素绑定事件
        setDrag: function () {
            var self = this;
            this.elem.addEventListener('mousedown', start, false);
            function start(event) {
                self.startX = event.pageX;
                self.startY = event.pageY;

                var pos = self.getPosition();

                self.sourceX = pos.x;
                self.sourceY = pos.y;

                self.elem.addEventListener('mousemove', move, false);
                self.elem.addEventListener('moveup', end, false);
            }

            function move(event) {
                var currentX = event.pageX;
                var currentY = event.pageY;

                var distanceX = currentX - self.startX;
                var distanceY = currentY - self.startY;

                self.setPosition({
                    x: (self.sourceX + distanceX).toFixed(),
                    y: (self.sourceY + distanceY).toFixed()
                });
            }

            function end(event) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
            };
        }
    }
    function getTransform() {
        var transform = '';
        var transformArr = transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
        var divStyle = document.createElement('div').style;
        for (var i = 0; i < transformArr.length; i++) {
            if (transformArr[i] in divStyle) {
                return transform = transform[i];
            }
        }
        return transform;
    }

    window.Drag = Drag;

    //通过扩展方法将拖拽扩展为jQuery的一个实例方法
    (function ($) {
        $.fn.extend({
            becomeDrag: function () {
                new Drag(this[0]);
                // 为了保证jQuery所有的方法都能够链式访问，么一个方法的最后都需要返回this，即返回jQuery实例
                return this;
            }
        });
    })(jQuery);
})();

new Drag('firstbox');