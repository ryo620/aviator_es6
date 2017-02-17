'use strict';


import * as THREE from 'three';
import Config     from 'Config';
import Enemy      from 'Enemy';


/**
 * @class EnemiesHolder
 */
export default class EnemiesHolder {


  /**
   * @constructor
   */
  constructor () {

    this.mesh = new THREE.Object3D();
    this.enemiesInUse = [];

  }


  /**
   * 敵群のスポーン
   * @method spawnEnemies
   */
  spawnEnemies () {

    const nEnemies = Config.level;

    let i;

    for (i = 0; i < nEnemies; i++) {

      let enemy;

      if (Config.enemiesPool.length) {

        enemy = Config.enemiesPool.pop();

      } else {

        enemy = new Enemy();

      }

      enemy.angle = - (i * 0.1);
      enemy.distance = Config.SEA_RADIUS + Config.PLANE_DEFAULT_HEIGHT + (Math.random() * 2 - 1) * (Config.PLANE_AMP_HEIGHT - 20);
      enemy.mesh.position.y = Math.sin(enemy.angle)*enemy.distance - Config.SEA_RADIUS;
      enemy.mesh.position.x = Math.cos(enemy.angle)*enemy.distance;

      this.mesh.add(enemy.mesh);
      this.enemiesInUse.push(enemy);

    }
  }


  /**
   * 敵群の回転
   * @method rotateEnemies
   */
  rotateEnemies (base, ambientLight) {

    const enemyDistanceTolerance = 10,
          enemiesSpeed = 0.6;

    let i;

    for (i = 0; i < this.enemiesInUse.length; i++) {

      const enemy = this.enemiesInUse[i];

      enemy.angle += Config.speed * Config.deltaTime * enemiesSpeed;

      if (enemy.angle > Math.PI*2) {
        enemy.angle -= Math.PI*2;
      }

      enemy.mesh.position.y = -Config.SEA_RADIUS + Math.sin(enemy.angle)*enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle)*enemy.distance;
      enemy.mesh.rotation.z += Math.random()*.1;
      enemy.mesh.rotation.y += Math.random()*.1;

      const diffPos = base.mesh.position.clone().sub(enemy.mesh.position.clone()),
            d = diffPos.length();

      if (d < enemyDistanceTolerance) {

        Config.particlesHolder.spawnParticles(enemy.mesh.position.clone(), 15, Config.COLOR.red, 3);

        Config.enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(enemy.mesh);
        Config.collisionSpeedX = 100 * diffPos.x / d;
        Config.collisionSpeedY = 100 * diffPos.y / d;
        ambientLight.intensity = 2;

        this.removeEnergy();
        i--;

      } else if (enemy.angle > Math.PI) {

        Config.enemiesPool.unshift(this.enemiesInUse.splice(i ,1)[0]);
        this.mesh.remove(enemy.mesh);
        i--;

      }

    }
  }


  removeEnergy () {

    Config.energy -= Config.ENEMY_VALUE;
    Config.energy = Math.max(0, Config.energy);

  }

};