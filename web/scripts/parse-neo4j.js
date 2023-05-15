var prob_id;
var Persons = Array();

function setPerson(persondata){
    var person = {};
    person["all data"]=persondata;
    if(persondata["datum_narodení"][0]!=undefined){
        person["birthday"] = persondata["datum_narodení"][0];
    }
    else{
        person["birthday"] = '?(';
        for(i=0;i<persondata["odhad_narodení"].length;i++){
            if(i==0)person["birthday"]+=persondata["odhad_narodení"][i];
            else person["birthday"]+=', '+persondata["odhad_narodení"][i];
        }
        person["birthday"] += ')';
    }

    if(persondata["datum_úmrtí"][0]!=undefined){
        person["deathday"] = persondata["datum_úmrtí"][0];
    }
    else{
        person["deathday"] = '?(';
        for(i=0;i<persondata["odhad_úmrtí"].length;i++){
            if(i==0)person["deathday"]+=persondata["odhad_úmrtí"][i];
            else person["deathday"]+=', '+persondata["odhad_úmrtí"][i];
        }
        person["deathday"] += ')';
    }

    if(persondata["jméno"][0]!=undefined){
        person["first name"] = persondata["jméno"][0];
    }

    if(persondata["příjmení"][0]!=undefined){
        person["last name"] = persondata["příjmení"][0];
    }

    if(persondata["pohlaví"][0]!=undefined){
        person["gender"] = persondata["pohlaví"][0];
    }
    return person;
}

function parseParents(parents=Array()){
    parents.forEach(parseData);
    function parseData(Data) {
        Data.row.forEach(parseRows);
        function parseRows(Rows){
            var lastperson;
            if(Array.isArray(Rows))Rows.forEach(parseItems);
            else parseItems(Rows,0,0);
            function parseItems(item,index,arr){
                var person;
                if(index==0||index%2==0){
                    var personIndex = Persons.findIndex(person=>person.id === item.id);
                    if(personIndex < 0){
                        person = {};
                        person.data=setPerson(item);
                        person.id = item.id;
                        person.rels = {};
                        person.rels.children = [];
                        person.rels.spouses = [];
                    }
                    else{
                        person = Persons[personIndex];
                    }
                    if(lastperson!=undefined){
                        if(item.pohlaví[0]=="M")Persons[Persons.findIndex(person=>person.id === lastperson)].rels.father=item.id;
                        else if(item.pohlaví[0]=="F")Persons[Persons.findIndex(person=>person.id === lastperson)].rels.mother=item.id;
                        if(!person.rels.children.includes(lastperson))person.rels.children.unshift(lastperson);
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
    children.forEach(parseData);
    function parseData(Data) {
        Data.row.forEach(parseRows);
        function parseRows(Rows){
            var lastperson;
            if(Array.isArray(Rows))Rows.forEach(parseItems);
            else parseItems(Rows,0,0);
            function parseItems(item,index,arr){
                var person;
                if(index==0||index%2==0){
                    var personIndex = Persons.findIndex(person=>person.id === item.id);
                    if(personIndex < 0){
                        person = {};
                        person.data=setPerson(item);
                        person.id = item.id;
                        person.rels = {};
                        person.rels.children = [];
                        person.rels.spouses = [];
                    }
                    else{
                        person = Persons[personIndex];
                    }
                    if(lastperson!=undefined){
                        if(lastperson.gender=="M"&&person.rels.father==undefined)person.rels.father= lastperson.id;
                        if(lastperson.gender=="F"&&person.rels.mother==undefined)person.rels.mother= lastperson.id;
                        if(!Persons[Persons.findIndex(person=>person.id === lastperson.id)].rels.children.includes(item.id))
                        {
                            Persons[Persons.findIndex(person=>person.id === lastperson.id)].rels.children.unshift(item.id);
                        }
                    }
                    if(personIndex<0)Persons.push(person);
                    lastperson = {};
                    lastperson.id = item.id;
                    lastperson.gender = item["pohlaví"][0];
                }
            }
        }
      } 
      return Persons;
}

function LoadPerson(item,personindex){
    if(personindex<0){
        person = {};
        person.data=setPerson(item);
        person.id = item.id;
        person.rels = {};
        person.rels.children = [];
        person.rels.spouses = [];
    }
    else{
        person = Persons[personindex];
    }
    return person;
}

function ParseOtherParents(OtherPar=Array()){
    OtherPar.forEach(parseData);
    function parseData(Data) {    
        var personindex, motherindex;
        var person, mother;
        if(Data.row[0]){
            personindex = Persons.findIndex(per=>per.id === Data.row[0].id);
            person = LoadPerson(Data.row[0],personindex);
        }
        if(Data.row[1])
        {
            motherindex = Persons.findIndex(per=>per.id === Data.row[1].id);
            mother = LoadPerson(Data.row[1],motherindex);
        }
        if(mother!=undefined){
            if(mother.data.gender=="F")
            {
                person.rels.mother = mother.id;
            }
            if(mother.data.gender=="M")
            {
                person.rels.father = mother.id;
            }
            if(!mother.rels.children.includes(person.id))mother.rels.children.unshift(person.id);
            if(personindex<0)Persons.push(person);
            if(motherindex<0)Persons.push(mother);
        }
    
      } 
      return Persons;
}

function RepairSpouses(){
    for(i=0;i<Persons.length;i++){
        person = Persons[i];
        if(person.rels.father!=undefined){
            fatherindex = Persons.findIndex(per=>per.id === person.rels.father);
            motherindex = Persons.findIndex(per=>per.id === person.rels.mother);
            if(fatherindex>-1&&motherindex>-1){
                father = Persons[fatherindex];
                mother = Persons[motherindex];
                if(!mother.rels.spouses.includes(father.id))mother.rels.spouses.push(father.id);
                if(!father.rels.spouses.includes(mother.id))father.rels.spouses.push(mother.id);
            }
        }
    }
}

function parseNeo4j(results=Array(), probant_id){
    Persons = [];
    prob_id =  probant_id;
    var parents,children,OtherPar;
    if(results[0]) parents = results[0].data;
    if(results[1]) children = results[1].data;
    if(results[2]) OtherPar = results[2].data;
    parseParents(parents);
    parseChildren(children);
    ParseOtherParents(OtherPar);
    RepairSpouses();
    return Persons;
}
