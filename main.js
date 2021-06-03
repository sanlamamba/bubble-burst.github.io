const canvas = document.getElementById("canvas");
const gameUI = document.getElementById("gameUI");
const score = document.getElementById("score");
const startBtn =document.getElementById("startBtn");
const bigScore = document.getElementById("bigScore");
let scoreMem= 0;
const comment =document.getElementById("comment");
let scoreTracker=1;
let difficulty= 1000;
canvas.width =innerWidth-5;
canvas.height = innerHeight -5;
canvas.style.background =  "rgba(0,0,0,1)";

let c = canvas.getContext("2d");
class Player{
    constructor(radius){
        this.x=canvas.width/2;
        this.y=canvas.height/2,
        this.radius=radius,
        this.color="white"
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        c.fillStyle = this.color;
        c.fill()
    }
}
class Projectile{
    constructor(velocity){
        this.x=canvas.width/2,
        this.y=canvas.height/2,
        this.radius=5,
        this.color="white",
        this.velocity=velocity
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        c.fillStyle = this.color;
        c.fill()
    }
    update(){
        this.draw()
        this.y= this.y +this.velocity.y,
        this.x+=this.velocity.x
    }
}


class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x,
        this.y=y,
        this.radius=radius,
        this.color=color,
        this.velocity=velocity
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        c.fillStyle = this.color;
        c.fill()
    }
    update(){
        this.draw()
        this.y= this.y +this.velocity.y,
        this.x+=this.velocity.x
    }
}

class Particle{
    constructor(x,y,color,radius,velocity){
        this.x=x,
        this.y=y,
        this.radius=radius,
        this.color=color,
        this.velocity=velocity,
        this.alpha = 1
    }
    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
        c.fillStyle = this.color;
        c.fill()
        c.restore()
    }
    update(){
        this.draw()
        this.y= this.y +(this.velocity.y*6),
        this.x=this.x+(this.velocity.x*6)
        this.alpha -=0.02
    }
}


//ARRAYS
let projectiles= [];
let particles=[];
let enemies =[];
const player = new Player(15);
player.draw();

//ANIMATIONS
addEventListener("click", (e)=>{
    const angle=Math.atan2(e.clientY-canvas.height/2,e.clientX-canvas.width/2);
    const velocity={
        x:Math.cos(angle) * 6,
        y:Math.sin(angle) * 6
    }

    projectiles.push(new Projectile(velocity))
})


function spawner(timing){
    setInterval(()=>{
        const radius= Math.random()*(30-5)+5;
        let x,y;
        if(Math.random() >0.5){
            x = Math.random() < 0.5 ? 0-radius : canvas.width * radius;
            y = Math.random() * canvas.height;
            
        }else{
            x= Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0-radius : canvas.height * radius;
           
        }
        const colorE = "hsl("+Math.random()*360+",50%,50%";
        const angle=Math.atan2(canvas.height/2-y, canvas.width/2-x);
        const velocity={
        x:Math.cos(angle) * scoreTracker ,
        y:Math.sin(angle) * scoreTracker
        }

        enemies.push(new Enemy(x,y,radius,colorE, velocity));  
        
        },timing)
};spawner(1000);

let initState =()=>{
    projectiles= [];
    enemies = [];
    scoreMem =0;
    gameUI.style.display = "none";

}
let gameOver =()=>{
    projectiles= [];
    enemies = [];
    bigScore.innerText= scoreMem;
    scoreMem =0;
    gameUI.style.display = "block";
    comment.innerText  ="BAKA ! Click Start to play again";
    score.innerText ="0";

}
startBtn.addEventListener("click", ()=>{

    main();
    initState();

})

const main =()=>{
    let animation= requestAnimationFrame(main);
    c.fillStyle= "rgba(0,0,0,0.3)";
    c.fillRect(0,0,canvas.width,canvas.height);
    player.draw();
    if(scoreMem<1000){
        comment.innerText= "LVL 1... LAME !";
    }
    if(scoreMem>1000&&scoreTracker==1){
        spawner(2000);
        scoreTracker++;
        comment.innerText= "LVL 2... WELL PLAYED";
        comment.style.color =  "rgb(255,175,175)";
    }else if(scoreMem>2000 && scoreTracker==2){
        spawner(1500);
        scoreTracker++;
        comment.innerText= "LVL 3... YOU GON' DIE !";
        comment.style.color =  "rgb(255,100,100)";
    }else if(scoreMem>3000 && scoreTracker==3){
        spawner(1000);
        scoreTracker++;
        comment.innerText= "LVL 4... YANKEE LVL!";
        comment.style.color =  "rgb(255,50,50)";
    }else if(scoreMem>4000 && scoreTracker==5){
        spawner(500);
        scoreTracker++;
        comment.innerText= "LVL 5... INSANE !";
        comment.style.color =  "rgb(255,0,0)";
    }
    score.innerText = scoreMem;
    projectiles.forEach((projectile,pIndex)=>{
        projectile.update();
        if(projectile.x-projectile.radius<0|| projectile.x-projectile.radius > canvas.width|| projectile.
            y<0 || projectile.y>  canvas.height){
                projectiles.splice(pIndex,1)
        }
    })
    particles.forEach((particle,parIndex)=>{
        particle.update();
        if(particle.alpha <= 0){
            particles.splice(parIndex,1);
        }
    })
    enemies.forEach((enemy,eIndex)=>{
        const dist = Math.hypot(player.x -enemy.x,player.y-enemy.y);
        if(dist -player.radius-enemy.radius<1){
            cancelAnimationFrame(animation);
            gameOver();
        }
        enemy.update();
        projectiles.forEach((projectile,pIndex)=>{
            const dist = Math.hypot(projectile.x -enemy.x,projectile.y-enemy.y);
            if(dist- enemy.radius - projectile.radius< 1){
                for(let i =0;i<=enemy.radius;i++){
                    particles.push(new Particle(projectile.x,projectile.y,Math.random()>0.5?"white":enemy.color,Math.random()*3,{x:Math.random()-0.5,y:Math.random()-0.5}))
                }
                if(enemy.radius -10 <5){
                    setTimeout(()=>{   
                        projectiles.splice(pIndex,1);
                        enemies.splice(eIndex,1);
                    })
                    scoreMem +=100;
                }else{
                    setTimeout(()=>{   
                        projectiles.splice(pIndex,1);
                        enemy.radius -=10;
                    })
                    scoreMem+=25;
                }
                
            }
        })
    })
}
