document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createThreadForm");
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    if (!form) {
        console.error("Błąd: Formularz o ID 'createThreadForm' nie istnieje.");
        return;
    }

    if (!groupId) {
        console.error("Błąd: Brak identyfikatora grupy w URL.");
        document.querySelector("main").innerHTML = "<p class='alert alert-danger'>Błąd: Brak identyfikatora grupy.</p>";
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const titleElement = document.getElementById("threadTitle");
        const contentElement = document.getElementById("threadContent");
        const tagsElement = document.getElementById("threadTags");

        if (!titleElement || !contentElement || !tagsElement) {
            console.error("Błąd: Nie znaleziono wymaganych pól formularza.");
            return;
        }

        const title = titleElement.value.trim();
        const content = contentElement.value.trim();
        const tags = tagsElement.value.trim().split(",").map(tag => tag.trim()).filter(tag => tag !== "");

        if (!title || !content) {
            alert("Tytuł i treść wątku nie mogą być puste!");
            return;
        }

        const threadData = { title, content, tags };

        try {
            await createThread(groupId, threadData);
            alert("Wątek został utworzony!");
            window.location.href = `/group-details.html?groupId=${groupId}`;
        } catch (error) {
            alert("Błąd podczas tworzenia wątku: " + error.message);
        }
    });
});

async function createThread(groupId, threadData) {
    const response = await fetch(`http://localhost:8080/api/groups/${groupId}/threads`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"},
        body: JSON.stringify(threadData),
    });

    if (!response.ok) {
        throw new Error("Nie udało się utworzyć wątku.");
    }
}

