'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Enemy
 */
export default class Enemy {


  /**
   * @constructor
   */
  constructor () {

    const geo = new THREE.TetrahedronGeometry(8, 2),
          mat = new THREE.MeshPhongMaterial({
            color: Config.COLOR.red,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading
          });

    this.mesh            = new THREE.Mesh(geo, mat);
    this.mesh.name       = 'enemy';
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;

  }

};