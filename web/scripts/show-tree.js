function store(data){
    const store = f3.createStore({
        data: data,
        is_vertical :true,
        node_separation: 255,
        spouse_separation: 80,
        level_separation: 100
        }),
        view = f3.d3AnimationView({
        store,
        cont: document.querySelector("#FamilyChart")
        }),
        Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {w:250,h:60,text_x:5,text_y:5,img_w:0,img_h:0,img_x:2,img_y:2},
        card_display: [
            d => `${(d.data['first name']!=undefined ? d.data['first name'] + ' ' : '') + (d.data['last name']!=undefined ? d.data['last name'] : '') }`,
            d => `${(d.data['birthday']!=undefined ? d.data['birthday'] : '')   + ' - ' + (d.data['deathday']!=undefined ? d.data['deathday']:'') }`,
            d => `${(d.data['birthplace']!=undefined?d.data['birthplace']:'')  + ' - ' + (d.data['deathplace']!=undefined ? d.data['deathplace'] : '') }`
            ],
        mini_tree: true,
        link_break: true
        })
    view.setCard(Card)
    store.setOnUpdate(props => view.update(props || {}))
    store.update.tree({initial: true});
};


