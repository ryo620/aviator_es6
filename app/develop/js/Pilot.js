'use strict';


import * as THREE from 'three';
import Config     from 'Config';


/**
 * @class Pilot
 */
export default class Pilot {


  /**
   * @constructor
   */
  constructor () {

    this.angleHairs = 0;

    const matBody = new THREE.MeshPhongMaterial({
            color: Config.COLOR.brown,
            shading: THREE.FlatShading
          }),
          matFace = new THREE.MeshLambertMaterial({color: Config.COLOR.pink}),
          matBrown = new THREE.MeshLambertMaterial({color: Config.COLOR.brown}),
          nHairBlock = 12;

    let i;

    const geoBody = new THREE.BoxGeometry(15,15,15),
          body    = new THREE.Mesh(geoBody, matBody);
    body.position.set(2, -12, 0);

    const geoFace = new THREE.BoxGeometry(10, 10, 10),
          face = new THREE.Mesh(geoFace,  matFace);

    const geoHair = new THREE.BoxGeometry(4, 4, 4),
          hair    = new THREE.Mesh(geoHair, matBrown),
          hairs = new THREE.Object3D();
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

    this.hairsTop = new THREE.Object3D();

    for (i = 0; i < nHairBlock; i++) {

      const h         = hair.clone(),
            col       = i % 3,
            row       = Math.floor(i / 3),
            startPosZ = -4,
            startPosX = -4;

      h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
      h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));

      this.hairsTop.add(h);

    }

    hairs.add(this.hairsTop);

    const geoHairSide  = new THREE.BoxGeometry(12, 4, 2),
          hairSideR    = new THREE.Mesh(geoHairSide, matBrown),
          hairSideL    = hairSideR.clone();

    geoHairSide.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
    hairSideR.position.set(8, -2, 6);
    hairSideL.position.set(8, -2, -6);

    const geoHairBack = new THREE.BoxGeometry(2, 8, 10),
          hairBack    = new THREE.Mesh(geoHairBack, matBrown);

    hairBack.position.set(-1, -4, 0)
    hairs.add(hairSideR, hairSideL, hairBack);
    hairs.position.set(-5, 5, 0);

    const geoGlass = new THREE.BoxGeometry(5, 5, 5),
          glassR   = new THREE.Mesh(geoGlass, matBrown);

    glassR.position.set(6, 0, 3);

    const glassL = glassR.clone();

    glassL.position.z = -glassR.position.z

    const GeoGlassA = new THREE.BoxGeometry(11, 1, 11),
          glassA    = new THREE.Mesh(GeoGlassA, matBrown);

    const geoEar = new THREE.BoxGeometry(2, 3, 2),
          earL   = new THREE.Mesh(geoEar, matFace);

    earL.position.z = -6;

    const earR = earL.clone();
    earR.position.z = -earL.position.z;

    this.mesh = new THREE.Object3D();
    this.mesh.name = 'pilot';
    this.mesh.add(body, face, hairs, glassR, glassL, glassA, earL, earR);

  }


  /**
   * @method updateHairs
   */
  updateHairs () {

    const hairs = this.hairsTop.children,
          l     = hairs.length;

    let i;

    for (i = 0; i < l; i++) {

      hairs[i].scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;

    }

    this.angleHairs += Config.speed * Config.deltaTime * 40;

  }

};