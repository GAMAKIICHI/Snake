"use strict";

export class deltaTime
{

    constructor()
    {
        this.time = 0.0;
        this.last_frame = 0.0;
        this.isTime = true;

    }

    getTime()
    {
        return this.time;
    }

    startTime()
    {
        if(this.isTime === true)
        {
            let current_time = performance.now();
            this.time = (current_time - this.last_frame) * .001;
            this.last_frame = current_time;
        }
    }

    stopTime()
    {
        this.time = 0.0;
        this.last_frame = 0.0;
        this.isTime = false;
    }

    pauseTime()
    {
        this.isTime = false;
    }

    resumeTime()
    {
        this.isTime = true;
    }


    resetTime()
    {
        this.time = 0.0;
        this.last_frame = 0.0;
    }
}