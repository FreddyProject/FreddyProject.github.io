//This class contains, maintains and controls the AIs in each generation.
class Population
{
    #size;

    AIs = [];
    World;
    leader;

    constructor(size, world, isPreset)
    {
        this.#size = size;
        this.World = world;

        if(!isPreset)
        {
            this._createRandomAIs(world);
        } else
        {
            this._createPresetAIs(world);
        }
    }

    get size() { return this.#size; }

    //Called when starting simulation without any presets
    //Creates AIs with random genetics
    _createRandomAIs(world)
    {
        for(let i = 0; i < this.#size; i++)
        {
            this.AIs.push(new PlayerAI(world.unit, world, world.maxJumps));
        }
    }

    //Called when starting simulation with presets
    _createPresetAIs(world)
    {
        //Holds the genetics that are parsed from the Files data
        let brains = [];

        FILE_DATA.forEach(data => {
            let genetics = [];

            data.forEach(jump => {
                let gene = this._convertJumpToGene(jump);
                genetics.push(gene);
            });

            //Purpose: to store the genetics
            //20 = Player.power
            //Magic number (20); 999 doesn't matter. It's just a placeholder brain to store the genetics
            let brain = new Brain(999, 20, genetics);

            //If there are not enough genes, create some random filler genes.
            if(brain.size < world.maxJumps) brain.addRandomGenetics(world.maxJumps - brain.size);

            //If there are too many genes, remove the last few genes.
            brain.genetics.splice(world.maxJumps);

            brains.push(brain);
        });

        //Create actual AIs with genetics similar to the brains
        for(let i = 0; i < this.#size; i++)
        {
            let brain = brains[Math.floor(Math.random() * brains.length)]; //Selects random element (brain) from array
            let genetics = brain.copyGenetics(); //Deep clone

            //Create an AI with similar genetics
            this.AIs.push(new PlayerAI(world.unit, world, world.maxJumps, "clone", genetics));
        }

        //The AIs will then be mutated once in the Simulation class before the 1st generation.
    }

    //Converts jump (in Cartesian) to gene (in Polar coordinates)
    _convertJumpToGene(jump)
    {
        let x = jump[0],
            y = -jump[1];

        let angle = Math.atan(y/x), //Trigonometry
            magnitude = Math.sqrt(x**2 + y**2); //Pythagorus

        let angleModified;
        if(angle >= 0)
        {
            angleModified = Math.PI/2 - angle;

        } else
        {
            angleModified = -Math.PI/2 - angle;
        }

        return new Gene(magnitude, angleModified);
    }

    //'merge' of merge sort
    _merge(left, right)
    {
        let arr = [];

        while(left.length > 0 && right.length > 0)
        {
            if(left[0].fitness >= right[0].fitness)
            {
                arr.push(left.shift());
            } else
            {
                arr.push(right.shift());
            }
        }

        while(left.length > 0)
        {
            arr.push(left.shift());
        }

        while(right.length > 0)
        {
            arr.push(right.shift());
        }

        return arr;
    }

    //'sort' of merge sort
    //Puts most fit at the front and least fit at the end of the array
    sortByFitness(arr)
    {
        if(arr.length < 2)
        {
            //Base case of recursive algorithm
            return arr;
        } else
        {
            let mid = Math.ceil(arr.length/2),
            left = arr.slice(0, mid),
            right = arr.slice(mid, arr.length);

            //Calls mergesort recursively
            return this._merge(
                this.sortByFitness(left),
                this.sortByFitness(right)
                );
        }
    }
    
    //Checks if all AIs are stationary
    isStationary()
    {
        let stationary = true;

        this.AIs.forEach(ai => {
            if(!ai.isStationary())
            {
                stationary = false;
                return;
            }
        });

        return stationary;
    }

    //Checks if all AIs are finished
    isFinished()
    {
        let finished = true;

        this.AIs.forEach(ai => {
            if(ai.state !== "finish")
            {
                finished = false;
                return;
            }
        });

        return finished;
    }

    //Make all AIs perform a jump synchronously
    jump(jumpCount)
    {
        this.AIs.forEach(ai => {
            //Only jump if AI has not reached finish flag
            if(ai.state !== "finish")
            {
                let jumpData = ai.getJump(jumpCount);
                ai.jump(jumpData.magnitude, jumpData.angle);
            }
        });
    }

    //Calculate fitness of all AIs
    calcFitness()
    {
        this.AIs.forEach(ai => {
            ai.calcFitness();
        })
    }

    //Purges population: see Pseudocode in Documented Design
    purge(percentage)
    {
        let cutoff = Math.ceil(this.#size * (1 - percentage));
        this.AIs.splice(cutoff);
    }

    //Create offspring, then remove AIs in previous generation: see Pseudocode in Documented Design
    crossover()
    {
        let previousGen = this.AIs.length;


        //Get the leader
        this.leader = this.AIs[0].clone();
        this.leader.setLeader();

        //We minus 1 as we want to save a slot to create a non-mutated clone of the leader
        while(this.AIs.length < (this.#size + previousGen - 1))
        {
            let parentIndex = Math.floor(Math.random() * previousGen),
                parent = this.AIs[parentIndex],
                clone = parent.clone();

            this.AIs.push(clone);
        }

        //Remove all AIs from previous generation
        for(let i = 0; i < previousGen; i++)
        {
            this.AIs.shift();
        }

        //By being the last one to be pushed in, the layering is correct in GUI
        this.AIs.push(this.leader);

        //See Pseudocode for a more in-depth explanation
    }

    //Mutate the population: see Pseudocode in Documented Design
    mutate(chance)
    {
        this.AIs.forEach(ai => {
            //Don't mutate the leader
            if(ai.id !== "leader")
            {
                ai.brain.mutateGenetics(chance);
            }
        });
    }

    //Tick called every frame
    tick()
    {
        this.AIs.forEach(ai => {
            if(!(ai.state === "finish"))
            {
                ai.tick();
            }
        });
    }

}