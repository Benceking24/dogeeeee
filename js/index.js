window.requestAnimationFrame = window.requestAnimationFrame || window.webkitAnimationFrame || window.mozAnimationFrame || function(fn) {setTimeout(fn, 1000/60)};


/** engine.js **/
//Reusable engine.
//This sets up an engine that can be used over and over, and isn't tied to just a doge 'screensaver'
var Demo = function (cvs) {
    var self = this;

    this.entities = [];
    this.cvs = cvs;
    this.ctx = cvs.getContext('2d');

    this.start = function () {
            window.requestAnimationFrame(function loop() {
                  self.renderFrame();
                  window.requestAnimationFrame(loop);
});
}
};

//Engine methods
Demo.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}
Demo.prototype.renderFrame = function () {
    this.updateEntities();
}
Demo.prototype.updateEntities = function () {
    for(var i = 0, l = this.entities.length; i < l; i++ ) {
            this.entities[i].tick(this);
            this.entities[i].render(this.ctx);
    }
}
Demo.prototype.fullScreen = function () {
    var cvs = this.cvs;
    window.addEventListener('resize', function () {
            cvs.height = window.innerHeight;
            cvs.width = window.innerWidth;
});
    window.dispatchEvent(new Event('resize'));
}


//Engine classes
/** engine.entity.js **/
Demo.Entity = function (config) {
      config = config || {};

      if(config.graphic) this.setGraphic(config.graphic);
      this.setPosition(config.x||0, config.y||0);
      this.setSpeed(config.vx||0, config.vy||0, config.vt||0);
    this.setRotation(config.t||0);
};
Demo.Entity.prototype.tick = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.t += this.vt;
};
Demo.Entity.prototype.render = function (ctx) {
    var x = this.x + this.graphic.width/2,
        y = this.y + this.graphic.height/2;
    ctx.translate(x, y);
    ctx.rotate(this.t);
    ctx.drawImage(this.graphic, -this.graphic.width/2, -this.graphic.height/2);
    ctx.rotate(-this.t);
    ctx.translate(-x, -y);
};
Demo.Entity.prototype.setGraphic = function (img) {
    this.graphic = img;
};
Demo.Entity.prototype.setPosition = function (x,y) {
      this.x = x;
      this.y = y;
};
Demo.Entity.prototype.setRotation = function (t) {
      this.t = t;
};
Demo.Entity.prototype.setSpeed = function (vx, vy, vt) {
      this.vx = vx;
      this.vy = vy;
      this.vt = vt;
};


//use the engine for our demo
/** dogedemo.js **/
var dogeDemo = new Demo(document.getElementById('doge'));

dogeDemo.fullScreen();

//custom class that extends Demo.Entity
var Doge = function () {
    this.setGraphic(document.getElementById('doge-image'));
      this.setPosition(
            Math.random() * dogeDemo.cvs.width,
            Math.random() * dogeDemo.cvs.height
    );
      this.setRotation(Math.random() * Math.PI * 2);
      this.setSpeed(
            (.5 - Math.random()) * 2,
            (.5 - Math.random()) * 2,
            Math.random() * Math.PI/1000
      );
}
Doge.prototype = new Demo.Entity;
Doge.prototype.tick = function (engine) {
      Demo.Entity.prototype.tick.apply(this); //call super method
    //if out of bounds, correct
      var cvs = engine.cvs,
          graphic = this.graphic;
      if (this.x > cvs.width) this.x = -graphic.width;
      if (this.y > cvs.height) this.y = -graphic.height;
      if (this.x < -graphic.width) this.x = cvs.width + graphic.width;
    if (this.y < -graphic.height) this.y = cvs.height + graphic.height;
}
//add 200 doges to the scene
for(var i=0; i<200; i++) {
      dogeDemo.addEntity(new Doge())
}
dogeDemo.start();