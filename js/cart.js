const itemHTML = (props)=>{
    return `
        <div class="_table" item_id="${props.id}" price="${props.price}">
            <div style="display: flex; flex-direction: row;">
                <h5 class="clickable"><strong>${props.name}</strong></h5>
                <button id="delete"></button>
            </div>
            <p>${props.price} руб., ${props.quantity} шт.</p>
        </div>`;
}

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    const wrapper = document.getElementById("items_wrapper");
    const controls = document.getElementById("controls");

    const cartId = getCookie("cartid");


    if(cartId === null){ wrapper.innerText = "Корзина пуста"; controls.style.display = "none"; return; }

    const totalPrice = document.getElementById("total_price");
    const purchase = document.getElementById("purchase_btn");

    function calcTotal(){
        let total = 0;
        for(let item of wrapper.children){
            let price = item.getAttribute("price");
            total += price;
            console.log(item.children);
        }
    }

    let cartItems = await getCartItems(cartId);
    let itemsHTML = "";

    for(let itemProps of cartItems){
        itemsHTML += itemHTML(itemProps);
    }

    wrapper.replaceChildren(...parseHTMLMulti(itemsHTML));

    calcTotal();

    for(let item of wrapper.children){
        let itemId = item.getAttribute("item_id");
        let [name, delButton] = item.children[0].children;
        name.onclick = ()=>{ localHref("item.html?id=" + itemId); };

        delButton.onclick = async ()=>{
            main.style.pointerEvents = "none";
            await removeFromCart(itemId);
            item.remove();
            calcTotal();
            main.style.pointerEvents = "";

            if(wrapper.children.length == 0){ 
                document.cookie = "cartid=; max-age=0";
                document.cookie = "cartitemscount=; max-age=0";
                wrapper.innerText = "Корзина пуста"; 
                controls.style.display = "none";
                main.style.pointerEvents = "";
                return; 
            }
        };
    }

    purchase.onclick = ()=>{
        main.style.pointerEvents = "none";
        purchaseCart(cartId).then(
            ()=>{
                document.cookie = "cartid=; max-age=0";
                document.cookie = "cartitemscount=; max-age=0";
                document.body.dispatchEvent(new CustomEvent("cartPurchased"));
                wrapper.innerHTML = "Корзина пуста";
                controls.style.display = "none"; 
                main.style.pointerEvents = "";
            },
            ()=>{
                main.style.pointerEvents = "";
            }
        );
    };

})
