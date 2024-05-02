export class PaddleBall {
    constructor(aPoint, width,height, aColor){
        this._point = aPoint;
        this._width = width;
        this._height = height;
        this._color = aColor;
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

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this._point.x, this._point.y , this._width, this._height);
        ctx.fillStyle = this._color;
        ctx.fill();
        //ctx.closePath();
    }

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "width": this._width, "height": this._height, "color": this._color};
    }
}