import { EventsClient, EventHandler } from 'modloader64_api/EventHandler';
import { IModLoaderAPI, IPlugin } from 'modloader64_api/IModLoaderAPI';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IZ64Main } from 'Z64Lib/API/Common/IZ64Main';
import { Color3 } from './Color3';

const GAUNTADDR = 0xF7AE4;
const TUNICADDR = 0x000F7AD8;
const NAVIBASER_ADDR = 0x801E2155;
const NAVIBASEG_ADDR = 0x801E2159;
const NAVIBASEB_ADDR = 0x801E215D;
const NAVIBASEA_ADDR = 0x801E2155;
const NAVIOUTR_ADDR = 0x801E2161;
const NAVIOUTG_ADDR = 0x801E2165;
const NAVIOUTB_ADDR = 0x801E2169;
const SWORD_TRAIL1 = 0x80115DCE;
const SWORD_TRAIL2 = 0x80115DD2;
const SWORD_TRAIL3 = 0x80115DD6;
const SWORD_TRAIL4 = 0x80115DDA;
const HEARTBEAT_OUTER = 0x8011BD31;
const HEARTBEAT_INNER = 0x8011BD39;
const HEART_OUTER = 0x8011BD41;
const HEART_INNER = 0x8011BD51;
const A_BUTTON = 0x801C7951;
const B_BUTTON = 0x801C767B;
const C_BUTTON = 0x801C7673;
const MAP = 0x801C7DC9;
const MAGIC = 0x801C7625;
// const RUPEE1 = 0x8018CD04;
// const RUPEE2 = 0x8017A8F4;


let colorTargets : Color3[] = [
  new Color3(255, 0, 255),
  new Color3(255, 0, 0),
  new Color3(255, 255, 0),
  new Color3(0, 255, 0),
  new Color3(0, 255, 255),
  new Color3(0, 0, 255),
  new Color3(255, 0, 255)
];
let currentTarget = 0;
let currentColor = new Color3();
let velocity = 15;

export class RainbowEverything implements IPlugin {
  ModLoader = {} as IModLoaderAPI;
  name = 'RainbowEverything';

  @InjectCore() core!: IZ64Main;
  constructor() {}
  preinit(): void {}
  init(): void {}
  postinit(): void {}

