//Each Gene determines a jump
//Acts as a data structure
class Gene
{
    #magnitude;
    #direction;

    constructor(magnitude, direction)
    {
        this.#magnitude = magnitude;
        this.#direction = direction;
    }

    get magnitude() { return this.#magnitude; }
    get direction() { return this.#direction; }

    set magnitude(magnitude) { this.#magnitude = magnitude; }
    set direction(direction) { this.#direction = direction; }
}