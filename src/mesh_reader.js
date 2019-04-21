function readN3PMesh(data) {
  let offset = 0;
  const enc = new TextDecoder('utf-8');

  const meshNameLength = data.getInt32(offset, true);
  const meshName = enc.decode(data.buffer.slice(offset + 4, offset + meshNameLength + 4))
  offset += meshNameLength + 4;

  const collapseCount = data.getInt32(offset, true);
  const indexChangeCount = data.getInt32(offset + 4, true);
  const verticeMaxCount = data.getInt32(offset + 8, true);
  const indiceMaxCount = data.getInt32(offset + 12, true);
  const verticeMinCount = data.getInt32(offset + 16, true);
  const indiceMinCount = data.getInt32(offset + 20, true);
  offset += 24;


  if (verticeMaxCount > 0x8000 || indiceMaxCount > 0x8000) throw new Error('not allowed');

  const vertices = [];
  for (let i = 0; i < verticeMaxCount; i++) {
    vertices.push({
      x: data.getFloat32(offset, true),
      y: data.getFloat32(offset + 4, true),
      z: data.getFloat32(offset + 8, true),
      nx: data.getFloat32(offset + 12, true),
      ny: data.getFloat32(offset + 16, true),
      nz: data.getFloat32(offset + 20, true),
      u: data.getFloat32(offset + 24, true),
      v: data.getFloat32(offset + 28, true)
    });

    offset += 32;
  }


  const faces = [];

  for (let i = 0; i < indiceMaxCount; i++) {
    const v = data.getUint16(offset, true);
    offset += 2;

    faces.push(v);
  }

  return ({
    meshName,
    vertices,
    faces
  })
}