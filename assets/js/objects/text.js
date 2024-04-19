export class Text {
    constructor(aPoint,aFontType, aColor){
        this._point = aPoint;
        this._fontType = aFontType;
        this._color = aColor;
    }

    get x () {
        return this._point.x;
    }

    get y() {
        return this._point.y;
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

    drawText(ctx, aText) {
        ctx.font = this._fontType;
        ctx.fillStyle = this._color;
        ctx.fillText(aText, this._point.x, this._point.y);
    }

    drawStrokeText(ctx, aText) {
        ctx.font = this._fontType;
        ctx.strokeStyle = this._color;
        ctx.strokeText(aText, this._point.x, this._point.y);
    }

    printValues() {
        return { "x": this._point.x, "y": this._point.y, "text": this._text, "color": this._color};
    }
}

