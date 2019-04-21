

for (let i of ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']) {
  document.body.addEventListener(i, function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
}

for (let i of ['dragover', 'dragenter']) {
  document.body.addEventListener(i, function (e) {
    document.body.className = 'dropping';
  });
}

for (let i of ['dragleave', 'dragend', 'drop']) {
  document.body.addEventListener(i, function (e) {
    document.body.className = '';
  });
}

document.body.addEventListener('drop', function (e) {
  let files = e.dataTransfer.files;

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file.name.endsWith(".n3pmesh")) {
      readAsByte(file, function (data) {
        let mesh = readN3PMesh(data);
        addObject(mesh.vertices, mesh.indices);
      });
    } else {
      alert('this file type is not supported. (' + file.name + ')');
    }
  }
});

function readAsByte(file, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    let data = new DataView(reader.result);

    callback(data);
  };
  reader.readAsArrayBuffer(file);
}

