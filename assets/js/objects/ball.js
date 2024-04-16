export class Ball {
    constructor(aPoint, radius, aColor){
        this._point = aPoint;
        this._radius = radius;
        this._color = aColor;
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

    get color(){
        return this._color;
    }

    set x(aValue){
        this._point.x = aValue;
    }

    set y(aValue){
        this._point.y = aValue;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._point.x, this._point.y, this._radius, 0, Math.PI * 2);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.closePath(); 
    }     

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "radius": this._radius, "color": this._color};
    }
}

