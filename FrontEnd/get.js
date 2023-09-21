//Récupération des projets et affichage dans le DOM au format texte
async function get() {
    //récupération des travaux sur le serveur
    const response = await fetch("http://localhost:5678/api/works");
    const worksJson = await response.json();

    //reinitialisation de la galerie
    const galleryClass = document.querySelector(".gallery");
    galleryClass.innerHTML = "";

    //boucle permettant l'ajout des projets du JSON dans la galerie
    let i = 0;
    while (i < worksJson.length) {
        addWork(galleryClass, worksJson[i])
        i++;
    }

    /************************ Récupérer les catégories et mettre en place la barre de filtre ************************/
    //dans le JSON les projets sont classés par catégories identifiables par un ID dans la propriété "categoryId"
    //faire un fetch sur l'adresse http://localhost:5678/api/categories afin de récupérer les catégories classées par ID
    //j'affiche ensuite les catégories sous forme de boutons filtres. Exemple : | Tous | categoryId | categoryId | categoryId | ... |
    //j'affiche ensuite les projets de la catégorie filtrée
};

//function permettant l'ajout d'un projet dans la galerie
function addWork(parentClass, workJson) {
    //déclaration des éléments à ajouter dans la galerie
    let figureElement = document.createElement("figure");
    let imageElement = document.createElement("img");
    let figcaptionElement = document.createElement("figcaption");

    //définition du contenu des éléments
    imageElement.src = workJson.imageUrl;
    imageElement.alt = workJson.title;
    figcaptionElement.innerHTML = workJson.title;

    //ajout des éléments image et figcaption dans l'élément figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

    //ajout des éléments dans la galerie
    parentClass.appendChild(figureElement);
};

get();