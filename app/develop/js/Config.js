/**
 * @fileoverview 変数管理
 */


'use strict';


import Config from 'Config';

Config.WIDTH        = window.innerWidth;
Config.HEIGHT       = window.innerHeight;

/**
 * 海の半径
 */
Config.SEA_RADIUS = 600;

/**
 * 飛行機の初期高度
 */
Config.PLANE_DEFAULT_HEIGHT = 100;

/**
 * 飛行機の上昇量
 */
Config.PLANE_AMP_HEIGHT = 80;


Config.DISTANCE_FOR_SPEED_UPDATE  = 100;
Config.DISTANCE_FOR_COINS_SPAWN   = 100;
Config.DISTANCE_FOR_LEVEL_UPDATE  = 1000;
Config.DISTANCE_FOR_ENEMIES_SPAWN = 50;

Config.PLANE_AMP_WIDTH       = 75;
Config.PLANE_MOVE_SENSIVITY  = 0.005;
Config.PLANE_ROT_X_SENSIVITY = 0.0008;
Config.PLANE_ROT_Z_SENSIVITY = 0.0004;
Config.PLANE_MIN_SPEED       = 1.2;
Config.PLANE_MAX_SPEED       = 1.6;

Config.RATIO_SPEED_DISTANCE = 50;
Config.RATIO_SPEED_ENERGY = 3;

Config.INIT_SPEED = 0.00035;
Config.INCREMENT_SPEED_TIME = 0.0000025;
Config.INCREMENT_SPEED_BY_LEVEL = 0.000005;

Config.CAMERA_SENSIVITY = 0.002;

Config.COIN_VALUE = 3;
Config.ENEMY_VALUE = 10;

Config.COLOR        = {
  red:       0xf25346,
  white:     0xd8d0d1,
  brown:     0x59332e,
  pink:      0xF5986E,
  brownDark: 0x23190f,
  yellow:    0xf4ce93,
  blue:      0x68c3c0,
  green:     0x009999
};

// ====

Config.mousePos  = { x: 0, y: 0 }
Config.deltaTime = 0;

Config.enemiesPool   = [];
Config.particlesPool = [];

