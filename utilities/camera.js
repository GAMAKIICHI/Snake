"use strict";

import {mat4, vec3, glMatrix} from "./node_modules/gl-matrix/esm/index.js";

export const CameraMovement = Object.freeze({
    FORWARD:    0,
    BACKWARD:   1,
    LEFT:       2,
    RIGHT:      3,
    UP:         4,
    DOWN:       5
});

export class Camera
{
    constructor(cameraPos = vec3.fromValues(0.0, 0.0, 3.0), cameraFront = vec3.fromValues(0.0, 0.0, -3.0), cameraUp = vec3.fromValues(0.0, 1.0, 0.0), fov = 55, speed = 2.5)
    {
        this.cameraPos = cameraPos;
        this.cameraFront = cameraFront;
        this.cameraUp = cameraUp;
        this.speed = speed;
        this.fov = fov;
        this.aspectRatio;

        this.yaw = -90.0;
        this.pitch = 0.0;

        this.front;
        this.right;
        this.up;
    }

    updateCameraMovement(cameraSpeed)
    {
        // calculates z-axis vector
        this.front = vec3.scale(vec3.create(), this.cameraFront, cameraSpeed);

        // calculates positive x-axis vector
        this.right = vec3.cross(vec3.create(), this.cameraFront, this.cameraUp);
        this.right = vec3.normalize(vec3.create(), this.right);
        this.right = vec3.scale(vec3.create(), this.right, cameraSpeed);

        // calculates positive y-axis vector
        this.up = vec3.scale(vec3.create(), this.cameraUp, cameraSpeed);
    }

    getViewMatrix()
    {

        const eye = mat4.add(vec3.create(), this.cameraPos, this.cameraFront);

        return mat4.lookAt(mat4.create(), this.cameraPos, eye, this.cameraUp);
    }

    getProjectionMatrix(gl, near = 0.1, far = 500.0)
    {
        this.aspectRatio = gl.canvas.width/gl.canvas.height;

        const projection = mat4.perspective(mat4.create(), glMatrix.toRadian(this.fov), this.aspectRatio, near, far);
        return projection;
    }

    calculateCameraAngle()
    {   

        let direction = vec3.create();
        let yawToRad = glMatrix.toRadian(this.yaw);
        let pitchToRad = glMatrix.toRadian(this.pitch);

        direction[0] = Math.cos(yawToRad) * Math.cos(pitchToRad);
        direction[1] = Math.sin(pitchToRad);
        direction[2] = Math.sin(yawToRad) * Math.cos(pitchToRad);

        direction = vec3.normalize(vec3.create(), direction);
        this.cameraFront = vec3.copy(vec3.create(), direction);

    }

    rotate(pitch = 0.0 , yaw = -90.0)
    {
        this.pitch = pitch
        this.yaw = yaw;

        this.calculateCameraAngle();
    }

    rotateCameraY(angle)
    {

        console.log(this.cameraFront);

        let direction = vec3.create();
        direction[1] = Math.sin(glMatrix.toRadian(angle));
        direction = vec3.normalize(vec3.create(), direction);
        
        this.cameraFront[1] = direction[1];
        // console.log(this.cameraFront);
    }

    processInput(direction, delta_time)
    {
        const cameraSpeed = this.speed * delta_time;
        this.updateCameraMovement(cameraSpeed);

        if(direction === CameraMovement.FORWARD)
        {
            this.cameraPos = vec3.add(vec3.create(), this.cameraPos, this.front);
        }
        if(direction === CameraMovement.BACKWARD)
        {
            this.cameraPos = vec3.sub(vec3.create(), this.cameraPos, this.front);
        }
        if(direction === CameraMovement.RIGHT)
        {
            this.cameraPos = vec3.add(vec3.create(), this.cameraPos, this.right);
        }
        if(direction === CameraMovement.LEFT)
        {
            this.cameraPos = vec3.sub(vec3.create(), this.cameraPos, this.right);
        }
        if(direction === CameraMovement.UP)
        {
            this.cameraPos = vec3.add(vec3.create(), this.cameraPos, this.up);
        }
        if(direction === CameraMovement.DOWN)
        {
            this.cameraPos = vec3.sub(vec3.create(), this.cameraPos, this.up);
        }
    }
}