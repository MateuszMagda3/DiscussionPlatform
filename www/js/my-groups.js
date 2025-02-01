import { fetchAllGroupsAPI } from "./api.js"; // Import nowej funkcji

document.addEventListener("DOMContentLoaded", function () {
    fetchUserGroups();
});

async function fetchUserGroups() {
    try {
        const groups = await fetchAllGroupsAPI(); // Pobranie wszystkich grup
        console.log("Wszystkie grupy:", groups); // Debugowanie

        const userGroups = groups.filter(group => 
            group.userStatus === "Owner" || 
            group.userStatus === "Moderator" || 
            group.userStatus === "Member"
        );

        console.log("Grupy użytkownika:", userGroups);

        const groupsList = document.getElementById("groupsList");
        groupsList.innerHTML = ""; // Czyszczenie listy

        userGroups.forEach(group => {
            const groupElement = document.createElement("div");
            groupElement.classList.add("col-md-4");

            let manageButton = "";
            if (group.userStatus === "Owner") {
                manageButton = `<a href="/manage-group.html?groupId=${group.id}" class="btn btn-warning">Zarządzaj</a>`;
            }

            let detailsButton = `<a href="/group-details.html?groupId=${group.id}" class="btn btn-primary">Szczegóły</a>`;

            groupElement.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${group.name}</h5>
                        <p class="card-text">${group.description}</p>
                        <p class="card-text"><small class="text-muted">Liczba członków: ${group.memberCount}</small></p>
                        ${detailsButton}
                        ${manageButton}
                    </div>
                </div>
            `;
            groupsList.appendChild(groupElement);
        });

        if (userGroups.length === 0) {
            groupsList.innerHTML = `<p>Nie należysz do żadnej grupy.</p>`;
        }
    } catch (error) {
        console.error("Błąd ładowania grup użytkownika:", error);
    }
}

