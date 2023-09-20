async function get() {
    const response = await fetch("http://localhost:5678/api/works");
    const worksJson = await response.json();
    console.log(worksJson);
    let worksString = JSON.stringify(worksJson);
    document.getElementById("portfolio").innerHTML = 
    "Type de la variable : " + typeof(worksString) + "<br>Contenu de la variable : " + worksString;
};

get();