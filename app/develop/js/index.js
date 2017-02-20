/**
 * @fileoverview top page
 */


'use strict';


import * as THREE      from 'three';
import TweenMax        from 'gsap';
import Config          from 'Config';
import Sky             from 'Sky';
import Sea             from 'Sea';
import AirPlane        from 'AirPlane';
import CoinsHolder     from 'CoinsHolder';
import Enemy           from 'Enemy';
import EnemiesHolder   from 'EnemiesHolder';
import Particle        from 'Particle';
import ParticlesHolder from 'ParticlesHolder';



/**
 * @namespace
 */
const AVIATOR = AVIATOR || {};


/**
 * @namespace AVIATOR_OBJECT
 * @memberof AVIATOR
 */
AVIATOR.AVIATOR_OBJECT = {


  /**
   * @function init
   */
  init: function () {

    this.newTime = new Date().getTime();
    this.oldTime = new Date().getTime();

    this.fieldDistance = document.getElementById('distValue');
    this.energyBar     = document.getElementById('energyBar');
    this.replayMessage = document.getElementById('replayMessage');
    this.fieldLevel    = document.getElementById('levelValue');
    this.levelCircle   = document.getElementById('levelCircleStroke');

    this.resetGame();
    this.createScene();

    this.createLights();
    this.createPlane();
    this.createSea();
    this.createSky();
    this.createCoins();
    this.createEnemies();
    this.createParticles();

    document.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    }, false);
    document.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    }, false);
    document.addEventListener('mouseup',   (e) => {
      this.handleMouseUp(e);
    }, false);
    document.addEventListener('touchend',  (e) => {
      this.handleTouchEnd(e);
    }, false);

    this.loop();

  },


  /*
   * ゲームリセット
   * @function resetGame
   */
  resetGame: function () {

    Config.energy    = 100; /* エネルギー量 [0-100] 1より小さくなるとmiss */
    Config.level     = 1;   /* レベル [1-] */
    Config.distance  = 0;   /* 進行距離 [0-] */

    Config.speed           = 0;    /* スピード */
    Config.baseSpeed       = 0.00035;
    Config.planeFallSpeed  = 0.001;
    Config.targetBaseSpeed = 0.00035;
    Config.planeSpeed      = 0;

    this.coinLastSpawn   = 0; /* 最後にスポーンした時の距離 */
    this.levelLastUpdate = 0; /* 最後にアップデートした時の距離 */
    this.speedLastUpdate = 0; /* 最後にアップデートした時の距離 */
    this.enemyLastSpawn  = 0; /* 最後にスポーンした時の距離 */

    this.status = 'playing';  /* 'playing', 'gameover', 'watingReplay' */

    Config.collisionSpeedX = 0;
    Config.collisionSpeedY = 0;
    Config.collisionDisplacementX = 0;
    Config.collisionDisplacementY = 0;

    this.fieldLevel.innerHTML = Math.floor(Config.level);
  },


  /*
   * シーンを生成する
   * @function createScene
   */
  createScene: function () {

    const fieldOfView = 50,
          aspectRatio = Config.WIDTH / Config.HEIGHT,
          nearPlane   = 0.1,
          farPlane    = 10000;

    this.scene     = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xf7d9aa, 100,950);

    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this.camera.position.x = -150;
    this.camera.position.z = 150;
    this.camera.position.y = Config.PLANE_DEFAULT_HEIGHT + 100;
    this.camera.lookAt({
      x: 0,
      y: 200,
      z: 0
    });

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(Config.WIDTH, Config.HEIGHT);
    this.renderer.shadowMap.enabled = true;

    document.getElementById('world').appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.handleWindowResize();
    }, false);

  },


  /*
   * 飛行機生成
   * @function createPlane
   */
  createPlane: function () {

    this.airplane = new AirPlane();
    this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
    this.airplane.mesh.position.y = Config.PLANE_DEFAULT_HEIGHT;
    this.scene.add(this.airplane.mesh);

  },


  /*
   * 海生成
   * @function createSea
   */
  createSea: function () {

    this.sea = new Sea();
    this.sea.mesh.position.y = -Config.SEA_RADIUS;
    this.scene.add(this.sea.mesh);

  },


  /*
   * 空生成
   * @function createSky
   */
  createSky: function () {

    this.sky = new Sky();
    this.sky.mesh.position.y = -Config.SEA_RADIUS;
    this.scene.add(this.sky.mesh);

  },


  /*
   * コイン生成
   * @function createCoins
   */
  createCoins: function () {

    this.coinsHolder = new CoinsHolder(20);
    this.scene.add(this.coinsHolder.mesh)

  },


  /*
   * 敵生成
   * @function createEnemies
   */
  createEnemies: function () {

    let i;

    for (i = 0; i < 10; i++) {
      const enemy = new Enemy();
      Config.enemiesPool.push(enemy);
    }

    this.enemiesHolder = new EnemiesHolder();
    this.scene.add(this.enemiesHolder.mesh);

  },


  /*
   * パーティクル生成
   * @function createParticles
   */
  createParticles: function () {

    let i;

    for (i = 0; i < 10; i++) {
      const particle = new Particle();
      Config.particlesPool.push(particle);
    }

    Config.particlesHolder = new ParticlesHolder();
    this.scene.add(Config.particlesHolder.mesh);

  },


  /*
   * ウィンドウリサイズイベントハンドラ
   * @function handleWindowResize
   */
  handleWindowResize: function () {

    Config.HEIGHT = window.innerHeight;
    Config.WIDTH = window.innerWidth;

    this.renderer.setSize(Config.WIDTH, Config.HEIGHT);

    this.camera.aspect = Config.WIDTH / Config.HEIGHT;
    this.camera.updateProjectionMatrix();

  },


  /*
   * マウス移動イベントハンドラ
   * @function handleMouseMove
   */
  handleMouseMove: function (event) {

    const tx = -1 + (event.clientX / Config.WIDTH) * 2,
          ty = 1 - (event.clientY / Config.HEIGHT) * 2;

    Config.mousePos = {
      x: tx,
      y: ty
    };

  },


  /*
   * タッチ位置移動イベントハンドラ
   * @function handleTouchMove
   */
  handleTouchMove: function (event) {

    event.preventDefault();

    const tx = -1 + (event.touches[0].pageX / Config.WIDTH) * 2,
          ty = 1 - (event.touches[0].pageY / Config.HEIGHT) * 2;

    Config.mousePos = {
      x: tx,
      y: ty
    };

  },


  /*
   * マウスボタン終了イベントハンドラ
   * @function handleMouseUp
   */
  handleMouseUp: function (event) {

    if (this.status === 'waitingReplay') {
      this.resetGame();
      this.replayMessage.style.display = 'none';
    }

  },


  /*
   * タッチ終了イベントハンドラ
   * @function handleTouchEnd
   */
  handleTouchEnd: function (event) {

    if (this.status === 'waitingReplay') {
      this.resetGame();
      this.replayMessage.style.display = 'none';
    }

  },


  /*
   * ライトを生成
   * @function createLights
   */
  createLights: function () {

    this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9);

    this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);

    this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    this.shadowLight.position.set(150, 350, 350);
    this.shadowLight.castShadow = true;
    this.shadowLight.shadow.camera.left = -400;
    this.shadowLight.shadow.camera.right = 400;
    this.shadowLight.shadow.camera.top = 400;
    this.shadowLight.shadow.camera.bottom = -400;
    this.shadowLight.shadow.camera.near = 1;
    this.shadowLight.shadow.camera.far = 1000;
    this.shadowLight.shadow.mapSize.width = 4096;
    this.shadowLight.shadow.mapSize.height = 4096;

    //      const ch = new THREE.CameraHelper(this.shadowLight.shadow.camera);
    //      this.scene.add(ch);

    this.scene.add(this.hemisphereLight);
    this.scene.add(this.shadowLight);
    this.scene.add(this.ambientLight);

  },


  /*
   * ループ関数
   * @function loop
   */
  loop: function () {

    this.newTime = new Date().getTime();
    Config.deltaTime = this.newTime - this.oldTime;
    this.oldTime = this.newTime;

    if (this.status === 'playing') {

      /* プレイ中 */

      // 一定距離を超えていたら、コインをスポーン
      if (Math.floor(Config.distance) % Config.DISTANCE_FOR_COINS_SPAWN == 0 &&
          Math.floor(Config.distance) > this.coinLastSpawn) {
        this.coinLastSpawn = Math.floor(Config.distance);
        this.coinsHolder.spawnCoins();
      }

      // 一定距離を超えていたら、スピードアップ
      if (Math.floor(Config.distance) % Config.DISTANCE_FOR_SPEED_UPDATE == 0 &&
          Math.floor(Config.distance) > this.speedLastUpdate) {
        this.speedLastUpdate = Math.floor(Config.distance);
        Config.targetBaseSpeed += Config.INCREMENT_SPEED_TIME * Config.deltaTime;
      }

      // 一定距離を超えていたら、敵スポーン
      if (Math.floor(Config.distance) % Config.DISTANCE_FOR_ENEMIES_SPAWN == 0 &&
          Math.floor(Config.distance) > this.enemyLastSpawn) {
        this.enemyLastSpawn = Math.floor(Config.distance);
        this.enemiesHolder.spawnEnemies();
      }

      // 一定距離を超えていたら、レベルアップ
      if (Math.floor(Config.distance) % Config.DISTANCE_FOR_LEVEL_UPDATE == 0 &&
          Math.floor(Config.distance) > this.levelLastUpdate) {
        this.levelLastUpdate = Math.floor(Config.distance);

        Config.level++;
        this.fieldLevel.innerHTML = Math.floor(Config.level);
        Config.targetBaseSpeed = Config.INIT_SPEED + Config.INCREMENT_SPEED_BY_LEVEL * Config.level
      }

      this.updatePlane();
      this.updateDistance();
      this.updateEnergy();

      Config.baseSpeed += (Config.targetBaseSpeed - Config.baseSpeed) * Config.deltaTime * 0.02;
      Config.speed = Config.baseSpeed * Config.planeSpeed;

    } else if (this.status === 'gameover') {

      /* ゲームオーバー中 */

      Config.speed *= 0.99;

      this.airplane.mesh.rotation.z += (-Math.PI/2 - this.airplane.mesh.rotation.z)*.0002*Config.deltaTime;
      this.airplane.mesh.rotation.x += 0.0003*Config.deltaTime;

      Config.planeFallSpeed *= 1.05;

      this.airplane.mesh.position.y -= Config.planeFallSpeed * Config.deltaTime;

      if (this.airplane.mesh.position.y < -200) {
        this.replayMessage.style.display = 'block';
        this.status = 'waitingReplay';
      }

    } else if (this.status === 'waitingReplay') {

      /* ゲーム開始まで待機中 */

    }

    this.airplane.rotationPropeller();

    this.sea.mesh.rotation.z += Config.speed * Config.deltaTime; //*Config.game.seaRotationSpeed;

    if (this.sea.mesh.rotation.z > 2 * Math.PI) {
      this.sea.mesh.rotation.z -= 2 * Math.PI;
    }

    this.ambientLight.intensity += (.5 - this.ambientLight.intensity) * Config.deltaTime * 0.005;

    this.coinsHolder.rotateCoins(this.airplane);
    this.enemiesHolder.rotateEnemies(this.airplane, this.ambientLight);

    this.sky.moveClouds();
    this.sea.moveWaves();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => {
      this.loop();
    });

  },


  /*
   * 飛行機の更新
   * @function updatePlane
   */
  updatePlane: function () {

    Config.planeSpeed = this.normalize(Config.mousePos.x, -0.5, 0.5, Config.PLANE_MIN_SPEED, Config.PLANE_MAX_SPEED);

    let targetY = this.normalize(Config.mousePos.y, -0.75, 0.75, Config.PLANE_DEFAULT_HEIGHT - Config.PLANE_AMP_HEIGHT, Config.PLANE_DEFAULT_HEIGHT + Config.PLANE_AMP_HEIGHT),
        targetX = this.normalize(Config.mousePos.x, -1, 1, -Config.PLANE_AMP_WIDTH * 0.7, -Config.PLANE_AMP_WIDTH);

    Config.collisionDisplacementX += Config.collisionSpeedX;
    targetX += Config.collisionDisplacementX;

    Config.collisionDisplacementY += Config.collisionSpeedY;
    targetY += Config.collisionDisplacementY;

    this.airplane.mesh.position.y += (targetY - this.airplane.mesh.position.y) * Config.deltaTime * Config.PLANE_MOVE_SENSIVITY;
    this.airplane.mesh.position.x += (targetX - this.airplane.mesh.position.x) * Config.deltaTime * Config.PLANE_MOVE_SENSIVITY;

    this.airplane.mesh.rotation.z = (targetY-this.airplane.mesh.position.y) * Config.deltaTime * Config.PLANE_ROT_X_SENSIVITY;
    this.airplane.mesh.rotation.x = (this.airplane.mesh.position.y - targetY) * Config.deltaTime * Config.PLANE_ROT_Z_SENSIVITY;
    this.camera.fov = this.normalize(Config.mousePos.x, -1, 1, 40, 80);
    this.camera.updateProjectionMatrix();
    this.camera.position.y += (this.airplane.mesh.position.y - this.camera.position.y) * Config.deltaTime * Config.CAMERA_SENSIVITY;

    Config.collisionSpeedX -= Config.collisionSpeedX * Config.deltaTime * 0.03;
    Config.collisionSpeedY -= Config.collisionSpeedY * Config.deltaTime * 0.03;
    Config.collisionDisplacementX -= Config.collisionDisplacementX * Config.deltaTime * 0.01;
    Config.collisionDisplacementY -= Config.collisionDisplacementY * Config.deltaTime * 0.01;

    this.airplane.pilot.updateHairs();

  },


  /*
   * ノーマライズ
   * @function normalize
   */
  normalize: function (v, vmin, vmax, tmin, tmax) {

    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);

    return tv;

  },


  /*
   * 距離の更新
   * @function updateDistance
   */
  updateDistance: function () {

    Config.distance += Config.speed * Config.deltaTime * Config.RATIO_SPEED_DISTANCE;

    this.fieldDistance.innerHTML = Math.floor(Config.distance);

    const d = 502 * (1-(Config.distance % Config.DISTANCE_FOR_LEVEL_UPDATE) / Config.DISTANCE_FOR_LEVEL_UPDATE);

    this.levelCircle.setAttribute('stroke-dashoffset', d);

  },


  /*
   * エネルギーの更新
   * @function updateEnergy
   */
  updateEnergy: function () {

    Config.energy -= Config.speed * Config.deltaTime * Config.RATIO_SPEED_ENERGY;
    Config.energy = Math.max(0, Config.energy);

    this.energyBar.style.right = (100-Config.energy) + '%';
    this.energyBar.style.backgroundColor = (Config.energy < 50) ? '#f25346' : '#68c3c0';

    if (Config.energy < 30){

      this.energyBar.style.animationName = 'blinking';

    } else {

      this.energyBar.style.animationName = 'none';

    }

    if (Config.energy < 1) {

      this.status = 'gameover';

    }

  }


};


window.addEventListener('load', function init() {

  AVIATOR.AVIATOR_OBJECT.init();

}, false);
