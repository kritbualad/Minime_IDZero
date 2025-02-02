import { Load2on2Response1, Load2on2Response2 } from "../response/load2on2";

export function load2on2_v1(res: Load2on2Response1): Buffer {
  const buf = Buffer.alloc(0x04c0);

  buf.writeInt16LE(0x00b1, 0x0000);

  return buf;
}

// Same size but presumably incompatible somehow
export function load2on2_v2(res: Load2on2Response2): Buffer {
  const buf = Buffer.alloc(0x04c0);

  buf.writeInt16LE(0x0133, 0x0000);

  return buf;
}

export function load2on2_v3(res: Load2on2Response1): Buffer {
  const buf = Buffer.alloc(0x1290);

  buf.writeInt16LE(0x00a4, 0x0000);

  return buf;
}

// Same size but presumably incompatible somehow
export function load2on2_v4(res: Load2on2Response2): Buffer {
  const buf = Buffer.alloc(0x0540);

  buf.writeInt16LE(0x0133, 0x0000);

  return buf;
}
