import { getGroupDetails} from "./api.js"; // Dodaj poprawny import

document.addEventListener("DOMContentLoaded", async function () {
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    if (!groupId) {
        console.error("Błąd: Brak identyfikatora grupy w URL.");
        document.getElementById("groupDetails").innerHTML = "<p class='alert alert-danger'>Błąd: Brak identyfikatora grupy.</p>";
        return;
    }

    const groupDetailsContainer = document.getElementById("groupDetails");
    const membersListContainer = document.getElementById("membersList");
    const threadsListContainer = document.getElementById("threadsList");
    const threadCount = document.getElementById("threadCount");
    const createThreadButton = document.getElementById("createThreadButton");

    if (!groupDetailsContainer) {
        console.error("Błąd: Element #groupDetails nie istnieje w DOM.");
        return;
    }

    if (createThreadButton) {
        createThreadButton.href = `create-thread.html?groupId=${groupId}`;
    } else {
        console.error("Błąd: Nie znaleziono przycisku #createThreadButton.");
    }

    try {
        const group = await getGroupDetails(groupId);
        const ownerName = await fetchUserName(group.ownerId);

        renderGroupDetails(group, ownerName);
        await renderGroupMembers(group.memberIds, group.moderatorIds, membersListContainer);
        await renderThreads(groupId, threadsListContainer, threadCount);
    } catch (error) {
        console.error("Błąd podczas pobierania danych grupy:", error);
        groupDetailsContainer.innerHTML = `<p class='alert alert-danger'>Błąd: ${error.message}</p>`;
    }
});

function renderGroupDetails(group, ownerName) {
    const groupDetailsContainer = document.getElementById("groupDetails");
    if (!groupDetailsContainer) {
        console.error("Błąd: Element #groupDetails nie istnieje w DOM.");
        return;
    }

    groupDetailsContainer.innerHTML = `
        <h2>${group.name}</h2>
        <p><strong>Opis:</strong> ${group.description}</p>
        <p><strong>Właściciel:</strong> ${ownerName}</p>
    `;
}

async function renderThreads(groupId, container, threadCountElement) {
    if (!container) {
        console.error("Błąd: Element #threadsList nie istnieje w DOM.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/groups/${groupId}/threads`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Otrzymana odpowiedź API (threads):", data);

        if (!data || !data.content || !Array.isArray(data.content)) {
            container.innerHTML = "<p class='text-muted'>Brak wątków w tej grupie.</p>";
            threadCountElement.textContent = "Liczba wątków: 0";
            return;
        }

        const threads = data.content;
        threadCountElement.textContent = `Liczba wątków: ${data.totalElements}`;

        // Pobierz nazwy użytkowników dla wszystkich wątków równocześnie
        const authorNames = await Promise.all(
            threads.map(thread => fetchUserName(thread.authorId))
        );

        container.innerHTML = threads.map((thread, index) => `
            <div class="col-md-12">
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><a href="thread-details.html?threadId=${thread.id}&groupId=${groupId}">${thread.title}</a></h5>
                        <p class="card-text">${thread.content.substring(0, 150)}...</p>
                        <p class="text-muted">Autor: ${authorNames[index]} | Komentarze: ${thread.commentCount}</p>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Błąd podczas pobierania wątków:", error);
        container.innerHTML = `<p class='alert alert-danger'>Nie udało się pobrać listy wątków.</p>`;
    }
}

async function fetchUserName(userId) {
    if (!userId) return "Nieznany użytkownik";

    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`Błąd API: ${response.status} ${response.statusText}`);
            return "Nieznany użytkownik";
        }

        const user = await response.json();
        return user.username || "Nieznany użytkownik";
    } catch (error) {
        console.error("Błąd podczas pobierania użytkownika:", error);
        return "Nieznany użytkownik";
    }
}

async function renderGroupMembers(memberIds, moderatorIds, container) {
    if (!container) {
        console.error("Błąd: Element #membersList nie istnieje w DOM.");
        return;
    }

    if (!memberIds.length && !moderatorIds.length) {
        container.innerHTML = "<p class='text-muted'>Brak członków w tej grupie.</p>";
        return;
    }

    try {
        const members = await fetchUserNames(memberIds);
        const moderators = await fetchUserNames(moderatorIds);

        container.innerHTML = `
            <h3>Moderatorzy</h3>
            ${moderators.length ? generateUserList(moderators, "moderator") : "<p class='text-muted'>Brak moderatorów.</p>"}
            
            <h3>Członkowie</h3>
            ${members.length ? generateUserList(members, "member") : "<p class='text-muted'>Brak członków.</p>"}
        `;
    } catch (error) {
        console.error("Błąd podczas pobierania członków grupy:", error);
        container.innerHTML = `<p class='alert alert-danger'>Nie udało się pobrać listy członków.</p>`;
    }
}

async function fetchUserNames(userIds) {
    if (!userIds.length) return [];

    try {
        const requests = userIds.map(userId =>
            fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }).then(response => response.ok ? response.json() : null)
        );

        const users = await Promise.all(requests);
        return users.filter(user => user !== null).map(user => ({
            id: user.userId,
            name: user.username
        }));

    } catch (error) {
        console.error("Błąd podczas pobierania użytkowników:", error);
        return [];
    }
}

function generateUserList(users, role) {
    return `
        <div class="row">
            ${users.map(user => `
                <div class="col-md-4">
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${user.name}</h5>
                            <p class="card-text">${role === "moderator" ? "Moderator" : "Członek"}</p>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

