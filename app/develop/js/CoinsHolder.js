'use strict';


import * as THREE from 'three';
import Config     from 'Config';
import Coin       from 'Coin';


/**
 * @class CoinsHolder
 */
export default class CoinsHolder {


  /**
   * @constructor
   */
  constructor (nCoins) {

    let i;

    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];


    for (i = 0; i < nCoins; i++){

      this.coinsPool.push(new Coin());

    }

  }


  /**
   * コイン群のスポーン
   * @method spawnCoins
   */
  spawnCoins () {
          /** 1 - 11個のコイン */
    const nCoins = 1 + Math.floor(Math.random() * 10),
          /** 1 - 11個のコイン */
          d      = Config.SEA_RADIUS + Config.PLANE_DEFAULT_HEIGHT + (-1 + Math.random() * 2) * (Config.PLANE_AMP_HEIGHT - 20),
          amp    = 10 + Math.round(Math.random() * 10);

    let i;

    for (i = 0; i < nCoins; i++) {

      let coin;

      if (this.coinsPool.length) {

        coin = this.coinsPool.pop();

      } else {

        coin = new Coin();

      }

      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin);

      coin.angle = - (i * 0.02);
      coin.distance = d + Math.cos(i * 0.5) * amp;
      coin.mesh.position.y = Math.sin(coin.angle) * coin.distance - Config.SEA_RADIUS;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
    }

  }


  /**
   * コイン群の回転
   * @method rotateCoins
   */
  rotateCoins (base) {

    const coinsSpeed = 0.5,
          coinDistanceTolerance = 15;

    let i;

    for (i = 0; i < this.coinsInUse.length; i++) {

      const coin = this.coinsInUse[i];

      if (coin.exploding) continue;

      coin.angle += Config.speed * Config.deltaTime * coinsSpeed;

      if (coin.angle > Math.PI * 2) {
        coin.angle -= Math.PI * 2;
      }

      coin.mesh.position.y = -Config.SEA_RADIUS + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x =  Math.cos(coin.angle)*coin.distance;
      coin.mesh.rotation.z += Math.random() * 0.1;
      coin.mesh.rotation.y += Math.random() * 0.1;

      const diffPos = base.mesh.position.clone().sub(coin.mesh.position.clone()),
            d = diffPos.length();

      if (d < coinDistanceTolerance) {

        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        Config.particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
        this.addEnergy();
        i--;

      } else if (coin.angle > Math.PI) {

        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        i--;

      }

    }
  }


  /**
   * @method addEnergy
   */
  addEnergy () {

    Config.energy += Config.COIN_VALUE;
    Config.energy = Math.min(Config.energy, 100);

  }

};