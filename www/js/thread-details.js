document.addEventListener("DOMContentLoaded", function () {
    const threadId = new URLSearchParams(window.location.search).get("threadId");
    const groupId = new URLSearchParams(window.location.search).get("groupId");

    loadThreadDetails(threadId, groupId);
    loadComments(threadId);

    document.getElementById("addCommentForm").addEventListener("submit", function (event) {
        event.preventDefault();
        addComment(threadId);
    });
});

function getThreadIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("threadId");
}

async function loadThreadDetails(threadId, groupId) {
    try {
        const response = await fetch(`http://localhost:8080/api/groups/${groupId}/threads/${threadId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Błąd ładowania wątku");
        const thread = await response.json();
        document.getElementById("threadTitle").innerText = thread.title;
        document.getElementById("threadContent").innerText = thread.content;
    } catch (error) {
        console.error("Błąd pobierania szczegółów wątku:", error);
    }
}

async function loadComments(threadId, page = 0, size = 10) {
    try {
        const response = await fetch(`http://localhost:8080/api/comments/${threadId}?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Błąd ładowania komentarzy");
        const data = await response.json();
        
        const commentsContainer = document.getElementById("commentsList");
        commentsContainer.innerHTML = "";
        data.content.forEach(comment => {
            commentsContainer.innerHTML += renderComment(comment);
        });
    } catch (error) {
        console.error("Błąd pobierania komentarzy:", error);
    }
}

function renderComment(comment) {
    return `
        <div class="comment" id="comment-${comment.id}">
            <p>${comment.content}</p>
            <p>Polubienia: ${comment.likeCount}</p>
            <button onclick="likeComment(${comment.id})">Like</button>
            <button onclick="unlikeComment(${comment.id})">Unlike</button>
            <button onclick="reportComment(${comment.id})">Zgłoś</button>
            <button onclick="deleteComment(${comment.id})">Usuń</button>
        </div>
    `;
}

async function addComment(threadId) {
    const content = document.getElementById("commentContent").value;
    if (!content) return;
    try {
        const response = await fetch(`http://localhost:8080/api/comments/${threadId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) throw new Error("Błąd dodawania komentarza");
        document.getElementById("commentContent").value = "";
        loadComments(threadId);
    } catch (error) {
        console.error("Błąd dodawania komentarza:", error);
    }
}

async function likeComment(commentId) {
    try {
        await fetch(`http://localhost:8080/api/comments/${commentId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        loadComments(getThreadIdFromURL());
    } catch (error) {
        console.error("Błąd polubienia komentarza:", error);
    }
}

async function unlikeComment(commentId) {
    try {
        await fetch(`http://localhost:8080/api/comments/${commentId}/unlike`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        loadComments(getThreadIdFromURL());
    } catch (error) {
        console.error("Błąd odlubienia komentarza:", error);
    }
}

async function deleteComment(commentId) {
    try {
        await fetch(`http://localhost:8080/api/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        loadComments(getThreadIdFromURL());
    } catch (error) {
        console.error("Błąd usuwania komentarza:", error);
    }
}

async function reportComment(commentId) {
    try {
        await fetch(`http://localhost:8080/api/comments/${commentId}/report`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        alert("Komentarz zgłoszony");
    } catch (error) {
        console.error("Błąd zgłaszania komentarza:", error);
    }
}