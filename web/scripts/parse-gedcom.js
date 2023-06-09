/*
    author : Matej Zednik
    year : 2023
    file : parse-gedcom.js
    project : Family Tree Drawing in Web Pages
*/

function GetPersonIndex (personArray = Array(), Tag){
    return personArray.findIndex(function(element){
        return (element["id"]==Tag);
    });
}

function setFather(Father,Mother,Children=Array()){
    if(Father == undefined||Father["rels"]==undefined)return;
    var personrels = Father["rels"];
    var personspouses = personrels["spouses"];
    if(personspouses==undefined)personspouses=Array();
    var personchildren = personrels["children"];
    if(personchildren==undefined)personchildren=Array();
    if(Mother!=undefined)personspouses.push(Mother["id"]);
    for(i=0;i<Children.length;i++){
        personchildren.push(Children[i]["id"]);
    }
    personrels["children"] = personchildren;
    personrels["spouses"] = personspouses;
    Father["rels"] = personrels;
}

function setMother(Mother,Father,Children=Array()){
    if(Mother == undefined||Mother["rels"]==undefined)return;
    var personrels = Mother["rels"];
    var personspouses = personrels["spouses"];
    if(personspouses==undefined)personspouses=Array();
    var personchildren = personrels["children"];
    if(personchildren==undefined)personchildren=Array();
    if(Father!=undefined)personspouses.push(Father["id"]);
    for(i=0;i<Children.length;i++){
        personchildren.push(Children[i]["id"]);
    }
    personrels["children"] = personchildren;
    personrels["spouses"] = personspouses;
    Mother["rels"] = personrels;
}

function setChildren(Children=Array(),Mother,Father){
    for(i=0;i<Children.length;i++){
        var personrels = Children[i]["rels"];
        if(Mother!=undefined||Mother["rels"]==undefined)personrels["mother"] = Mother["id"];
        if(Father!=undefined||Father["rels"]==undefined)personrels["father"] = Father["id"];
        Children[i]["rels"] = personrels;
    }
}

function parseFamily(section, persons = Array()){
    var chils = new Array();
    var father;
    var mother;
    var lines = section.split("\r\n");
    var numLines = lines.length; 
    for (i = 0; i < numLines; i++) {
        var line = lines[i];
        var values = line.split(" ");
        switch (values[1]){
            case "HUSB" :
                father = persons[GetPersonIndex(persons,values[2])];
                break;
            case "WIFE" :
                mother = persons[GetPersonIndex(persons,values[2])];
                break;
            case "CHIL" :
                var chil = persons[GetPersonIndex(persons,values[2])]
                chils.push(chil);
                break;
        }
    }
    if(mother==undefined){
        mother={};
    }
    if(father==undefined){
        father={};
    }
    setFather(father,mother,chils);
    setMother(mother,father,chils);
    setChildren(chils,mother,father);
    return persons;
}

function parsePerson(section){
    const person = {};
    const persondata = {};
    const personrels = {};
    var lines = section.split("\r\n");
    var numLines = lines.length; 
    var birt = false;
    var death = false;
    for (i = 0; i < numLines; i++) {
        var line = lines[i];
        var values = line.split(" ");
        if (values[0] == '0'){
            person["id"] = values[1];
        }
        if(values[0]== '1' && birt){
            birt = false;
        }
        if(values[1]=="BIRT"){
            birt = true;
            continue;
        } 
        if(values[0]== '1' && death){
            death = false;
        }
        if(values[1]=="DEAT"){
            death = true;
            continue;
        } 
        switch (values[1]){
            case "DATE" :
                if(birt == true){
                    persondata["birthday"] = values[2];
                    birthLength=values.length;
                    for(j=3;j<birthLength;j++){
                        persondata["birthday"] += " "+values[j];
                    }
                }
                else if(death == true){
                    persondata["deathday"] = values[2];
                    birthLength=values.length;
                    for(j=3;j<birthLength;j++){
                        persondata["deathday"] += " "+values[j];
                    }
                }
                break;
            case "PLAC" :
                if(birt == true){
                    persondata["birthplace"] = values[2];
                    birthLength=values.length;
                    for(j=3;j<birthLength;j++){
                        persondata["birthplace"] += " "+values[j];
                    }
                }
                else if(death == true){
                    persondata["deathplace"] = values[2];
                    birthLength=values.length;
                    for(j=3;j<birthLength;j++){
                        persondata["deathplace"] += " "+values[j];
                    }
                }
                break;
            case "GIVN" :
                persondata["first name"] = values[2];
                nameLength=values.length;
                for(j=3;j<nameLength;j++){
                    persondata["first name"] += " "+values[j];
                }
                break;
            case "SURN" :
                persondata["last name"] = values[2];
                break;
            case "SEX" :
                persondata["gender"] = values[2];
                break;
        }
    }
    person["data"] = persondata;
    person["rels"] = personrels;
    return person;
}

function GetLinesEnd(source) {
    var temp = source.indexOf('\n');
    if(temp == -1){
        return '\r';
    }
    else if (source[temp - 1] === '\r'){
        return '\r\n';
    }
    return '\n';
}


function parseGedcom(gedcom={}){
    var myText = gedcom; // Input text
    splitter = GetLinesEnd(myText);
    var lines = myText.split(splitter);
    var numLines = lines.length;
    var i;
    var section;
    var persons = Array();    //array of individuals
    var check = null;

    // parse sections
    for (i = 0; i < numLines; i++) {
    var line = lines[i];
    var values = line.split(" ");
    if (values[0] == '0') {
        if(check != null){
            if(check == "INDI"){
                persons.push(parsePerson(section));
            }
            if(check == "FAM"){
                parseFamily(section, persons);
            }
            section = "";
        }
        check = values[2];   
    }
    section += line;
    section += "\r\n";
    }
    return persons;
}
