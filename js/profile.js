const urlParams = new URLSearchParams(window.location.search);
const edit = parseInt(urlParams.get('edit'));

const userHTML = (props)=>`
    <div>
        <div>
            <p>${props.username}</p>
            <pre>${props.about}</pre>
        </div>
        <a href="profile.html?edit=1">Редактировать</a>
    </div>`;

const userEditHTML = (props)=>`
    <div>
        <p>${props.username}</p>
        <textarea id="about" style="width: 100%;">${props.about}</textarea>
    </div>
    <button id="save">Сохранить</button>`;

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");

    let userProps = await getMe();

    if(edit){
        main.replaceChildren(...parseHTMLMulti(userEditHTML(userProps)));
        const about = document.getElementById("about");
        const save = document.getElementById("save");

        save.onclick = async ()=>{
            save.disabled = true;

            await editAboutMe(about.value);
            save.disabled = true;

            localHref("profile.html");
        }
    }else{
        main.replaceChildren(...parseHTMLMulti(userHTML(userProps)));
    }
})
