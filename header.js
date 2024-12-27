let item_count = getCookie("cartitemscount");

document.write(`
<header class="sticky-top p-relative d-flex flex-row align-items-center justify-content-between p-2" style="margin: 15px 15%; border-radius: 20px">
    <button id="logo" onclick="localHref('catalog.html')">
        Электроника
    </button>
    <p id="funds" style="color: white;"></p> 
    <div class="spaced" style="display: flex; align-items: end; flex-direction: row; color: white;">
        <div>
            <button id="cart" class="hdr-btn clickable" style="position: relative; display: flex; flex-direction: row; width: auto;" onclick="localHref('cart.html')">
                Корзина
                <img src="images/cart.png" alt="cart">
            </button>
        </div>
        <button class="hdr-btn clickable" style="position: relative; display: flex; flex-direction: row; width: auto;" onclick="localHref('orders.html')">
                Заказы
                <img src="images/order.png" alt="cart">
            </button>
            <button class="hdr-btn clickable" style="position: relative; display: flex; flex-direction: row; width: auto;" onclick="signOutAndExit();">
                Выйти
                <img src="images/exit.png" alt="cart">
            </button>
    </div>
    <div id="account_popup" style="display: none;">
        <button onclick="localHref('orders.html')">Мои заказы</button>
        <button onclick="signOutAndExit();">Выйти</button>
    </div>
</header>

<script>
    const popup = document.getElementById("account_popup");
    const cart = document.getElementById("cart");
    const cartCounter = document.getElementById("cart_counter");
    
    function showAccountPopup(evt){
        if(popup.getAttribute("visible")){return;}
        evt.stopPropagation();
            
        popup.setAttribute("visible",true);
        popup.style.display = "";


        function listener(evt){
            evt.stopImmediatePropagation();
            if(evt.target != popup && !popup.contains(evt.target)){
                popup.style.display = "none";
                popup.removeAttribute("visible");
                document.removeEventListener("click", listener);
            }
        }
        document.addEventListener("click", listener);
    }

    document.body.addEventListener("cartItemAdded", ()=>{
        cartCounter.innerText = getCookie("cartitemscount");
        cartCounter.style.display = "flex";
    });

    document.body.addEventListener("cartItemRemoved", ()=>{
        let itemCount = getCookie("cartitemscount");
        if(!itemCount){
            cartCounter.style.display = "none";
        }
        cartCounter.innerText = itemCount;
    });

    document.body.addEventListener("cartPurchased", ()=>{
        cartCounter.style.display = "none";
        getMe().then((response)=>{
            document.getElementById("funds").innerText = "У вас " + response.funds + " рублей";
        });
    });
</script>
`);

getMe().then((response)=>{
    document.getElementById("funds").innerText = "У вас " + response.funds + " рублей";
});

/* <button onclick="localHref('profile.html')">Профиль</button> */