(async function main() {

    let root = this;

    const WORKS_URL = "http://localhost:5678/api/works";
    const CATEGORIES_URL = "http://localhost:5678/api/categories";
    const LOGIN_URL = "http://localhost:5678/api/users/login"

    this.Works_JSON = null;
    this.Categories_JSON = null;

    this.works = {
        url: "http://localhost:5678/api/works",
        json: null,
        init: async function () {
            console.log("init...");
            let result = await this.update();
            if (result)
                console.log("ready.");
        },
        update: async function () {
            console.log("update...");
            //récupération des catégories sur le serveur    
            let response = await fetch(this.url);
            if (!response.ok)
                return false;
            this.json = await response.json();
            return true;
        },
        append: function (worksJson, categoryId = 0) {
            appendWorks(worksJson, categoryId);
        }
    };

    this.categories = {
        url: "http://localhost:5678/api/works",
        json: null,
        init: async function () {
            console.log("init...");
            let result = await this.update();
            if (result)
                console.log("ready.");
        },
        update: async function () {
            console.log("update...");
            //récupération des catégories sur le serveur    
            let response = await fetch(this.url);
            if (!response.ok)
                return false;
            this.json = await response.json();
            return true;
        },
        append: function (filterbar) {
            appendCategories(filterbar);
        }
    };

    this.login = {
        init: function () {

        },
        start: function () {

        }
    };

    /*console.log("Works start ...");
    await this.works.init();
    console.log("Categories start ...");
    await this.categories.init();
    console.log("Script ready.");
    console.log("Works_JSON : "+this.works.json);
    console.log("Categories_JSON : "+this.categories.json);*/

})();

