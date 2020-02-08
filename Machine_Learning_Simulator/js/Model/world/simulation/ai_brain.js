//Brain of the AI which stores the genetics
class Brain
{
    //Direction measured in radians
    #minJumpDirection;
    #maxJumpDirection;
    #minJumpMagnitude;
    #maxJumpMagnitude;

    genetics = [];

    constructor(size, jumpPower, genetics = [])
    {
        this.#maxJumpMagnitude = jumpPower;
        this.#minJumpMagnitude = jumpPower * 0.6;
        //this.#minJumpDirection = -Math.PI/2 * 0.5;

        //To help make the AIs learn faster, the AIs can't jump to the left.
        //They still perform terrible in the first few generations, though. So it's a good learning curve for the AIs
        this.#minJumpDirection = 0;
        this.#maxJumpDirection = Math.PI/2 * 0.5;

        if(genetics.length === 0)
        {
            this._createRandomGenetics(size);
        } else
        {
            this.genetics = genetics;
        }
    }

    get size() { return this.genetics.length; }

    //Creates a random gene
    _createGene()
    {
        let magnitude = Math.random() * (this.#maxJumpMagnitude - this.#minJumpMagnitude) + this.#minJumpMagnitude;
        let direction = Math.random() * (this.#maxJumpDirection - this.#minJumpDirection) + this.#minJumpDirection;

        return new Gene(magnitude, direction);
    }

    //Mutate gene slightly
    _mutateGene(gene)
    {
        let magDeviation = 0.4,
            dirDeviation = 0.04;

        //Mutate magnitude
        gene.magnitude += Math.random() * magDeviation - magDeviation/2;

        //Constrain magnitude
        if(gene.magnitude > this.#maxJumpMagnitude) gene.magnitude = this.#maxJumpMagnitude;
        if(gene.magnitude < this.#minJumpMagnitude) gene.magnitude = this.#minJumpMagnitude;

        //Mutate direction
        gene.direction += Math.random() * dirDeviation - dirDeviation/2;

        //Constrain direction
        if(gene.direction > this.#maxJumpDirection) gene.direction = this.#maxJumpDirection;
        if(gene.direction < this.#minJumpDirection) gene.direction = this.#minJumpDirection;
    }

    //Removes current genetics and adds new genetics
    _createRandomGenetics(size)
    {
        this.genetics = [];
        this.addRandomGenetics(size);        
    }

    //Creates and adds new genetics to the brain
    addRandomGenetics(size)
    {
        for(let i = 0; i < size; i++)
        {
            this.genetics.push(this._createGene());
        }
    }

    //Mutate all genetics
    mutateGenetics(chance)
    {
        this.genetics.forEach((gene, i) => {
            //Mutate gene slightly
            this._mutateGene(gene);

            //On rare occasions, mutate gene a lot, i.e. replace gene with a new gene
            if(Math.random() < chance)
            {
                this.genetics[i] = this._createGene();
            }
        });
    }

    //Returns a deep clone of the genetics
    //Used when AI creates offspring
    copyGenetics()
    {
        let copy = [];
        this.genetics.forEach(gene => {
            copy.push(new Gene(gene.magnitude, gene.direction));
        });

        return copy;
    }

}