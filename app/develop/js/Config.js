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

