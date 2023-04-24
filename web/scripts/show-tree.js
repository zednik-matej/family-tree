function store(data){
    var test = JSON.stringify(data);
    const store = f3.createStore({
        data: data,
        is_vertical :true,
        node_separation: 250,
        spouse_separation: 90,
        level_separation: 170
        }),
        view = f3.d3AnimationView({
        store,
        cont: document.querySelector("#FamilyChart")
        }),
        Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {w:220,h:70,text_x:75,text_y:15,img_w:60,img_h:60,img_x:5,img_y:5},
        card_display: [d => `${d.data['first name'] || ''} ${d.data['last name'] || ''}`,d => `${d.data['birthday'] || ''}`],
        mini_tree: true,
        link_break: true
        })
    view.setCard(Card)
    store.setOnUpdate(props => view.update(props || {}))
    store.update.tree({initial: true});
};


