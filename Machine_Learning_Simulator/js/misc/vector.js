//User-defined library class: Vector2D
//Represents a 2D vector or coordinate point.
class Vector2D
{
    #x;
    #y;

    constructor(x, y)
    {
        this.#x = x;
        this.#y = y;
    }

    //Getters
    get x() { return this.#x; }
    get y() { return this.#y; }

    //Returns magnitude of vector using Pythagoras theorem
    get magnitude()
    {
        return Math.sqrt(this.#x**2 + this.#y**2);
    }

    //Setters
    setX(x)
    {
        this.#x = x;
    }

    setY(y)
    {
        this.#y = y;
    }

    set(position)
    {
        this.#x = position.x;
        this.#y = position.y;
    }

    //Increases this x property by specified 'x'
    addX(x)
    {
        this.#x += x;
    }

    //Increases this y property by specified 'y'
    addY(y)
    {
        this.#y += y;
    }

    add(position)
    {
        this.#x += position.x;
        this.#y += position.y;
    }

    subtract(position)
    {
        this.#x -= position.x;
        this.#y -= position.y;
    }

    //Returns a deep copy of this object
    copy() { return new Vector2D(this.x, this.y); };

    //Checks if vector is zero
    isZero()
    {
        return (this.#x === 0 && this.#y === 0);
    }

    //Rounds vector to 2 decimal places
    round()
    {
        this.#x = Math.round(this.#x * 100) / 100;
        this.#y = Math.round(this.#y * 100) / 100;
    }
    
}