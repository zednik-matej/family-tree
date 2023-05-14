var prob_id;
var Persons = Array();

function parseParents(parents=Array()){
    parents.forEach(parseData);
    function parseData(Data) {
        Data.row.forEach(parseRows);
        function parseRows(Rows){
            var lastperson;
            Rows.forEach(parseItems);
            function parseItems(item,index,arr){
                var person;
                if(index==0||index%2==0){
                    var personIndex = Persons.findIndex(person=>person.id === item.id);
                    if(personIndex < 0){
                        person = {};
                        person.data=item;
                        person.id = item.id;
                        person.rels = {};
                        person.rels.children = [];
                    }
                    else{
                        person = Persons[personIndex];
                    }
                    if(lastperson!=undefined){
                        if(item.pohlaví[0]=="M")Persons[Persons.findIndex(person=>person.id === lastperson)].rels.father=item.id;
                        else if(item.pohlaví[0]=="F")Persons[Persons.findIndex(person=>person.id === lastperson)].rels.mother=item.id;
                        if(!person.rels.children.some(child => child.id === item.id))person.rels.children.push(item.id);
                    }
                    if(personIndex<0)Persons.push(person);
                    lastperson = item.id;
                } 
            }
        }
      } 
      return Persons;
}

function parseChildren(children=Array()){
    
}

function parseNeo4j(results=Array(), probant_id){
    Persons = [];
    prob_id =  probant_id;
    var parents,children;
    if(results[0]) parents = results[0].data;
    if(results[1]) children = results[1].data;
    var par=parseParents(parents);
    parseChildren(children);
    return par;
}
