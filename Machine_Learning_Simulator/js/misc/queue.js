//User-defined library class: Queue
//A queue is an ordered collection of members: they can be removed from the start and added to the end.
//This is not a circular queue as a circular queue is not required for my project
class Queue
{
    #maxSize;

    #data;
    #size = 0;
    #pointer = 0;

    constructor(size)
    {
        this.#maxSize = size;
        this.#data = new Array(size);
    }

    //Returns an array which holds the data in the queue
    get data()
    {
        return this.#data.filter(cell => cell != null);
    }

    get size() { return this.#size; }

    get isEmpty()
    {
        return this.#size === 0;
    }

    get isFull()
    {
        return this.#size === this.#maxSize;
    }

    //Adds specified item to the end of the queue
    enQueue(item)
    {
        let rear = this.#pointer + this.#size;

        this.#data[rear] = item;
        this.#size++; //Update size
    }

    //Removes and returns first item from the queue
    deQueue()
    {
        let item = this.#data[this.#pointer];
        this.#data[this.#pointer] = null;

        this.#pointer++;
        this.#size--; //Update size

        return item;
    }

    //Debugging
    log()
    {
        console.log(this.#data);
    }
    
}