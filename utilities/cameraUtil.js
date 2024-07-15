"use strict";

import {mat4, vec3} from "../utilities/node_modules/gl-matrix/esm/index.js";

export const CameraMovement_t = Object.freeze({
    FORWARD:    0,
    BACKWARD:   1,
    LEFT:       2,
    RIGHT:      3,
    UP:         4,
    DOWN:       5
});

export class Camera_t
{
    static camera_pos;
    static camera_front;
    static camera_up;

    static first_mouse;
    static yaw;
    static pitch;
    static speed;   
    static sensitivity;
    static zoom;
    static last_x;
    static last_y;

    constructor() 
    {

        this.camera_pos = vec3.create();
        this.camera_front = vec3.create();
        this.camera_up = vec3.create();

        vec3.set(this.camera_pos, 0.0, 0.0, 3.0);
        vec3.set(this.camera_front, 0.0, 0.0, -1.0);
        vec3.set(this.camera_up, 0.0, 1.0, 0.0);

        this.first_mouse  = 1;
        this.yaw          = -90.0;
        this.pitch        = 0.0;
        this.speed        = 2.5;   
        this.sensitivity  = 0.1;
        this.zoom         = 45.0;
        this.last_x       = 250.0;
        this.last_y       = 250.0;
    }

    setSpeed(val)
    {
        this.speed = val;
    }

    setSensitivity(val)
    {
        this.sensitivity = val;
    }

    setCameraPos(val)
    {

        if(typeof(val) != vec3)
        {
            console.error("Error! Value must be type vec3");
            return;
        }

        this.camera_pos = val;
    }

    setCameraFront(val)
    {
        if(typeof(val) != vec3)
        {
            console.error("Error! Value must be type vec3");
            return;
        }

        this.camera_front = val;
    }

    setCameraUp(val)
    {
        if(typeof(val) != vec3)
        {
            console.error("Error! Value must be type vec3");
            return;
        }

        this.camera_up = val;
    }

    getSpeed()
    {
        return this.speed;
    }

    getSensitivity()
    {
        return this.sensitivity;
    }

    getViewMatrix()
    {
        let view = mat4.create();
        let updated_camera_front = vec3.create();

        vec3.add(updated_camera_front, this.camera_front, this.camera_pos);

        console.log(`[${updated_camera_front[0]}, ${updated_camera_front[1]}, ${updated_camera_front[2]}]`)

        mat4.lookAt(view, this.camera_pos, updated_camera_front, this.camera_up);

        return view;
    }

    processKeyboard(direction, delta_time)
    {
        let movement_speed = this.speed * delta_time;
        let cross = vec3.create();

        if(direction == CameraMovement_t.FORWARD)
        {
            vec3.scaleAndAdd(this.camera_pos, this.camera_pos, this.camera_front, movement_speed);
        }
        if(direction == CameraMovement_t.BACKWARD)
        {
            let temp_camera_front = vec3.create();
            vec3.scale(temp_camera_front, this.camera_front, movement_speed);
            vec3.sub(this.camera_pos, this.camera_pos, temp_camera_front);
        }
        if(direction == CameraMovement_t.LEFT)
        {
            vec3.cross(cross, this.camera_front, this.camera_up);
            vec3.normalize(cross, cross);

        }
        if(direction == CameraMovement_t.RIGHT)
        {
            vec3.cross(cross, this.camera_front, this.camera_up);
            vec3.normalize(cross, cross);
            vec3.scaleAndAdd(this.camera_pos, this.camera_pos, cross, movement_speed);
        }
    }
}