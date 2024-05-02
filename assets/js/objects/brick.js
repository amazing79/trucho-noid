export class Brick {
    constructor(aPoint, width,height, aColor){
        this._id = `key-${aPoint.x}-${aPoint.y}`;
        this._point = aPoint;
        this._width = width;
        this._height = height;
        this._color = aColor;
    }

    get id(){
        return this._id;
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

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this._point.x, this._point.y, this.width, this.height);
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
        if (distancia < ball.radius)
        {
            const event = new CustomEvent('collisionDetected', {detail: {id: this._id}});
            document.dispatchEvent(event);
        }
    }

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "width": this._width, "height": this._height, "color": this._color};
    }
}