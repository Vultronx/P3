//Récupération des projets et affichage dans le DOM
//le paramètre attendu est un entier correspondant à l'ID de la catégorie souhaitée
//par defaut, categorieID = 0. Affichage de tous les projets si aucune valeur n'a été renseignée
async function get(categorieID = 0) {
    //récupération des travaux sur le serveur
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const worksJson = await worksResponse.json();

    //Récupération des catégories sur le serveur
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categoriesJson = await categoriesResponse.json();

    //Affichage temporaire des catégories dans la console
    console.log(categoriesJson);

    //reinitialisation de la galerie
    const galleryClass = document.querySelector(".gallery");
    galleryClass.innerHTML = "";

    //boucle permettant l'ajout des projets du JSON dans la galerie
    let i = 0;
    while (i < worksJson.length) {
        if (worksJson[i].category.id == categorieID || categorieID == 0) {
            addWork(galleryClass, worksJson[i]);
        }
        i++;
    };

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