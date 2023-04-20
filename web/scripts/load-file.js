function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var content = e.target.result;
        var data = parseGedcom(content);
        store(data);
        //file-load
        var element = document.getElementById('file-load');
        element.textContent = 'File loaded';
    };
    reader.readAsText(file);
  }

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);