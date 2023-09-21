//Récupération des projets et affichage dans le DOM au format texte
async function get() {
    const response = await fetch("http://localhost:5678/api/works");
    const worksJson = await response.json();

    //initialisation d'un tableau qui contiendra les éléments de la galerie
    const galleryElement = [worksJson.length];

    //reinitialisation de la galerie
    const galleryClass = document.querySelector(".gallery");
    galleryClass.innerHTML = "";

    let i = 0;
    while (i < worksJson.length) {
        addWork(galleryClass, worksJson[i])
        i++;
    }

    /*
    //Affichage du contenu de WorksJson
    console.log(worksJson);
    const worksString = JSON.stringify(worksJson);
    document.getElementById("portfolio").innerHTML = 
    "Type de la variable : " + typeof(worksString) + "<br>Contenu de la variable : " + worksString;
    */

};

function addWork(parentClass, workJson) {
    //déclaration des éléments à ajouter dans la galerie
    let figureElement = document.createElement("figure");
    let imageElement = document.createElement("img");
    let figcaptionElement = document.createElement("figcaption");

    //définition du contenu des éléments
    imageElement.src = workJson.imageUrl;
    imageElement.alt = workJson.title;
    figcaptionElement.innerHTML = workJson.title;

    //Ajout des éléments dans la galerie
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    parentClass.appendChild(figureElement);
};

get();