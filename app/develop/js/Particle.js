'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Particle
 */
export default class Particle {


  /**
   * @constructor
   */
  constructor () {
    const geo = new THREE.TetrahedronGeometry(3, 0),
          mat = new THREE.MeshPhongMaterial({
            color: 0x009999,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading
          });

    this.mesh = new THREE.Mesh(geo, mat);

  }


  /**
   * 破裂
   * @method explode
   */
  explode (pos, color, scale) {

    const _p      = this.mesh.parent,
          targetX = pos.x + (Math.random() * 2 - 1) * 50,
          targetY = pos.y + (Math.random() * 2 - 1) * 50,
          speed   = 0.6 + Math.random() * 0.2;

    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);

    TweenMax.to(this.mesh.rotation, speed, {
      x: Math.random()*12,
      y: Math.random()*12
    });
    TweenMax.to(this.mesh.scale, speed, {
      x: 0.1,
      y: 0.1,
      z: 0.1
    });
    TweenMax.to(this.mesh.position, speed, {
      x: targetX,
      y: targetY,
      delay: Math.random() * 0.1,
      ease: Power2.easeOut,
      onComplete: () => {
        if(_p) {
          _p.remove(this.mesh);
        }
        this.mesh.scale.set(1, 1, 1);
        Config.particlesPool.unshift(this);
      }
    });
  }

};