  onTick(): void
  {
    //this.ModLoader.emulator.rdramWrite32(global.ModLoader.save_context + 0x4, 0); Force Adult Link
    let SilverOffset = GAUNTADDR + ( 0 * 3);
    let GoldOffset = GAUNTADDR + ( 1 * 3);
    let tunicOffset = TUNICADDR + this.core.OOT!.link.tunic * 3;
    let naviOffset1 = NAVIBASER_ADDR;
    let naviOffset2 = NAVIBASEG_ADDR;
    let naviOffset3 = NAVIBASEB_ADDR;
    let naviOffset4 = NAVIBASEA_ADDR;
    let naviOffset5 = NAVIOUTR_ADDR;
    let naviOffset6 = NAVIOUTG_ADDR;
    let naviOffset7 = NAVIOUTB_ADDR;
    let swordOffset1 = SWORD_TRAIL1;
    let swordOffset2 = SWORD_TRAIL2;
    let swordOffset3 = SWORD_TRAIL3;
    let swordOffset4 = SWORD_TRAIL4;
    let heartBeatOOffset = HEARTBEAT_OUTER;
    let heartBeatIOffset = HEARTBEAT_INNER;
    let heartIOffset = HEART_INNER;
    let heartOOffset = HEART_OUTER;
    let aOffset = A_BUTTON;
    let bOffset = B_BUTTON;
    let cOffset = C_BUTTON;
    let mapOffset = MAP;
    let magicOffset = MAGIC;
    // let rupeeOffset1 = RUPEE1;
    // let rupeeOffset2 = RUPEE2;

    this.ModLoader.emulator.rdramWrite32(0x80064BB8, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064BF4, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064BF8, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064C48, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064C6C, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064C80, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064C84, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B08, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B0C, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B10, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B14, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B18, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B3C, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B48, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B54, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B60, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064BAC, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064BB4, 0);
    this.ModLoader.emulator.rdramWrite32(0x80064B04, 0);
    // this.ModLoader.emulator.rdramWrite32(0x80075828, 0);

    var rScalar = colorTargets[currentTarget].r == 255 ? 1 : -1;
    var gScalar = colorTargets[currentTarget].g == 255 ? 1 : -1;
    var bScalar = colorTargets[currentTarget].b == 255 ? 1 : -1;

    currentColor.r = currentColor.r + (velocity * rScalar);
    currentColor.g = currentColor.g + (velocity * gScalar);
    currentColor.b = currentColor.b + (velocity * bScalar);

    currentColor = currentColor.clamped();

    let halfColor = currentColor.mul(0.5);
    let goodAlpha = Math.floor(Math.pow(currentColor.r * currentColor.r + currentColor.g * currentColor.g + currentColor.b * currentColor.b, 0.5));

    if (currentColor.r == colorTargets[currentTarget].r
      && currentColor.g == colorTargets[currentTarget].g
      && currentColor.b == colorTargets[currentTarget].b) currentTarget = (currentTarget + 1) % (colorTargets.length - 1);

    this.ModLoader.emulator.rdramWriteBuffer(SilverOffset, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));
    this.ModLoader.emulator.rdramWriteBuffer(GoldOffset, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));
    this.ModLoader.emulator.rdramWriteBuffer(tunicOffset, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset1, Buffer.from([currentColor.r]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset2, Buffer.from([currentColor.g]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset3, Buffer.from([currentColor.b]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset4, Buffer.from([0xFF]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset5, Buffer.from([currentColor.r]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset6, Buffer.from([currentColor.g]));
    this.ModLoader.emulator.rdramWriteBuffer(naviOffset7, Buffer.from([currentColor.b]));
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset1, Buffer.from([currentColor.r, currentColor.g, currentColor.b, 0xFF]))
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset2, Buffer.from([currentColor.r, currentColor.g, currentColor.b, 0xFF]))
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset3, Buffer.from([halfColor.r, halfColor.g, halfColor.b, 0x80]))
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset4, Buffer.from([halfColor.r, halfColor.g, halfColor.b, 0x80]))

    /*this.ModLoader.emulator.rdramWriteBuffer(swordOffset1, Buffer.from([0xFF, 0, 0, 0xFF])) //tip beginning of slash
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset2, Buffer.from([0, 0xFF, 0, 0xFF])) //hilt beginning of slash
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset3, Buffer.from([0, 0, 0xFF, 0xFF])) //tip end of slash
    this.ModLoader.emulator.rdramWriteBuffer(swordOffset4, Buffer.from([0xFF, 0xFF, 0xFF, 0xFF])) //hiltside end of slash*/

    this.ModLoader.emulator.rdramWrite8(heartBeatOOffset, halfColor.r);
    this.ModLoader.emulator.rdramWrite8(heartBeatOOffset + 2, halfColor.g);
    this.ModLoader.emulator.rdramWrite8(heartBeatOOffset + 4, halfColor.b);

    this.ModLoader.emulator.rdramWrite8(heartBeatIOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(heartBeatIOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(heartBeatIOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(heartOOffset, halfColor.r);
    this.ModLoader.emulator.rdramWrite8(heartOOffset + 2, halfColor.g);
    this.ModLoader.emulator.rdramWrite8(heartOOffset + 4, halfColor.b);

    this.ModLoader.emulator.rdramWrite8(heartIOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(heartIOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(heartIOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(aOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(aOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(aOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(bOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(bOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(bOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(cOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(cOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(cOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(mapOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(mapOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(mapOffset + 4, currentColor.b);

    this.ModLoader.emulator.rdramWrite8(magicOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(magicOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(magicOffset + 4, currentColor.b);

    // this.ModLoader.emulator.rdramWriteBuffer(rupeeOffset1, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));
    // this.ModLoader.emulator.rdramWriteBuffer(rupeeOffset2, Buffer.from([currentColor.r, currentColor.g, currentColor.b]));

/*     this.ModLoader.emulator.rdramWrite8(sOffset, currentColor.r);
    this.ModLoader.emulator.rdramWrite8(sOffset + 2, currentColor.g);
    this.ModLoader.emulator.rdramWrite8(sOffset + 4, currentColor.b); */
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onClient_InjectFinished(evt: any) {}
}