const itemHTML = (props)=>{
    return `
        <div class="_table" item_id="${props.id}" style="margin-bottom: 40px;">
            <input type="text" value="${props.name}">
            <input type="number" value="${props.price}" min="1" oninput="validity.valid||(value='1');">
            ${props.categorySelect}
            <textarea>${props.description}</textarea>
            <button style="text-align: center; border: 1px solid black;">Уничтожить</button>
        </div>`;
}

const categoryHTML = (categories, selected)=>{
    let html = "";
    for(let category of categories){
        html += `<option value="${category.id}" ${category.id == selected ? "selected" : ""}>${category.name}</option>`;
    }
    return "<select>" + html + "</select>";
}



document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    const categories = await getItemCategories();
    
    let items = await getItems();
    let itemsHTML = "";
    for(let itemProps of items){
        itemProps.categorySelect = categoryHTML(categories, itemProps.category_id);
        itemsHTML += itemHTML(itemProps);
    }

    main.replaceChildren(...parseHTMLMulti(itemsHTML));

    for(let item of main.children){
        let itemId = item.getAttribute("item_id");
        let [name, price, category, description, remove] = item.children;

        async function update(){
            main.style.pointerEvents = "none";
            await updateItem(itemId, name.value, price.value, category.value, description.value);
            main.style.pointerEvents = "";
        }

        name.onchange = update;
        price.onchange = update;
        category.onchange = update;
        description.onchange = update;

        remove.onclick = async ()=>{
            main.style.pointerEvents = "none";
            await deleteItem(itemId);
            item.remove();
            main.style.pointerEvents = "";
        }
    }
})
