//Player controlled by the AI
class PlayerAI extends Player
{
    #brain;
    #fitness;
    alpha = 0.5; //Transparency; passed onto the GUI

    constructor(width, world, brainSize, id = "clone", genetics = [])
    {
        super(width, world);
        this.#brain = new Brain(brainSize, this.power, genetics);
        this.id = id;
        this._init();
    }

    get brain() { return this.#brain; }
    get maxJumps() { return this.#brain.size; }
    get fitness() { return this.#fitness; }

    _init()
    {
        this._reset();
        this.jumpHistory = new Queue(this.World.maxJumps);
        this._goToStart();
        //this.state = "moving" as player may start by falling through thin air
        this.state = "moving";
    }

    //Return the jump defined by the specified gene
    getJump(index)
    {
        let gene = this.#brain.genetics[index],
            angle;

        //-0 -> -pi/2 -> pi/2 -> 0 (direction)
        //-pi/2 -> pi/2 (angle)
        //so this is now linear -> mutations have intended (little) effect

        if(gene.direction >= 0)
        {
            angle = Math.PI/2 - gene.direction;
        } else
        {
            angle = -Math.PI/2 - gene.direction;
        }

        return { magnitude: gene.magnitude, angle: angle }
    }

    //Returns a deep copy of this AI
    clone()
    {
        return new PlayerAI(this.width, this.World, this.#brain.size, "clone", this.#brain.copyGenetics());
    }

    //Promote this AI to leader (best performance from previous generation)
    setLeader()
    {
        this.id = "leader";
        this.img = "clone-leader";
    }

    //Calculate fitness of AI
    //See Pseudocode in Documented Design for more comments
    calcFitness()
    {
        //Maybe something more elegant? It gets the job done, though.
        if(this.state === "finish")
        {
            this.#fitness = (this.maxJumps - this.noOfJumps + 1)*20 + 50;
        } else
        {
            let end = this.World.tilemap.blocks.find(block => {
                return block.id == "end"
            });

            this.#fitness = 1000/this.getDistFromTile(end);
        }
    }

    //Subroutine called every frame
    tick()
    {
        this.update();
    }
}