document.addEventListener("DOMContentLoaded", function () {
    const groupsList = document.getElementById("groupsList");

    fetch("http://localhost:8080/api/groups", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(groups => {
            groupsList.innerHTML = "";

            groups.forEach(group => {
                // Filtrujemy tylko grupy, gdzie userStatus to "Open" lub "Pending"
                if (group.userStatus === "Open" || group.userStatus === "Pending") {
                    const groupCard = document.createElement("div");
                    groupCard.classList.add("col-md-4");

                    let actionContent = "";

                    if (group.userStatus === "Open") {
                        actionContent = `<button class="btn btn-primary join-btn" data-group-id="${group.id}">Dołącz</button>`;
                    } else if (group.userStatus === "Pending") {
                        actionContent = `<p class="text-warning">Prośba o dołączenie oczekuje na zatwierdzenie</p>`;
                    }

                    groupCard.innerHTML = `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${group.name}</h5>
                                <p class="card-text">${group.description}</p>
                                <p><strong>Członkowie:</strong> ${group.memberCount}</p>
                                ${actionContent}
                            </div>
                        </div>
                    `;

                    groupsList.appendChild(groupCard);
                }
            });

            document.querySelectorAll(".join-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const groupId = this.getAttribute("data-group-id");
                    joinGroup(groupId);
                });
            });
        })
        .catch(error => console.error("Błąd podczas pobierania grup:", error));
});

function joinGroup(groupId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/join-request`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Wysłano prośbę o dołączenie do grupy!");
            location.reload(); // Odśwież stronę, aby zaktualizować status
        } else {
            alert("Błąd podczas dołączania do grupy.");
        }
    })
    .catch(error => console.error("Błąd:", error));
}

