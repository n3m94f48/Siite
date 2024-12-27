function getCookie(key){
    let cookie_string = decodeURIComponent(document.cookie);
    if(cookie_string == "") return null;

    let cookies = cookie_string.split(";");

    for(let i = [0]; i < cookies.length; i++){
        let cookie = cookies[i].trim();
        if(cookie.indexOf(key) == 0){
            return cookie.substring(key.length+1, cookie.length);
        }
    }
    return null;
}

function parseHTML(string){
    string = string.replace(/\s+/g, " ");
    let div = document.createElement("div");
    div.innerHTML = string.trim();

    return div.firstChild;
}

function parseHTMLMulti(string){
    string = string.replace(/\s+/g, " ");
    let div = document.createElement("div");
    div.innerHTML = string.trim();

    return div.children;
}

async function request(method, payload){
    return new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.open("POST", window.location.origin + "/methods.php/" + method, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onload = () => {
            if (req.readyState == 4 && req.status == 200) {
                if(req.response == ''){
                    console.log(method, true);
                    resolve(true);
                    return;
                };
                let parsed = JSON.parse(req.response);
                console.log(method, parsed);
                resolve(parsed);
            } else {
                try{
                    let response = JSON.parse(req.response);
                    alert("Ошибка: " + response.description);
                    console.error(req.status, response);
                    if(response.name == "SESSION_INVALID"){
                        document.cookie = "sessionid=;max-age=0;";
                        document.cookie = "cartid=;max-age=0;";
                        document.cookie = "cartitemscount=;max-age=0;";
                        window.location.replace(window.location.href = window.location.origin + "/index.html");
                    }
                    reject(response);
                }catch{
                    console.error("unexpected php error: ", req.response);
                    reject(false);
                }
                
                
            }
        };
        req.send(JSON.stringify(payload));
    });
}