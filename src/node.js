const fs = require('fs');
const path = require('path');

// const buffer = fs.readFileSync(path.resolve(__dirname, './1_5071_00_0.n3pmesh'));
const buffer = fs.readFileSync(path.resolve(__dirname, './1_5621_00_0.n3pmesh'));
let offset = 0;

const meshNameLength = buffer.readInt32LE(offset);
const meshName = buffer.slice(offset + 4, offset + meshNameLength + 4).toString();
offset += meshNameLength + 4;


const collapseCount = buffer.readInt32LE(offset);
const indexChangeCount = buffer.readInt32LE(offset + 4);
const verticeMaxCount = buffer.readInt32LE(offset + 8);
const indiceMaxCount = buffer.readInt32LE(offset + 12);
const verticeMinCount = buffer.readInt32LE(offset + 16);
const indiceMinCount = buffer.readInt32LE(offset + 20);
offset += 24;


if (verticeMaxCount > 0x8000 || indiceMaxCount > 0x8000) throw new Error('not allowed');


const vertices = [];
for (let i = 0; i < verticeMaxCount; i++) {
  vertices.push({
    x: buffer.readFloatLE(offset),
    y: buffer.readFloatLE(offset + 4),
    z: buffer.readFloatLE(offset + 8),
    nx: buffer.readFloatLE(offset + 12),
    ny: buffer.readFloatLE(offset + 16),
    nz: buffer.readFloatLE(offset + 20),
    u: buffer.readFloatLE(offset + 24),
    v: buffer.readFloatLE(offset + 28)
  });

  offset += 32;
}


const indices = [];

for (let i = 0; i < indiceMaxCount; i++) {
  const v = buffer.readUInt16LE(offset);
  offset += 2;

  indices.push(v);
}


const collapses = [];
for (let i = 0; i < collapseCount; i++) {
  collapses.push({
    indiceLoseCount: buffer.readInt32LE(offset),
    indiceChangeCount: buffer.readInt32LE(offset + 4),
    verticeLoseCount: buffer.readInt32LE(offset + 8),
    indexChange: buffer.readInt32LE(offset + 12),
    collapseTo: buffer.readInt32LE(offset + 16),
    shouldCollapse: buffer.readInt32LE(offset + 20),
  });

  offset += 24;
}


const indexChanges = [];

for (let i = 0; i < indexChangeCount; i++) {
  indexChanges.push(buffer.readInt32LE(offset));
  offset += 4;
}

const LODCtrlCount = buffer.readInt32LE(offset);
offset += 4;

const LODCtrls = [];

for (let i = 0; i < LODCtrlCount; i++) {
  LODCtrls.push({
    fDist: buffer.readFloatLE(offset),
    verticeCount: buffer.readInt32LE(offset + 4)
  });

  offset += 8;
}

let i = 0;
let c = 0;
let iVerticeCount = 0;
let iIndiceCount = 0;

while (LODCtrls[i] && LODCtrls[i].verticeCount > iVerticeCount) {
  if (c >= collapseCount) break;
  let collapse = collapses[c];
  if (collapse.verticeLoseCount + iVerticeCount > LODCtrls[i].verticeCount) break;

  iVerticeCount += collapse.verticeLoseCount;
  iIndiceCount += collapse.indiceLoseCount;

  let min = collapse.indexChange;
  let max = min + collapse.indiceChangeCount;

  for (let j = min; j < max; j++) {
    indices[indexChanges[j]] = iVerticeCount - 1;
  }

  c++;
}

while (c < collapseCount && collapses[c].shouldCollapse) {
  let collapse = collapses[c];

  iVerticeCount += collapse.verticeLoseCount;
  iIndiceCount += collapse.indiceLoseCount;

  let min = collapse.indexChange;
  let max = min + collapse.indiceChangeCount;

  for (let j = min; j < max; j++) {
    indices[indexChanges[j]] = iVerticeCount - 1;
  }

  c++;
}

console.log({
  meshName,
  count: {
    collapse: collapseCount,
    indexChange: indexChangeCount,
    vertice: { min: verticeMinCount, max: verticeMaxCount },
    indice: { min: indiceMinCount, max: indiceMaxCount }
  },
})

fs.writeFileSync('vert.js', 'var vert = ' + JSON.stringify(vertices, null, '  '));
fs.writeFileSync('ind.js', 'var ind = ' + JSON.stringify(indices, null, '  '));