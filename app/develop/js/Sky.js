'use strict';


import * as THREE from 'three';
import Config     from 'Config';
import Cloud      from 'Cloud';


/**
 * @class Sky
 */
export default class Sky {


  /**
   * @constructor
   */
  constructor () {

    this.mesh      = new THREE.Object3D();
    this.mesh.name = 'sky';
    this.nClouds   = 20;
    this.clouds    = [];

    const stepAngle = Math.PI * 2 / this.nClouds;

    let i;

    for (i = 0; i < this.nClouds; i++) {

      const c = new Cloud(),
            a = stepAngle * i,
            h = Config.SEA_RADIUS + 150 + Math.random() * 200,
            s = 1 + Math.random() * 2;

      this.clouds.push(c);
      c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = Math.cos(a) * h;
      c.mesh.position.z = -200 - Math.random() * 500;
      c.mesh.rotation.z = a + Math.PI / 2;
      c.mesh.scale.set(s, s, s);

      this.mesh.add(c.mesh);

    }

  }


  /**
   * @method moveClouds
   */
  moveClouds () {

    let i;

    for(i = 0; i < this.nClouds; i++) {

      this.clouds[i].rotate();

    }

    this.mesh.rotation.z += Config.speed * Config.deltaTime;

  }

};