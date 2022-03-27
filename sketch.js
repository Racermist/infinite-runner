var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg;

var brain, brain_running, brain_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;

var gameOverImg,restartImg
//var jumpSound , checkPointSound, dieSound


function preload(){
  brain_running = loadAnimation("brain.png");
  brain_collided = loadAnimation("braincollided.png");
  

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("zombei1.png");
  obstacle2 = loadImage("zombei2.png");
  obstacle3 = loadImage("zombei3.png");
  obstacle4 = loadImage("zombei 4.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //jumpSound = loadSound("jump.mp3")
  //dieSound = loadSound("die.mp3")
  //checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 300);
  
  brain = createSprite(50,180,20,50);
  brain.addAnimation("running", brain_running);
  brain.addAnimation("collided" ,brain_collided);
  brain.scale = 1;
  
  bg=createSprite(600,300);
  bg.addAnimation("bg");

  ground = createSprite(200,270,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale
  
  gameOver.scale = 0.5;
  restart.scale = 0.25;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  brain.setCollider("rectangle",0,0,brain.width,brain.height);
  brain.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("SkyBlue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4+score/100);

    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score>0&&score%1000===0){
      checkPointSound.play();
    }
    if (ground.x < 200){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& brain.y >= 150) {
        brain.velocityY = -12;
        //jumpSound.play();
    }
    
    //scale brain
    brain.scale=0.15;

    //add gravity
    brain.velocityY = brain.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(brain)){
        gameState = END;
        //dieSound.play();
       //brain.velocityY=-12;
       
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      brain.velocityY = 0
     
      //change the brain animation
      brain.changeAnimation("collided", brain_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     

     if(mousePressedOver(restart)){
       reset();

     }
   }
  
 
  //stop brain from falling down
  brain.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.25;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = brain.depth;
    brain.depth = brain.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  score=0;
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  brain.changeAnimation("running",brain_running);
}

