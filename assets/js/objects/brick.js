export class Brick {
    constructor(aPoint, width,height, aColor){
        this._point = aPoint;
        this._width = width;
        this._height = height;
        this._color = aColor;
        this._status = 1;
    }

    get x () {
        return this._point.x;
    }

    get y() {
        return this._point.y;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    get status(){
        return this._status;
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

    set width(aValue){
        this._width = aValue;
    }

    set height(aValue){
        this._height = aValue;
    }

    set color(aValue){
        this._color = aValue;
    }

    set status(aValue){
        this._status = aValue;
    }

    isVisible(){
        return this._status === 1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this._point.x, this._point.y, this.width, this.height);
        //ctx.closePath();
    }

    collision(ball) {
        let cx = ball.x + ball.radius/2
        let px = cx; // En principio son iguales
        if ( px < this.x ) {
            px = this.x;
        }
        if ( px > this.x  + this.width) {
            px = this.x  + this.width;
        }
        let cy = ball.y + ball.radius/2;
        let py = cy;
        if ( py < this.y ) {
            py = this.y;
        }
        if ( py > this.y + this.height ) {
            py = this.y + this.height;
        }
        let distancia = Math.sqrt( (cx - px)*(cx - px) + (cy - py)*(cy - py) );
        return distancia < ball.radius
    }

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "width": this._width, "height": this._height, "color": this._color};
    }
}