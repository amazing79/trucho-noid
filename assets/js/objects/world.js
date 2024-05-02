export class World {
    constructor(aId){
        this._id = aId;
        this._canvas = document.getElementById(aId);
        this._context = this._canvas.getContext("2d");
    }

    get id () {
        return this._id;
    }

    getCanvas(){
        return this._canvas;
    }

    getContext2D()
    {
        return this._context;
    }

    createEventListener(name, handler){
        //this._canvas.addEventListener(name, e => handler(e));
        document.addEventListener(name, e => handler(e));
    }
}