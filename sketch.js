var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloInvisivel, imagemDoSolo;

var grupoDeNuvens, imagemDaNuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao=0;

var fimDeJogo, reiniciar;

var c1,c2,c3, count;


function preload(){
  logan_correndo =   loadAnimation("dog.png");
  logan_colidiu = loadAnimation("dog.png");
  
  imagemDoSolo = loadImage("ground2.png");
  
  imagemDaNuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle1.png");
  
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");


  imgC1 =  loadImage("coracao.png");
  imgC2 =  loadImage("coracao.png");
  imgC3 =  loadImage("coracao.png");
}

function setup() {
  createCanvas(600, 200);
  
  logan = createSprite(50,100,20,50);
  logan.debug = true;
  logan.setCollider("rectangle",0,0,0,70,70);
  logan.addAnimation("running", logan_correndo);
  logan.addAnimation("collided", logan_colidiu);
  logan.scale = 0.3;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemDoSolo);
  solo.x = solo.width /2;
  //solo.velocityX = -(6 + 3*pontuacao/100);
  
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;

  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  soloInvisivel = createSprite(200,160,400,10);
  soloInvisivel.visible = false;
  
  grupoDeNuvens = new Group();
  grupoDeObstaculos = new Group();
  
  pontuacao = 0;

  //pontuaçao
  count = 0;
  c1 = createSprite(15,20,20,20);
  c1.addImage(imgC1);
  c1.scale = 0.05;
  c2 = createSprite(45,20,20,20);
  c2.addImage(imgC2);
  c2.scale = 0.05;
  c3 = createSprite(75,20,20,20);
  c3.addImage(imgC3);
  c3.scale = 0.05;
}

function draw() {
  //logan.debug = true;
  background(255);
  text("Pontuação: "+ pontuacao, 500,50);
  
  if (estadoJogo === JOGAR){
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    //solo.velocityX = -(6 + 3*pontuacao/100);
  
    if(keyDown("space") && logan.y >= 140) {
      logan.velocityY = -12;
    }
  
    logan.velocityY = logan.velocityY + 0.8
  
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
    logan.collide(soloInvisivel);
    gerarNuvens();
    gerarObstaculos();
  
   
    if(grupoDeObstaculos.isTouching(logan)){
      pontuacao = pontuacao - 100; 
      count=count+1;
    }
    if(count===1){
      c1.visible = false; 
    }else if(count ===2){
      c2.visible = false; 
    }else if(count ===3){
      c3.visible = false; 
    }else{
      count = 0
    }

    if(pontuacao <= 0 || count >= 4 ){
      estadoJogo = ENCERRAR;
    }

    console.log(count)
   
  }
  else if (estadoJogo === ENCERRAR) {
    fimDeJogo.visible = true;
    reiniciar.visible = true;
    
    //define velocidade de cada objeto do jogo como 0
    solo.velocityX = 0;
    logan.velocityY = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    
    //altera a animação do logan
    logan.changeAnimation("collided",logan_colidiu);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    if(mousePressedOver(reiniciar)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,120,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = logan.depth;
    logan.depth = logan.depth + 1;
        
    //adicionando nuvem ao grupo
   grupoDeNuvens.add(nuvem);
  }
  
}

function gerarObstaculos() {
  if(frameCount % 60 === 0) {
    var obstaculo = createSprite(600,150,10,40);
    //obstaculo.debug = true;
    obstaculo.velocityX = -(6 + 3*pontuacao/100);
    obstaculo.debug =true;
    obstaculo.setCollider("rectangle",0,0,60,60)
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
    
    //atribuir escala e tempo de duração ao obstáculo           
    obstaculo.scale = 0.3;
    obstaculo.lifetime = 300;
    //adicionar cada obstáculo ao grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  logan.changeAnimation("running",logan_correndo);
  
 
  
  pontuacao = 0;
  
}