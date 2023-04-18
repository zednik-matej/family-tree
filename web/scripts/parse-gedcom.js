function parse(content){
    data = [
        {
        "id": "homer",
        "rels": {
            "spouses": [
            "marge"
            ],
            "children": [
            "lisa"
            ]
        },
        "data": {
            "first name": "Homer",
            "last name": "Simpson",
            "birthday": 1970,
            "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
            "gender": "M"
        }
        },
        {
        "id": "lisa",
        "data": {
            "gender": "F",
            "first name": "Lisa",
            "last name": "Simpson",
            "birthday": "",
            "avatar": ""
        },
        "rels": {
            "mother": "marge",
            "father": "homer"
        }
        },
        {
        "id": "marge",
        "data": {
            "gender": "F",
            "first name": "Marge",
            "last name": "Simpson",
            "birthday": "",
            "avatar": ""
        },
        "rels": {
            "spouses": [
            "homer"
            ],
            "children": [
            "lisa"
            ]
        }
        }
    ];
    return data;
}