class Queue<Type>{
    _items:Array<Type>;
    constructor(...items){
        this.enqueue(...items)
        this._items = new Array<Type>()
    }

    enqueue(...items){
        items.forEach( item => this._items.push(item) )
        return this._items;
    }

    dequeue(){
        return this._items.shift();
    }

    peek(){
        return this._items[0]
    }

}


export default Queue;