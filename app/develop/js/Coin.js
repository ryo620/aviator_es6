'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Coin
 */
export default class Coin {


  /**
   * @constructor
   */
  constructor () {

    const geo = new THREE.TetrahedronGeometry(5, 0),
          mat = new THREE.MeshPhongMaterial({
            color: Config.COLOR.green,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading
          });

    this.mesh            = new THREE.Mesh(geo, mat);
    this.mesh.name       = 'coin';
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;

  }

};