//Récupération des projets et affichage dans le DOM
//le paramètre attendu est un entier correspondant à l'ID de la catégorie souhaitée
//par defaut, categorieID = 0. Affichage de tous les projets si aucune valeur n'a été renseignée
(async function sbScript() {

    //racine du script
    const root = this;
    this.Works_JSON = null;
    this.Categories_JSON = null;

    //Récupération des catégories sur le serveur    
    const CATEGORIES_RESPONSE = await fetch("http://localhost:5678/api/categories");
    const CATEGORIES_JSON = await CATEGORIES_RESPONSE.json();

    //récupération des travaux sur le serveur    
    const WORKS_RESPONSE = await fetch("http://localhost:5678/api/works");
    let WORKS_JSON = await WORKS_RESPONSE.json();
 
    //déclaration d'un pointeur sur la barre de filtre
    const filterbar = document.querySelector(".filterbar");
    this.worksManageModal = document.getElementById("works-manage");
    this.worksAddModal = document.getElementById("works-add");

    this.workPicture = document.querySelector("#works-add #work-picture");    

    //ajout des catégories dans la barre de filtre
    appendCategories(filterbar);

    //ajout des projets dans la galerie par catégories
    appendWorks(WORKS_JSON, 0); //0 = tous

    //ajout des catégories dans la barre de filtre
    function appendCategories(filterbar) {
        
        //ajout des catégories dans la barre de filtre
        appendCategory(filterbar, {id: 0, name: 'Tous'});
        let i = 0;
        while (i < CATEGORIES_JSON.length) {
            appendCategory(filterbar, CATEGORIES_JSON[i]);
            i++;
        };

    };

    //ajout des projets dans la galerie par catégories
    function appendWorks(worksJson, categoryId = 0) {

        //déclaration d'un pointeur sur la galerie
        const galleryClass = document.querySelector(".gallery");

        //reinitialisation de la galerie
        galleryClass.innerHTML = "";

        //ajout des projets dans la galerie
        i = 0;
        while (i < worksJson.length) {
            if (worksJson[i].category.id == categoryId || categoryId == 0) {
                appendWork(galleryClass, worksJson[i], i);
            }
            i++;
        };
    };

    //function permettant l'ajout d'une catégorie
    function appendCategory(filterbar, category) {
        //déclaration des éléments à ajouter
        let pElement = document.createElement("p");
        let divElement = document.createElement("div");

        let categoriesSelectElement = document.getElementById("work-category");
        let optionElement = document.createElement("option");

        //définition du contenu des éléments
        pElement.innerHTML = category.name;
        divElement.className = "button";
        divElement.addEventListener("click",  () => {
            appendWorks(WORKS_JSON, category.id);
        });

        //ajout de l'élément p dans l'élément div
        divElement.appendChild(pElement);
        
        //ajout des éléments dans la barre des catégories
        filterbar.appendChild(divElement);

        if (category.name != "Tous") {
            optionElement.value = category.name;
            optionElement.innerHTML = category.name;
            categoriesSelectElement.appendChild(optionElement);
        }
    };

    //function permettant l'ajout d'un projet dans la galerie
    function appendWork(gallery, work, i) {
        
        //déclaration des éléments à ajouter dans la galerie
        let figureElement = document.createElement("figure");
        let imageElement = document.createElement("img");
        let figcaptionElement = document.createElement("figcaption");

        //définition du contenu des éléments
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        figcaptionElement.innerHTML = work.title;

        //ajout des éléments image et figcaption dans l'élément figure
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);

        //ajout des éléments dans la galerie
        gallery.appendChild(figureElement);

        //création des éléments qui serviront à la gestion des projets
        let figureOverviewElement = document.createElement("figure");
        let imageOverviewElement = document.createElement("img");
        let deleteButtonElement = document.createElement("img");
        figureOverviewElement.style.display = "inline-block";
        figureOverviewElement.style.position = "relative";
        imageOverviewElement.src = work.imageUrl;
        imageOverviewElement.alt = work.title;
        deleteButtonElement.className = "deleteButton";
        deleteButtonElement.src = "./assets/icons/delete.png";
        deleteButtonElement.alt = "x";
        deleteButtonElement.style.position = "absolute";
        deleteButtonElement.style.top = "5px";
        deleteButtonElement.style.right = "5px";
        deleteButtonElement.style.cursor = "pointer";
        deleteButtonElement.style.zIndex = "1";
        deleteButtonElement.addEventListener("click", () => {
            figureElement.remove();
            figureOverviewElement.remove();
        });
        
        const worksOverviewElement = document.querySelector(".works-manage .overview");
        figureOverviewElement.appendChild(imageOverviewElement);
        figureOverviewElement.appendChild(deleteButtonElement);
        worksOverviewElement.appendChild(figureOverviewElement);
    };

    this.works = {
        init: function () {
            const addButtonElement = document.querySelector(".works-manage .add-button");
            const previousButtonElement = document.querySelector(".works-add .previous-button");
            const closeButtonElement = document.querySelector(".works-add .close-button");

            const pictureElement = document.querySelector(".picture");
            const addImageButtonElement = document.querySelector(".add-image-button");
            const pElement = document.querySelector(".picture-overview p");

            let oldFileName = "";
            let imageElement = document.createElement("img");

            addButtonElement.addEventListener("click", () => {
                root.worksManageModal.style.display = "none";
                root.worksAddModal.style.display = "block";
            });
            previousButtonElement.addEventListener("click", () => {
                const pictureOverviewElement = document.querySelector(".picture-overview");

                root.worksManageModal.style.display = "block";
                root.worksAddModal.style.display = "none";

                imageElement.style.display = "none";
                pictureElement.style.display = "flex";
                addImageButtonElement.style.display = "flex";
                pElement.style.display = "flex";
                pictureOverviewElement.style.padding = "16px 0px 20px 0px";
                pictureOverviewElement.style.height = "142px";
            });
            closeButtonElement.addEventListener("click", () => {
                const pictureOverviewElement = document.querySelector(".picture-overview");

                //fermeture de la modale par appel aux nodes parents
                closeButtonElement.parentNode.parentNode.style.display = "none";
                
                imageElement.style.display = "none";
                pictureElement.style.display = "flex";
                addImageButtonElement.style.display = "flex";
                pElement.style.display = "flex";
                pictureOverviewElement.style.padding = "16px 0px 20px 0px";
                pictureOverviewElement.style.height = "142px";
            });
            window.onclick = function(event) {
                if (event.target == this.worksManageModal) {
                    root.worksManageModal.style.display = "none";
                } else if (event.target == this.worksAddModal) {
                    root.worksAddModal.style.display = "none";

                    const pictureOverviewElement = document.querySelector(".picture-overview");
                    
                    root.workPicture.style.display = "none";
                    pictureElement.style.display = "flex";
                    addImageButtonElement.style.display = "flex";
                    pElement.style.display = "flex";
                    pictureOverviewElement.style.padding = "16px 0px 20px 0px";
                    pictureOverviewElement.style.height = "142px";
                }
            }
            //Gestion de l'input qui permet de récupérer l'image d'un nouveau projet à ajouter
            const pictureInputElement = document.getElementById("picture-input");
            pictureInputElement.addEventListener("change", (input) => {
                console.log("Name : "+pictureInputElement.files[0].name);
                console.log("Size : "+pictureInputElement.files[0].size);
                console.log(window.URL.createObjectURL(pictureInputElement.files[0]));
                const pictureOverviewElement = document.querySelector(".picture-overview");

                console.log("testA : "+(root.workPicture.src));
                root.workPicture.src = window.URL.createObjectURL(pictureInputElement.files[0]);
                /*root.workPicture.onload = function () {
                    //window.URL.revokeObjectURL(this.src);
                    oldFileName = this.src;
                };*/
                console.log(root.workPicture.src);

                pictureElement.style.display = "none";
                addImageButtonElement.style.display = "none";
                pElement.style.display = "none";

                root.workPicture.style.display = "block";
                root.workPicture.style.width = "auto";
                root.workPicture.style.height = "100%";

                pictureOverviewElement.style.padding = "0px 0px 0px 0px";
                pictureOverviewElement.style.height = "178px";
                pictureOverviewElement.appendChild(root.workPicture);
                
                pictureInputElement.value = "";

            });
            this.update();
        },
        manage: function () {

        },
        add: function () {

        },
        remove: function () {

        },
        update: function () {
            root.Works_JSON = this.get();
        },
        get: async function () {
            //récupération des travaux sur le serveur    
            let json = await fetch("http://localhost:5678/api/works")
            .then((response) => {
                if (!response.ok)
                    console.log("Erreur lors de la récupération des données")
                    return false;
            })
            return json;
        }
    }.init();

    this.categories = {
        init: async function () {
            await this.update();
        },
        update: async function () {
            //récupération des catégories sur le serveur    
            let response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok)
                return false;
            root.Categories_JSON = await response.json();
            return true;
        }
    };

    await root.categories.init();

    this.menu = {
        init: function () {

            //récupération des éléments de page
            const loginButtonElement = document.querySelector(".login");
            const worksElement = document.querySelector(".works");

            //ajout d'un évènement "click" sur le bouton de login qui permet d'afficher la section login
            loginButtonElement.addEventListener("click",  () => {
                this.loginShow();
            });

            //ajout d'un évènement "click" sur le bouton de projets qui permet de masquer la section login
            worksElement.addEventListener("click",  () => {
                this.worksShow();
            });
        },
        worksShow: function () {
            //récupération des éléments de page
            const footerElement = document.querySelector("footer");
            const loginSectionElement = document.querySelector("#login");
            const introductionElement = document.querySelector("#introduction");
            const portfolioElement = document.querySelector("#portfolio");
            const contactElement = document.querySelector("#contact");

            portfolioElement.style.display = "block";
            footerElement.style.display = "block";
            introductionElement.style.display = "flex";
            contactElement.style.display = "block";
            loginSectionElement.style.display = "none";
        },
        loginShow: function () {
            //récupération des éléments de page
            const footerElement = document.querySelector("footer");
            const loginSectionElement = document.querySelector("#login");
            const introductionElement = document.querySelector("#introduction");
            const portfolioElement = document.querySelector("#portfolio");
            const contactElement = document.querySelector("#contact");

            portfolioElement.style.display = "none";
            footerElement.style.display = "none";
            introductionElement.style.display = "none";
            contactElement.style.display = "none";
            loginSectionElement.style.display = "block";
        },
        editorShow: function() {
            const filterbarElement = document.querySelector(".filterbar");
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            filterbarElement.style.display = "none";
            editorBarElement.style.display = "flex";
            worksModifyButtonElement.style.display = "flex";
            headerBarElement.style.margin = "80px 0px 50px 0px";
            
        },
        editorHide: function() {
            const filterbarElement = document.querySelector(".filterbar");
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            filterbarElement.style.display = "flex";
            editorBarElement.style.display = "none";
            worksModifyButtonElement.style.display = "none";
            headerBarElement.style.margin = "30px 0px 50px 0px";
        }
    };
    this.menu.init();

    this.login = {
        init: function () {
            const loginForm = document.querySelector("#login-form");
            loginForm.addEventListener("submit", async (event) => {
                
                //on empeche le rechargement de la page
                event.preventDefault();
                
                //récupération des valeurs des champs id et password
                const id = document.getElementById("id").value;
                const password = document.getElementById("password").value;

                console.log("ID : "+id+" | Password : "+password);

                console.log("On compare id et password avec la base donnée");
                await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: id,
                        password: password,
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    const loginButtonElement = document.querySelector(".login");
                    const logoutButtonElement = document.querySelector(".logout");
                    //on affiche la réponse
                    console.log(data);
                    if (data.error) {
                        //console.log(data.error);/*displays error message*/
                        console.log("Utilisateur non autorisé");
                        window.alert("Veuillez vérifier votre identifiant et/ou mot de passe");
                    } else {
                        if (data.message != "user not found") {
                            //enregistrement du token dans le localstorage
                            window.localStorage.setItem("token", data.token);
                            //affichage des éléments du mode édition
                            console.log("affichage du mode edition");
                            //récupération du token dans le localstorage
                            const token = window.localStorage.getItem("token");
                            //modification du menu
                            loginButtonElement.style.display = "none";
                            logoutButtonElement.style.display = "list-item";

                            document.getElementById("id").value = "";
                            document.getElementById("password").value = "";

                            root.menu.worksShow();
                            root.menu.editorShow();

                            if (data.token === token) {
                                console.log("Mode édition confirmé !");
                                window.alert("Vous êtes connecté");
                            }
                            //si logout
                            logoutButtonElement.addEventListener("click", function () {
                                console.log("Déconnexion en cours ...");
                                console.log(window.localStorage.getItem("token"));
                                window.localStorage.removeItem("token", "[]");
                                console.log(window.localStorage.getItem("token"));
                                loginButtonElement.style.display = "list-item";
                                logoutButtonElement.style.display = "none";
                                root.menu.editorHide();
                                console.log("Déconnecté !");
                                window.alert("Vous êtes déconnecté");
                            });
                        } else {
                            console.log("Utilisateur inconnu");
                            window.alert("Utilisateur inconnu");
                        }
                    }
                })
                /*.catch((err) => {
                    //console.log(err);
                });*/
            });
        },
        load: async function () {

        }
    };
    this.login.init();

    this.editor = {
        init: function () {
            root.worksManageModal.style.display = "none";
            const worksModifyButton = document.querySelector(".works-modify-button");
            worksModifyButton.addEventListener("click", function () {
                root.worksManageModal.style.display = "block";
            });
            const worksModifyCloseButton = document.querySelector(".works-manage .close-button");
            worksModifyCloseButton.addEventListener("click", function () {
                root.worksManageModal.style.display = "none";
            });
            const pictureInputElement = document.getElementById("picture-input");
            const worksSendButton = document.querySelector(".works-add .send-button");
            
            let workPicture = document.querySelector("#works-add #work-picture");
            let workTitle = document.querySelector("#works-add #work-title");
            let workCategory = document.querySelector("#works-add #work-category");
            worksSendButton.addEventListener("click", function () { //Faire un event "submit" au formulaire plutot qu'un event "click" sur la DIV "send-button"
                //fetch et actualisation de la liste des projet
                //here
                
                //récupération des valeurs du formulaire pour l'ajout d'un projet
                console.log("url : "+workPicture.src);
                console.log("title : "+workTitle.value);
                console.log("id : "+workCategory.selectedIndex);

                // Appel de la fonction fetch avec toutes les informations nécessaires
                fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data",
                        "Authorization": "Bearer "+localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        imageUrl: workPicture.src,
                        title: workTitle.value, //=> valeur de l'index
                        category: workCategory.selectedIndex,
                    }),
                });
                pictureInputElement.value = "";
                root.worksAddModal.style.display = "none";
            })
            //Nouvelle version
            worksSendForm.addEventListener("submit", function (event) {
                
                //on empeche le rechargement de la page
                event.preventDefault();

                let bodyForm = new FormData(event.target);

                fetch("http://localhost:5678/api/works", {
            
                    method: "POST",
                    headers: {
                        "Authorisation": "Bearer"+localStorage.getItem("token"),
                    },
                    body: bodyForm,
                })
            
            })

        },
        open: function () {

        },
        close: function () {

        }
    };
    this.editor.init();

})();

//initialisation des catégories
//sbScript.categories.init();

//const colis = await fetch("http://api.top-livraisons.fr/colis").then(colis => colis.json());
//const livreur = await fetch("http://api.top-livreurs.fr/livreurs/" + colis.livreurId).then(livreur => livreur.json());
/*fetch("/colis/livraison", {
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": // ...
});*/

/*const livreur = /* fonction fetch ;

// Récupération du localStorage ou initialisation de la liste de livreurs
let livreurs = window.localStorage.getItem("livreurs");
if (livreurs === null) { livreurs = []; }
else { livreurs = JSON.parse(livreurs); }

// Suppression du livreur s’il existe déjà
const indice = livreurs.find(liv => liv.id === livreur.id);
if (indice !== -1) { livreurs.splice(indice, 1); }

// Ajout du livreur et sauvegarde dans le localStorage
livreurs.push(livreur);
window.localStorage.setItem("livreurs", JSON.stringify(livreurs));*/

//pour vider entierement la liste des livreurs : setitem avec des crochets
//window.localStorage.setItem("livreurs", "[]");
