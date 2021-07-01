// Tools
;(function(){
  var Tools = {
  getRandom: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) +  min;
  }
}

  window.Tools = Tools;
})()
// Food对象
;(function() {
  var position = 'absolute';
  // 记录上一次创建的食物，为删除做准备
   var elements = []; 
  // 食物对象
  function Food(options) {
    options =options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.color = options.color || 'green';
  }

  Food.prototype.render = function (map) {
    remove();
    // 随机设置x和y的值
    this.x = Tools.getRandom(0, map.offsetWidth/this.width - 1) * this.width;
    this.y = Tools.getRandom(0, map.offsetHeight/this.height - 1) * this.height;
    // 动态创建div 页面上显示食物
    var div = document.createElement('div');
    map.appendChild(div);
    //设置div的样式
    div.style.position = position;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px ';
    div.style.backgroundColor = this.color;
    elements.push(div);
  }
  function remove() {
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.parentNode.removeChild(element);
      elements.splice(i,1);
    }
  }
  window.Food = Food;
})()
// 蛇对象
;(function () {
  var position = 'absolute';
  // 记录之前创建的蛇
  var elements = [];
  function Snake(options) {
    options = options || {};
    // 蛇节的大小
    this.width = options.width || 20;
    this.height = options.height || 20;
    // 蛇移动的方向
    this.direction = options.direction || 'right';
    // 蛇的身体 第一个元素是蛇头
    this.body = [
      {x: 3, y: 2, color: 'red'},
      {x: 2, y: 2, color: 'blue'},
      {x: 1, y: 2, color: 'blue'},
    ]
  }

  Snake.prototype.render = function (map) {
    // 删除之前创建的蛇
    remove();
    // 把每一个蛇节渲染到地图上  
    for(var i = 0, len =this.body.length; i < len; i++) {
      // 蛇节
      var obj = this.body[i];

      var div = document.createElement('div');
      map.appendChild(div);
      elements.push(div);
      // 设置样式
      div.style.position = position;
      div.style.width = this.width + 'px';
      div.style.height = this.height +'px';
      div.style.left = obj.x *this.width + 'px';
      div.style.top = obj.y *this.height + 'px';
      div.style.backgroundColor = obj.color;
    } 
  }

  function remove() {
    for(var i = elements.length - 1; i >= 0; i--){
      elements[i].parentNode.removeChild(elements[i]);
      elements.splice(i,1);
    }
  }

  // 控制蛇移动的方法
  Snake.prototype.move = function(food,map) {
      // 控制蛇的身体移动（当前蛇节到上一蛇节的位置）
      for(var i = this.body.length -1; i > 0;i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;              
  }
  // 控制蛇头的方向
  // 判断蛇移动的方向
  var head = this.body[0];
    switch(this.direction) {
      case'right':
      head.x += 1;
      break; 
      case'left':
      head.x -= 1;
      break;
      case'top':
      head.y -= 1;
      break;
      case'bottom':
      head.y += 1;
      break;
    }
    // 判断蛇头是否与食物重合
    var headX = head.x * this.width;
    var headY = head.y * this.height;
    if(headX === food.x && headY === food.y) {
      // 让蛇增加一节
      // 获取蛇的最后一节
      var last = this.body[this.body.length -1];
      this.body.push({
        x:last.x,
        y:last.y,
        color:last.color
      })
      // 随机生成一个食物
      food.render(map);
    }

  }
  window.Snake = Snake;
})()
// 游戏对象
;(function (){
  var that; //记录游戏对象
  function Game(map) {
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    that = this;
  }

  Game.prototype.start = function () {
    // 1 把蛇和食物对象，渲染到地图上
    this.food.render(this.map);
    this.snake.render(this.map);
    // 2开始游戏的逻辑
    // 让蛇移动起来
    runSnake();
    // 通过键盘控制蛇移动的方向
    bindKey();
    // 当蛇遇到食物 做相应的处理
  }
    function runSnake() {
    var timeId = setInterval(function() {
    // 在定时器中的function中this是指向window对象的
    this.snake.move(that.food,that.map);
    this.snake.render(that.map);

    var maxX = this.map.offsetWidth / this.snake.width;
    var maxY = this.map.offsetHeight / this.snake.height;
    var headX = this.snake.body[0].x;
    var headY = this.snake.body[0].y;
    // 当蛇遇到边界游戏结束  
    if(headX < 0 || headX >= maxX) {
      alert('Game Over');
      clearInterval(timeId);
    }
    if(headY < 0 || headY >= maxY) {
      alert('Game Over');
      clearInterval(timeId);
    }
    }.bind(that),150);
  }

  function bindKey() {
    document.addEventListener('keydown',function(e) {
        switch(e.keyCode) {
          case 37:
            this.snake.direction = 'left';
            break;
          case 38:
            this.snake.direction = 'top';
            break;
          case 39:
            this.snake.direction = 'right';
            break;
          case 40:
            this.snake.direction = 'bottom';
            break;
        }
    }.bind(that),false);
  }
  window.Game = Game; 
})();
// 启动
;(function(){
  var map = document.getElementById('map');
  var game = new Game(map);
  game.start();
})()