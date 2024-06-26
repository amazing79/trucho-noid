export class Ball extends EventTarget {
    constructor(aPoint, radius, aColor){
        super();
        this._point = aPoint;
        this._radius = radius;
        this._color = aColor;
        this._dx = 2;
        this._dy = -2;
    }

    get x () {
        return this._point.x;
    }

    get y() {
        return this._point.y;
    }

    get radius(){
        return this._radius;
    }

    set x(aValue){
        this._point.x = aValue;
    }

    set y(aValue){
        this._point.y = aValue;
    }

    changeDy(){
        this._dy = -(this._dy);
    }

    changeDX(){
       this._dx = -(this._dx);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._point.x, this._point.y, this._radius, 0, Math.PI * 2);
        ctx.fillStyle = this._color;
        ctx.fill();
       // ctx.closePath();
    }

    _emitHitEvent(aWall) {
        this.dispatchEvent( new CustomEvent("hitWall", { detail: aWall }));
    }

    checkWallsCollision(world){
        if(this.collisionWalls(world)) {
            this.changeDX();
            this._emitHitEvent("the wall");
            return true;
        }
        if(this.collisionTop()) {
            this.changeDy()
            this._emitHitEvent("top");
            return true;
        }
    }

    collisionWalls(world) {
        return (this.x + this._dx > world.width - this._radius || this.x + this._dx < this._radius)
    }

    collisionTop(){
        return  (this.y + this._dy < this._radius)
    }

    collisionBottom(world){
        return this.y + this._dy > world.height - this._radius
    }

    collisionPaddle(obj) {
        let hit = this.x > obj.x && this.x < obj.x + obj.width;
        if(hit){
            this.changeDy()
        }
        return hit;
    }

    updateSpeed(){
        this._dx *= 1.5;
        this._dy *= 1.5;
    }

    updatePosition() {
        this._point.x += this._dx;
        this._point.y += this._dy;
    }

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "radius": this._radius, "color": this._color};
    }
}

