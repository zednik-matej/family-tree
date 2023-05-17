/*
    author : Matej Zednik
    year : 2023
    inspired in example usage from: https://github.com/donatso/family-chart
    family-chart.css is edited and original source is : https://github.com/donatso/family-chart
    file : parse-gedcom.js
    project : Family Tree Drawing in Web Pages
*/

function store(data){
    const store = f3.createStore({
        data: data,
        is_vertical :true,
        node_separation: 280,
        spouse_separation: 95,
        level_separation: 120
        }),
        view = f3.d3AnimationView({
        store,
        cont: document.querySelector("#FamilyChart")
        }),
        Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {w:275,h:85,text_x:10,text_y:2,img_w:0,img_h:0,img_x:2,img_y:2},
        card_display: [
            d => `${(d.data['first name']!=undefined ? d.data['first name'] + ' ' : '') + (d.data['last name']!=undefined ? d.data['last name'] : '') }`,
            d => `${(d.data['birthday']!=undefined ? '* '+d.data['birthday'] : '')}`,
            d => `${(d.data['deathday']!=undefined ? '† '+d.data['deathday']:'')}`,
            d => `${'* '+(d.data['birthplace']!=undefined ? d.data['birthplace']:'')}`,
            d => `${'† '+(d.data['deathplace']!=undefined ? d.data['deathplace'] : '')}`
            ],
        mini_tree: false,
        link_break: true
        })
    view.setCard(Card)
    store.setOnUpdate(props => view.update(props || {}))
    store.update.tree({initial: true});
};


