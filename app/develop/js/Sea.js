'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Sea
 */
export default class Sea {


  /**
   * @constructor
   */
  constructor () {

    const seaLength     = 800,
          wavesMinAmp   =  5,
          wavesMaxAmp   =  20,
          wavesMinSpeed = 0.001,
          wavesMaxSpeed = 0.003,
          geo = new THREE.CylinderGeometry(Config.SEA_RADIUS, Config.SEA_RADIUS, seaLength, 40, 10),
          mat = new THREE.MeshPhongMaterial({
            color: Config.COLOR.blue,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.8
          });

    let i;

    this.vertices       = geo.vertices;
    this.verticesLength = this.vertices.length;

    geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    geo.mergeVertices();

    this.waves = [];

    for (i = 0; i < this.verticesLength;i++) {

      const v = geo.vertices[i];

      this.waves.push({
        y: v.y,
        x: v.x,
        z: v.z,
        ang: Math.random() * Math.PI*2,
        amp: wavesMinAmp + Math.random() * (wavesMaxAmp - wavesMinAmp),
        speed: wavesMinSpeed + Math.random() * (wavesMaxSpeed - wavesMinSpeed)
      });

    };

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.name = 'waves';
    this.mesh.receiveShadow = true;

  }

  moveWaves () {

    let i;

    for (i = 0; i < this.verticesLength; i++) {

      const v      = this.vertices[i],
            vprops = this.waves[i];

      v.x =  vprops.x + Math.cos(vprops.ang) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
      vprops.ang += vprops.speed * Config.deltaTime;

      this.mesh.geometry.verticesNeedUpdate = true;

    }

  }

};