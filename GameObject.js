class GameObject
{
    constructor (id, context, x, y, vx, vy, width, height){
        this.id = id
        this.div = context
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 160;
        this.height = 225

        this.isColliding = false;
    }
}

class Square extends GameObject
{
    constructor (id, context, x, y, vx, vy, width, height){
        super(id, context, x, y, vx, vy, width, height);
    }

    draw(){
        this.div.style.transform = `translate(${this.x}px, ${this.y}px)`
    }

    update(secondsPassed){
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function detectCollisions(gameObjects){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
                obj1.isColliding = true;
                obj2.isColliding = true;
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                obj1.vx -= (speed * vCollisionNorm.x);
                obj1.vy -= (speed * vCollisionNorm.y);
                obj2.vx += (speed * vCollisionNorm.x);
                obj2.vy += (speed * vCollisionNorm.y);
            }
        }
    }
    return gameObjects
}

function detectEdgeCollisions(gameObjects){

    // Define the edges of the canvas
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const restitution = 1

     let obj;
     for (let i = 0; i < gameObjects.length; i++)
     {
         obj = gameObjects[i];

         // Check for left and right
         if (obj.x < 0){
             obj.vx = Math.abs(obj.vx) * restitution;
             obj.x = 0;
         }else if (obj.x > canvasWidth){
             obj.vx = -Math.abs(obj.vx) * restitution;
             obj.x = canvasWidth - obj.width;
         }

         // Check for bottom and top
         if (obj.y < 0){
             obj.vy = Math.abs(obj.vy) * restitution;
             obj.y = 0;
         } else if (obj.y > canvasHeight){
             obj.vy = -Math.abs(obj.vy) * restitution;
             obj.y = canvasHeight - obj.height;
         }
    }
    return gameObjects
}