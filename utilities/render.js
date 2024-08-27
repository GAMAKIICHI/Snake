"use strict";
import { deltaTime } from "./time.js";
import { Camera } from "./camera.js"; 
import { Snake, SnakeMovement } from "./snake.js";
import { Grid } from "./grid.js";
import { Food } from "./food.js";

const color = [0, 255, 0, 255];

export class Render
{
    constructor(gl, color = [1.0, 1.0, 0.0])
    {
        this.gl = gl;
        this.color = color;

        //camera z index must be odd or grid will squares will render uneven
        this.camera = new Camera(this.gl, [0.0, 0.0, 15]);
        this.delta_time = new deltaTime();

        this.snake = new Snake(this.gl, 16, 5, 4);
        this.grid = new Grid(this.gl, 15, 15);
        this.food = new Food(this.gl);
        this.keys = KeyboardInputs();

        this.isGameOver = true;
        this.highScore = 0;

        this.menu = document.getElementById("menu");

        this.gameState = this.gameState.bind(this);
        this.gameScene = this.gameScene.bind(this);
        this.menuScene = this.menuScene.bind(this);

    }

    async initRender()
    {
        await this.snake.initSnake("../assets/shaders/vertex.glsl", "../assets/shaders/snake.glsl", color);
        await this.grid.initGrid("../assets/shaders/vertex.glsl", "../assets/shaders/grid.glsl", color);
        await this.food.initFood("../assets/shaders/vertex.glsl", "../assets/shaders/snake.glsl", this.camera.cameraPos[2], color);
        
        this.menu.style.borderColor = `rgba(${color})`;
        for(let i = 0; i < this.menu.children.length; i++)
        {
            this.menu.children[i].style.color = `rgba(${color})`;
        }

        this.updateScore();
        this.updateHighScore();
    }

    gameState()
    {
        this.delta_time.startTime();

        if(this.isGameOver);
        else
        {

            //Snake Movement
            if(this.keys["ARROWUP"])
            {
                this.snake.changeDirection(SnakeMovement.FORWARD);
            }
            else if(this.keys["ARROWDOWN"])
            {
                this.snake.changeDirection(SnakeMovement.BACKWARD);
            }
            else if(this.keys["ARROWRIGHT"])
            {
                this.snake.changeDirection(SnakeMovement.RIGHT);
            }
            else if(this.keys["ARROWLEFT"])
            {
                this.snake.changeDirection(SnakeMovement.LEFT);
            }

            this.snake.move(this.delta_time.time);
            
            //checks if snake head has collided with food
            if(isCollision(this.snake.position[0], this.food.position))
            {
                this.food.updatePosition();
                this.snake.grow();
                this.snake.score++;
                this.updateScore();
            }

            //this checks if snake head has collided on any part of the body
            for(let i = 1; i < this.snake.position.length; i++)
            {
                if(isCollision(this.snake.position[0], this.snake.position[i]))
                {
                    this.isGameOver = true;
                    this.updateHighScore();
                }
            }

            //This checks if snake has went out of screen boundaries
            if(this.snake.position[0][0] < -Math.floor(this.camera.screenWidth / 2) || this.snake.position[0][0] > Math.floor(this.camera.screenWidth / 2))
            {
                this.isGameOver = true;
                this.updateHighScore();
            }
            else if(this.snake.position[0][1] < -Math.floor(this.camera.screenHeight / 2) || this.snake.position[0][1] > Math.floor(this.camera.screenHeight / 2))
            {
                this.isGameOver = true;
                this.updateHighScore();
            }
        }
        requestAnimationFrame(this.gameState);

    }

    menuState()
    {
        const start = this.menu.children[1];

        //set opacity for grid
        this.grid.useProgram();
        this.grid.setFloat("u_gridOpacity", 0.1);

        start.addEventListener("click", () => 
        {
            this.isGameOver = false;
            this.menu.style.display = "none";
            this.snake.score = 0;
            this.updateScore();

            //set opacity for grid
            this.grid.useProgram();
            this.grid.setFloat("u_gridOpacity", 1.0);
        });

        //this makes the menu content unhidden
        const isHidden = () =>
        {
            if(this.isGameOver === true)
            {
                this.menu.style.display = "block";
                this.snake.reset();
                this.food.updatePosition();
            }

            //this checks the condition of the variable isGameOver
            requestAnimationFrame(isHidden);
        }

        //calls the isHidden function
        requestAnimationFrame(isHidden);
       
    }

    gameScene()
    {
        
        if(this.isGameOver);
        else
        {
            clearScreen(this.gl);

            this.snake.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix());
            this.food.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix());
            // this.grid.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(), this.camera);
        }

        requestAnimationFrame(this.gameScene);
    }

    menuScene()
    {
    
        if(!this.isGameOver);
        else
        {
            clearScreen(this.gl);
            // this.grid.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(), this.camera);
        }

        requestAnimationFrame(this.menuScene);
    }

    updateScore()
    {
        const scoreEle = document.getElementById("score-current");
        scoreEle.textContent = `SCORE: ${this.snake.score}`;
    }

    updateHighScore()
    {
        const highScoreEle = document.getElementById("score-high");

        if(this.snake.score > this.highScore)
            this.highScore = this.snake.score;

        highScoreEle.textContent = `HIGH SCORE: ${this.highScore}`;
    }
}

function KeyboardInputs()
{
    const keys = {};

    window.addEventListener("keydown", (event) =>
    {
        keys[event.key.toUpperCase()] = true;
    });


    window.addEventListener("keyup", (event) =>
    {
        keys[event.key.toUpperCase()] = false;
    });

    return keys;
}

function isCollision(position1, position2)
{
    if(position1.length != position2.length)
    {
        return false;
    }

    for(var i = 0; i < position1.length; i++)
    {
        if(position1[i] != position2[i])
        {
            return false;
        }
    }

    return true;
}

function clearScreen(gl)
{
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

}