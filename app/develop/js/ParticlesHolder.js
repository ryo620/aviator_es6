'use strict';


import * as THREE from 'three';
import Config     from 'Config';
import Particle   from 'Particle';


/**
 * @class ParticlesHolder
 */
export default class ParticlesHolder {


  /**
   * @constructor
   */
  constructor () {

    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];

  }


  /**
   * パーティクル群のスポーン
   * @method spawnParticles
   */
  spawnParticles (pos, density, color, scale) {

    let i;

    for (i = 0; i < density; i++) {

      let particle;

      if (Config.particlesPool.length) {

        particle = Config.particlesPool.pop();

      } else {

        particle = new Particle();

      }

      this.mesh.add(particle.mesh);

      particle.mesh.visible    = true;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.x = pos.x;
      particle.explode(pos, color, scale);

    }

  }

};