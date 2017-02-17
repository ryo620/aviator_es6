'use strict';


/**
 * @function randomInt
 * @fileoverview 最小値〜最大値間の整数をランダムで返す
 * @param {Number} max - 最大整数
 * @param {Number} min - 最小整数
 * @return {Number} ランダムな整数
 */
export const randomInt = (max = 1, min = 0) => {
  return Math.floor( Math.random() * (max - min + 1)) + min;
};


/**
 * @function convertRadian
 * @fileoverview 度数法（度）を弧度法（ラジアン）を変換する
 * @param {Number} rotation - 度数法（度）
 * @returns {Number} 弧度法（ラジアン）
 */
export const convertRadian = (rotation) => {
  return rotation * Math.PI / 180;
};
