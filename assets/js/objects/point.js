export class Point {
    constructor(x,y) {
        this._x = x;
        this._y = y;
    }

    get x(){
        return this._x;
    }
    set x(aValue){
        this._x = aValue;
    }

    get y() {
        return this._y;
    }

    set y(aValue){
        this._y = aValue;
    }
}