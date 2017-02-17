'use strict';


import * as THREE from 'three';
import Config     from 'Config';
import Pilot      from 'Pilot';


/**
 * @class AirPlane
 */
export default class AirPlane {


  /**
   * @constructor
   */
  constructor () {

    const matBody = new THREE.MeshPhongMaterial({
            color: Config.COLOR.red,
            shading: THREE.FlatShading
          }),
          matEngine = new THREE.MeshPhongMaterial({
            color: Config.COLOR.white,
            shading: THREE.FlatShading
          }),
          matGrass = new THREE.MeshPhongMaterial({
            color: Config.COLOR.white,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.3,
          }),
          matIron = new THREE.MeshPhongMaterial({
            color: Config.COLOR.brown,
            shading: THREE.FlatShading
          }),
          matDark = new THREE.MeshPhongMaterial({
            color: Config.COLOR.brownDark,
            shading: THREE.FlatShading
          });


    // Cabin
    const geoCabin = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1),
          cabin    = new THREE.Mesh(geoCabin, matBody);

    geoCabin.vertices[4].y -= 10;
    geoCabin.vertices[4].z += 20;
    geoCabin.vertices[5].y -= 10;
    geoCabin.vertices[5].z -= 20;
    geoCabin.vertices[6].y += 30;
    geoCabin.vertices[6].z += 20;
    geoCabin.vertices[7].y += 30;
    geoCabin.vertices[7].z -= 20;

    cabin.castShadow    = true;
    cabin.receiveShadow = true;


    // Engine
    const geoEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
          engine    = new THREE.Mesh(geoEngine, matEngine);

    engine.position.x    = 50;
    engine.castShadow    = true;
    engine.receiveShadow = true;


    // Tail Plane
    const geoTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1),
          tailPlane    = new THREE.Mesh(geoTailPlane, matBody);

    tailPlane.position.set(-40, 20, 0);
    tailPlane.castShadow    = true;
    tailPlane.receiveShadow = true;


    // SideWing
    const geoSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1),
          sideWing    = new THREE.Mesh(geoSideWing, matBody);

    sideWing.position.set(0, 15, 0);
    sideWing.castShadow    = true;
    sideWing.receiveShadow = true;


    // 風よけ
    const geoWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1),
          windshield    = new THREE.Mesh(geoWindshield, matGrass);

    windshield.position.set(5, 27, 0);
    windshield.castShadow    = true;
    windshield.receiveShadow = true;


    // propeller
    const geoPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);

    geoPropeller.vertices[4].y -= 5;
    geoPropeller.vertices[4].z += 5;
    geoPropeller.vertices[5].y -= 5;
    geoPropeller.vertices[5].z -= 5;
    geoPropeller.vertices[6].y += 5;
    geoPropeller.vertices[6].z += 5;
    geoPropeller.vertices[7].y += 5;
    geoPropeller.vertices[7].z -= 5;

    this.propeller = new THREE.Mesh(geoPropeller, matIron);
    this.propeller.position.x    = 60;
    this.propeller.castShadow    = true;
    this.propeller.receiveShadow = true;


    // blade1
    const geoBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1),
          blade1   = new THREE.Mesh(geoBlade, matDark);

    blade1.position.set.x = 8;
    blade1.castShadow     = true;
    blade1.receiveShadow  = true;


    // blade2
    const blade2 = blade1.clone();

    blade2.rotation.x    = Math.PI / 2;
    blade2.castShadow    = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1, blade2);


    // プロテクトR
    const geoWheelProtec = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1),
          wheelProtecR   = new THREE.Mesh(geoWheelProtec, matBody);

    wheelProtecR.position.set(25, -20, 25);


    // タイヤR
    const geoTire = new THREE.BoxGeometry(24, 24, 4),
          tireR   = new THREE.Mesh(geoTire, matDark);
    tireR.position.y = -8;
    wheelProtecR.add(tireR);


    // 車軸R
    const geoWheelAxis = new THREE.BoxGeometry(10, 10, 6),
          wheelAxis    = new THREE.Mesh(geoWheelAxis, matIron);
    wheelAxis.position.y = -8;
    wheelProtecR.add(wheelAxis);


    // プロテクトL
    const wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z;


    // タイヤB
    const tireB = tireR.clone();
    tireB.scale.set(0.5, 0.5, 0.5);
    tireB.position.set(-35, -5, 0);


    // サスペンション
    const geoSuspension = new THREE.BoxGeometry(4, 20, 4),
          suspension = new THREE.Mesh(geoSuspension, matBody);
    geoSuspension.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
    suspension.position.set(-35,-5,0);
    suspension.rotation.z = -.3;

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10,27,0);

    this.mesh = new THREE.Object3D();
    this.mesh.add(cabin, engine, tailPlane, sideWing, windshield, this.propeller,
                  wheelProtecR, wheelProtecL, tireB, suspension,
                  this.pilot.mesh);
    this.mesh.name = 'airPlane';
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }


  /**
   * @method rotationPropeller
   */
  rotationPropeller () {

    this.propeller.rotation.x += 0.2 + Config.planeSpeed * Config.deltaTime * 0.005;

  }

};