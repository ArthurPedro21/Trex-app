var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var PLAY = 1 
var END = 0
var GameState = PLAY
var gameoverImg,restartImg
var dieSound,jumpSound,checkpointSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

dieSound = loadSound("die.mp3")
jumpSound = loadSound("jump.mp3")
checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;


  
  ground = createSprite(200,height/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  gameover = createSprite(width/2,height/2-80);
  gameover.addImage(gameoverImg);

  restart = createSprite(width/2,height/2-50);
  restart.addImage(restartImg);

  gameover.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(200,height/2 + 10,400,10);
  invisibleGround.visible = false;
  
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  score = 0;

  obstaclesGroup = new Group()
  cloudsGroup = new Group()

}

function draw() {
  background(180);
  fill("black")

  if (GameState == PLAY){

    ground.velocityX = -4;
    score = score + 1
    


ground.velocityX = -(4 + score/100)


    if (score % 100 === 0){

    checkpointSound.play()

    }


    if((keyDown("space")||touches.length > 0) && trex.y >= height/2-20) {
      trex.velocityY = -13;
      jumpSound.play()
      touches = []
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    spawnObstacles();
    spawnClouds();

    gameover.visible = false
    restart.visible = false
    if (obstaclesGroup.isTouching(trex)){
    GameState = END;
    dieSound.play()
    }

  }
  
  else if(GameState == END){
    gameover.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    // mudar a animação do trex
    trex.changeAnimation("collided",trex_collided);

    //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    
    gameover.visible=true
    restart.visible=true

if (mousePressedOver(restart)){
reset()

}


  }
  trex.collide(invisibleGround);

  drawSprites();

  text("score = " + score,20,20)

}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height/2-20,10,40);
   obstacle.velocityX = -(5 + score/100)

   
    // //gerar obstáculos aleatórios
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
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo             
    obstacle.scale = 0.5;
    obstacle.lifetime = 430;
    obstaclesGroup.add(obstacle) 

    obstacle.depth = 3
    
 }

}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,40,10);
    cloud.y = Math.round(random(height/2-30, height/2-80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = 430;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud)
  }
  
}

function reset(){

GameState = PLAY

obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()

score = 0
trex.changeAnimation("running",trex_running);
}