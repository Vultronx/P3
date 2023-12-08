(async function script() {
    console.log("Execution du script principal")
    //racine du script
    const root = this;
    root.Works_JSON = null;
    root.Categories_JSON = null;

    //Récupération des catégories sur le serveur    
    const CATEGORIES_RESPONSE = await fetch("http://localhost:5678/api/categories");
    const CATEGORIES_JSON = await CATEGORIES_RESPONSE.json();

    //récupération des travaux sur le serveur    
    const WORKS_RESPONSE = await fetch("http://localhost:5678/api/works");
    let WORKS_JSON = await WORKS_RESPONSE.json();
 
    //pointeur sur la barre de filtre
    const FILTERBAR_ELEMENT = document.querySelector(".filterbar");

    //pointeur sur la galerie
    const GALLERY_ELEMENT = document.querySelector(".gallery");

    //pointeur sur l'apercu de la galerie en mode éditeur
    const WORKS_OVERVIEW_ELEMENT = document.querySelector(".works-manage .overview");

    this.worksManageModal = document.getElementById("works-manage");
    this.worksAddModal = document.getElementById("works-add");

    this.workPicture = document.querySelector("#works-add #work-picture");

    console.log("Ajout des catégories");
    appendCategories();
    console.log("Ajout des projets");
    appendWorks();

    //ajout des catégories dans la barre de filtre
    function appendCategories() {
        appendCategory({id: 0, name: 'Tous'});
        for (let i = 0; i < CATEGORIES_JSON.length; i++) {
            appendCategory(CATEGORIES_JSON[i]);
            console.log("=> "+CATEGORIES_JSON[i]);
        };
    };

    //ajout des projets dans la galerie
    function appendWorks(categoryId = 0) {
        console.log("=> "+WORKS_JSON.length);
        GALLERY_ELEMENT.innerHTML = "";
        WORKS_OVERVIEW_ELEMENT.innerHTML = "";
        for (let i = 0; i < WORKS_JSON.length; i++) {
            if (WORKS_JSON[i].category.id == categoryId || categoryId == 0) {
                appendWork(WORKS_JSON[i]);
                console.log("=> "+WORKS_JSON[i]);
            };
        };
    };

    //fonction permettant l'ajout d'une catégorie
    function appendCategory(category) {
        //déclaration des éléments à ajouter
        let pElement = document.createElement("p");
        let divElement = document.createElement("div");

        //définition du contenu des éléments
        pElement.innerHTML = category.name;
        divElement.className = "button";
        divElement.addEventListener("click",  () => {
            appendWorks(category.id);
        });

        //ajout des éléments dans FILTERBAR_ELEMENT
        divElement.appendChild(pElement);
        FILTERBAR_ELEMENT.appendChild(divElement);

        //ajout des catégories dans le l'élément select du formulaire works-send-form
        let categoriesSelectElement = document.getElementById("work-category");
        let optionElement = document.createElement("option");
        if (category.name != "Tous") {
            optionElement.value = category.id;
            optionElement.innerHTML = category.name;
            categoriesSelectElement.appendChild(optionElement);
        }
    };

    //fonction permettant l'ajout d'un projet dans la galerie
    function appendWork(work) {
        //déclaration des éléments à ajouter dans la galerie
        let figureElement = document.createElement("figure");
        let imageElement = document.createElement("img");
        let figcaptionElement = document.createElement("figcaption");

        //définition du contenu des éléments
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        figcaptionElement.innerHTML = work.title;

        //ajout de imageElement et figcaptionElement dans figureElement
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);

        //ajout des éléments dans GALLERY_ELEMENT
        GALLERY_ELEMENT.appendChild(figureElement);

        //création des éléments qui serviront à la gestion des projets
        let figureOverviewElement = document.createElement("figure");
        let imageOverviewElement = document.createElement("img");
        let deleteButtonElement = document.createElement("img");
        figureOverviewElement.style.display = "inline-block";
        figureOverviewElement.style.position = "relative";
        imageOverviewElement.src = work.imageUrl;
        imageOverviewElement.alt = work.title;
        deleteButtonElement.className = "deleteButton";
        deleteButtonElement.src = "./assets/icons/trash.png";
        deleteButtonElement.alt = "x";
        deleteButtonElement.style.position = "absolute";
        deleteButtonElement.style.top = "5px";
        deleteButtonElement.style.right = "5px";
        deleteButtonElement.style.cursor = "pointer";
        deleteButtonElement.style.zIndex = "1";

        //Ajout d'un évènement click sur deleteButtonElement pour la supression du projet
        deleteButtonElement.addEventListener("click", async () => {
            await fetch("http://localhost:5678/api/works/"+work.id, { //demande de suppression du projet sur le serveur
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer "+window.localStorage.getItem("token"),
                }
            })
            .then((response) => {
                if (response.ok) { //si la suppression est confirmée, on supprime le projet du DOM
                    figureElement.remove();
                    figureOverviewElement.remove();
                } else {
                    return false;
                }
            })
        });
        
        //Ajout de imageOverviewElement et deleteButtonElement dans worksOverviewElement pour la gestion des projets
        figureOverviewElement.appendChild(imageOverviewElement);
        figureOverviewElement.appendChild(deleteButtonElement);
        WORKS_OVERVIEW_ELEMENT.appendChild(figureOverviewElement);
    };

    //fonction de gestion et d'ajout de projet
    (function worksManage() {
        const addButtonElement = document.querySelector(".works-manage .add-button");
        const previousButtonElement = document.querySelector(".works-add .previous-button");
        const closeButtonElement = document.querySelector(".works-add .close-button");

        const pictureElement = document.querySelector(".picture");
        const addImageButtonElement = document.querySelector(".add-image-button");
        const pElement = document.querySelector(".picture-overview p");

        addButtonElement.addEventListener("click", () => {
            const pictureOverviewElement = document.querySelector(".picture-overview");

            root.worksManageModal.style.display = "none";
            root.worksAddModal.style.display = "block";

            pictureElement.style.display = "flex";
            addImageButtonElement.style.display = "flex";
            pElement.style.display = "flex";
            pictureOverviewElement.style.padding = "16px 0px 20px 0px";
            pictureOverviewElement.style.height = "142px";

            resetAddWorkForm();
        });
        previousButtonElement.addEventListener("click", () => {
            root.worksManageModal.style.display = "block";
            root.worksAddModal.style.display = "none";
            root.workPicture.style.display = "none";
        });
        closeButtonElement.addEventListener("click", () => {                
            root.workPicture.style.display = "none";
            //fermeture de la modale par appel aux nodes parents
            closeButtonElement.parentNode.parentNode.style.display = "none";
        });
        window.onclick = function(event) {
            if (event.target == this.worksManageModal) {
                root.worksManageModal.style.display = "none";
            } else if (event.target == this.worksAddModal) {
                root.worksAddModal.style.display = "none";
                root.workPicture.style.display = "none";
            }
        }
        //Gestion de l'input qui permet de récupérer l'image d'un nouveau projet à ajouter
        const pictureInputElement = document.getElementById("picture-input");
        pictureInputElement.addEventListener("change", () => {
            if (pictureInputElement.files[0]) {
                if (pictureInputElement.files[0].size / 1048576 < 1) {
                    console.log("Name : "+pictureInputElement.files[0].name);
                    console.log("Size : "+pictureInputElement.files[0].size);
                    const pictureOverviewElement = document.querySelector(".picture-overview");

                    root.workPicture.src = window.URL.createObjectURL(pictureInputElement.files[0]);
                    
                    pictureElement.style.display = "none";
                    addImageButtonElement.style.display = "none";
                    pElement.style.display = "none";

                    root.workPicture.style.display = "block";
                    root.workPicture.style.width = "auto";
                    root.workPicture.style.height = "100%";

                    pictureOverviewElement.style.padding = "0px 0px 0px 0px";
                    pictureOverviewElement.style.height = "178px";
                    pictureOverviewElement.appendChild(root.workPicture);
                } else {
                    pictureInputElement.value = "";
                    window.alert("L'image doit faire moins de 4mo");
                }
            } else {
                window.alert("Veuillez choisir une image pour le projet"); 
            }           
        });


        const worksModifyButton = document.querySelector(".works-modify-button");
        worksModifyButton.addEventListener("click", function () {
            root.worksManageModal.style.display = "block";
        });

        const worksManageCloseButton = document.querySelector(".works-manage .close-button");
        worksManageCloseButton.addEventListener("click", function () {
            root.worksManageModal.style.display = "none";
        });

        const workSendForm = document.querySelector("#works-send-form");
        workSendForm.addEventListener("submit", async (event) => { //Gestion du formulaire d'ajout de projet
            event.preventDefault();

            const formData = new FormData(event.target);
            let state = 0;

            await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer "+window.localStorage.getItem("token"),
                },
                body: formData,
            })
            .then((response) => {
                state++;
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.error) {
                    state++;
                }
            })
            if (state == 1) {
                let response = await fetch("http://localhost:5678/api/works");
                let json = await response.json();
                appendWork(json[json.length-1]);
                root.worksAddModal.style.display = "none"; //
                root.workPicture.style.display = "none"; 
                state = 0;
                window.alert("Le projet a bien été ajouté");
            } else {
                root.worksAddModal.style.display = "block"; //
                root.workPicture.style.display = "none"; 
                window.alert("Veuillez choisir une image pour le projet"); //alert(data.error);
            }
            
        });

        //Function de réinitialisation du formulaire d'ajout de projet
        function resetAddWorkForm() {
            const pictureInputElement = document.getElementById("picture-input");
            const workTitle = document.getElementById("work-title");
            const workCategory = document.getElementById("work-category");
            pictureInputElement.value = "";
            workTitle.value = "";
            workCategory.getElementsByTagName('option')[0].selected = 'selected'
        }
        //mise à jour de la liste des projets des projets
        worksUpdate();
    })();

    //Function permettant la mise à jour des projets
    async function worksUpdate() {
        const json = await fetch("http://localhost:5678/api/works")
        .then((response) => {
            if (!response.ok)
                console.log("Erreur lors de la récupération des projets")
                return false;
        })
        root.Works_JSON = json;
    }

    //Objet permettant de gérer les différents du site
    this.menu = {
        init: function () {

            //récupération des éléments de page
            const loginButtonElement = document.querySelector(".login");
            const worksElement = document.querySelector(".works");

            //ajout d'un évènement "click" sur le bouton de login qui permet d'afficher la section login
            loginButtonElement.addEventListener("click",  () => {
                console.log("Affichage de la page de connexion");
                this.loginShow();
            });

            //ajout d'un évènement "click" sur le bouton de projets qui permet de masquer la section login
            worksElement.addEventListener("click",  () => {
                console.log("Fermeture de la page de connexion");
                this.worksShow();
            });
        },
        worksShow: function () { //Affichage de la galerie
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
        loginShow: function () { //Affichage de section login
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
        editorShow: function() { //Affichage du mode édition
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            FILTERBAR_ELEMENT.style.display = "none";
            editorBarElement.style.display = "flex";
            worksModifyButtonElement.style.display = "flex";
            headerBarElement.style.margin = "80px 0px 50px 0px";
            
        },
        editorHide: function() { //Masquage du mode édition
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            FILTERBAR_ELEMENT.style.display = "flex";
            editorBarElement.style.display = "none";
            worksModifyButtonElement.style.display = "none";
            headerBarElement.style.margin = "30px 0px 50px 0px";
        }
    };
    this.menu.init();

    //Fonction du formulaire de login
    (function login() {
            const loginForm = document.querySelector("#login-form");
            loginForm.addEventListener("submit", async (event) => {
                
                //on empeche le rechargement de la page
                event.preventDefault();
                
                //récupération des valeurs des champs id et password
                const id = document.getElementById("id").value;
                const password = document.getElementById("password").value;

                console.log("Tentative de connexion ...")
                console.log("ID : "+id+" | Password : "+password);

                //nn essaye de se connecter
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
                    if (data.error) {
                        //console.log(data.error);/*displays error message*/
                        console.log("Utilisateur non autorisé");
                        window.alert("Veuillez vérifier votre identifiant et/ou mot de passe");
                    } else {
                        if (data.message != "user not found") {

                            console.log("Connexion autorisée");
                            window.alert("Vous êtes connecté");
                            console.log("Stockage du token d'identification");
                            //stokage du token dans le localstorage
                            window.localStorage.setItem("token", data.token);

                            //modification du menu
                            loginButtonElement.style.display = "none";
                            logoutButtonElement.style.display = "list-item";

                            //on prépapre le bouton logout pour que l'utilisateur puisse de déconnecter
                            logoutButtonElement.addEventListener("click", function () {
                                window.localStorage.removeItem("token", "[]");
                                loginButtonElement.style.display = "list-item";
                                logoutButtonElement.style.display = "none";
                                root.menu.editorHide();
                                console.log("Déconnexion");
                                window.alert("Vous êtes déconnecté");
                            });

                            //réinitialisation du formulaire de connexion
                            document.getElementById("id").value = "";
                            document.getElementById("password").value = "";

                            //On affichage la page des projets et le mode éditeur
                            root.menu.worksShow();
                            root.menu.editorShow();
                            console.log("Affichage du mode édition");

                        } else {
                            window.alert("Utilisateur inconnu");
                            console.log("Utilisateur inconnu");
                        }
                    }
                })
            });
    })();

})();