import { writeSjisStr } from "../../util/bin";
import { CreateAutoTeamResponse } from "../response/createAutoTeam";
import { LoadTeamResponse } from "../response/loadTeam";
import { encodeChara1 } from "./_chara";

function _team(
  res: CreateAutoTeamResponse | LoadTeamResponse,
  msgCode: number,
  version: number
) {
  const buf = Buffer.alloc(0x0ca0);

  if (res.type === "create_auto_team_res") {
    if (version == 1) {
      buf.writeInt16LE(0x007c, 0x0000);
    } else {
      buf.writeInt16LE(0x0078, 0x0000);
    }
  } else {
    if (version == 1) {
      buf.writeInt16LE(0x0078, 0x0000);
    } else {
      buf.writeInt16LE(0x0074, 0x0000);
    }
  }

  const leader = res.members.find(item => item.leader === true);
  buf.writeUInt32LE(res.team.extId, 0x000c);
  writeSjisStr(buf, 0x0010, 0x0024, leader ? leader.profile.name : "Error");
  writeSjisStr(buf, 0x0024, 0x0044, res.team.name);
  writeSjisStr(buf, 0x0044, 0x00d8, process.env.SHOP_NAME || "Minime");
  buf.writeUInt32LE(res.team.nameBg, 0x00d8);
  buf.writeUInt32LE(res.team.nameFx, 0x00dc);
  buf.fill(0xff, 0x00e0, 0x00f9); // Bitset: Unlocked BGs probably
  buf.fill(0xff, 0x00f9, 0x0101); // Bitset: Unlocked FX probably
  buf.writeUInt32LE(leader ? leader.profile.aimeId : 0, 0x0080);

  for (let i = 0; i < 6; i++) {
    var base = 0x011c + i * 0x005c;
    if (version == 1) {
      base = 0x011c + i * 0x005c;
    } else {
      base = 0x0120 + i * 0x005c;
    }

    const member = res.members[i];

    if (member === undefined) {
      break;
    }

    const { profile, chara } = member;
    const accessTime = (profile.accessTime.getTime() / 1000) | 0;

    buf.writeInt32LE(profile.aimeId, base + 0x0000);
    writeSjisStr(buf, base + 0x0004, base + 0x0018, profile.name);
    buf.writeInt32LE(profile.lv, base + 0x0018);
    buf.writeInt32LE(0, base + 0x0024); // Month points, TODO
    buf.writeUInt32LE(accessTime, base + 0x0034);
    encodeChara1(chara).copy(buf, base + 0x0044);
  }

  // Team Time Attack:

  /*for (let i = 0; i < 6; i++) {
    const base = 0x0344 + 0x20 * i;

    buf.writeInt16LE(0x00001, base + 0x0000);
    buf.writeInt8(0x02, base + 0x0003);
    buf.writeInt32LE(0x00000003, base + 0x0004);
    iconv.encode("str\0", "shift_jis").copy(buf, base + 0x0008);
    buf.writeInt32LE(0x00000004, base + 0x001c);
  }*/

  return buf;
}

export function createAutoTeam1(res: CreateAutoTeamResponse): Buffer {
  return _team(res, 0x007c, 1);
}

export function loadTeam1(res: LoadTeamResponse): Buffer {
  return _team(res, 0x0078, 1);
}

export function createAutoTeam2(res: CreateAutoTeamResponse): Buffer {
  return _team(res, 0x0078, 2);
}

export function loadTeam2(res: LoadTeamResponse): Buffer {
  return _team(res, 0x0074, 2);
}

export function createAutoTeam3(res: CreateAutoTeamResponse): Buffer {
  return _team(res, 0x0078, 3);
}

export function loadTeam3(res: LoadTeamResponse): Buffer {
  return _team(res, 0x0074, 3);
}
