
const categoryHTML = (props)=>{
    return `
        <div class="category-wrapper p-2" category_id="${props.id}">
            <div class="category-row">
                ${props.items}
            </div>
        </div>`;
}
const itemHTML = (props)=>{
    return `
        <div class="item">
            <div class="img clickable" onclick="localHref('item.html?id=${props.id}')" style="background-image: url(${window.location.origin}/${props.image});"></div>
            <p class="clickable" onclick="localHref('item.html?id=${props.id}')">
                <strong>${props.name}</strong>
                <br>
                Цена: ${props.price} руб.
            </p>
            <button onclick="addToCart(${props.id});">В корзину</button>
        </div>`;
}

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    let categories = await getCategories();
    for(let categoryProps of categories){
        let itemsHTML = "";
        for(let itemProps of await getItems(categoryProps.id)){
            itemsHTML += itemHTML(itemProps);
        }
        categoryProps.items = itemsHTML;
        let category = categoryHTML(categoryProps);
        main.appendChild(parseHTML(category));
    }
})
