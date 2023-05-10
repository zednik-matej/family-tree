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

function SendHTTP(method, url, data, username, password){
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    if(data)xhr.setRequestHeader('Content-Type', 'application/json');
    if(username&&password)xhr.setRequestHeader("Authorization", "Basic " + btoa(username+':'+password));
    xhr.onload = () => {
      if(xhr.status>=400){
        reject(xhr.response);
      }
      else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject('Error');
    }

    xhr.send(JSON.stringify(data));
  })
  return promise;
}

function loadNeo4jData(){
  SendHTTP('POST', 'http://perun.fit.vutbr.cz:7474/db/neo4j/tx/commit', {
    "statements": [
      {
        "statement" : "MATCH (probant {id: '3208'})-[re:JE_OTEC*1..]->(person: Osoba) RETURN person, re[0]"
    }
    ]
  }, 'xzedni15', 'guvejfe6ur').then(responseData=>{
      console.log(responseData.results[0]);
    }).catch(err=>{
      console.log(err);
    });
}

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);


document.getElementById('PostBtn')
    .addEventListener('click', loadNeo4jData, false);