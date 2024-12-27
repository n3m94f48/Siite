const userHTML = (props)=>{
    return `
        <div class="_table" user_id="${props.id}">
            <p>Имя: ${props.username}</p>
            <input type="number" value="${props.funds}" min="1" oninput="validity.valid||(value='1');">
            <p style="border: none;">рублей</p>
            <button style="text-align: center;">Уничтожить</button>
        </div>`;
}

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    
    let users = await getUsers();
    let usersHTML = "";
    for(let userProps of users){
        usersHTML += userHTML(userProps);
    }

    main.replaceChildren(...parseHTMLMulti(usersHTML));

    for(let user of main.children){
        let userId = user.getAttribute("user_id");
        let [_, funds, __, remove] = user.children;

        funds.onchange = async ()=>{
            main.style.pointerEvents = "none";
            await setUserFunds(userId, funds.value);
            main.style.pointerEvents = "";
        }
        remove.onclick = async ()=>{
            main.style.pointerEvents = "none";
            await deleteUser(userId);
            user.remove();
            main.style.pointerEvents = "";
        };
    }
})
