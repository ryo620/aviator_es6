'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Cloud
 */
export default class Cloud {


  /**
   * @constructor
   */
  constructor () {

    const geo = new THREE.CubeGeometry(20,20,20),
          mat = new THREE.MeshPhongMaterial({
            color: Config.COLOR.white,
          });

    let i;

    this.mesh      = new THREE.Object3D();
    this.mesh.name = 'cloud';
    this.nBlocs    = 3 + Math.floor(Math.random() * 3);

    for (i = 0; i < this.nBlocs; i++) {

      const m = new THREE.Mesh(geo.clone(), mat),
            s = 0.1 + Math.random() * 0.9;

      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI*2;
      m.rotation.y = Math.random() * Math.PI*2;
      m.scale.set(s, s, s);

      m.castShadow    = true;
      m.receiveShadow = true;

      this.mesh.add(m);

    }

  }


  /**
   * @method rotate
   */
  rotate () {

    let i;

    for (i = 0; i < this.nBlocs; i++) {

      const m = this.mesh.children[i];
      m.rotation.z += Math.random() * 0.005 * (i + 1);
      m.rotation.y += Math.random() * 0.002 * (i + 1);

    }

  }

};