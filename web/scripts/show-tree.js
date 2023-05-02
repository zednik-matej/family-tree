function store(data){
    const store = f3.createStore({
        data: data,
        is_vertical :true,
        node_separation: 140,
        spouse_separation: 50,
        level_separation: 80
        }),
        view = f3.d3AnimationView({
        store,
        cont: document.querySelector("#FamilyChart")
        }),
        Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: {w:130,h:45,text_x:38,text_y:5,img_w:35,img_h:35,img_x:2,img_y:2},
        card_display: [d => `${d.data['first name'] || ''}`, d => `${d.data['last name'] || ''}`],
        mini_tree: true,
        link_break: true
        })
    view.setCard(Card)
    store.setOnUpdate(props => view.update(props || {}))
    store.update.tree({initial: true});
};


