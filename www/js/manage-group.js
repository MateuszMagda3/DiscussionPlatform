document.addEventListener("DOMContentLoaded", function () {
    const groupId = getGroupIdFromURL();
    if (groupId) {
        fetchGroupDetails(groupId);
        fetchJoinRequests(groupId);
    }


});

function getGroupIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("groupId");
}

function fetchGroupDetails(groupId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/details`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("groupName").value = data.name;
            document.getElementById("groupDescription").value = data.description;
            document.getElementById("groupTags").value = data.tags.join(", ");
            loadMembers(groupId, data.memberIds);
            loadModerators(groupId, data.moderatorIds);
        })
        .catch(error => console.error("Error loading group details:", error));
}

function fetchJoinRequests(groupId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/join-request`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(requests => {
        console.log("Join requests:", requests);
        displayJoinRequests(requests); 
    })
    .catch(error => console.error("Error fetching join requests:", error));
}

function displayJoinRequests(requests) {
    const joinRequestsList = document.getElementById("joinRequestsList");
    joinRequestsList.innerHTML = "";  // Czyścimy zawartość przed aktualizacją

    if (requests.length === 0) {
        joinRequestsList.innerHTML = "<p>Brak oczekujących próśb o dołączenie.</p>";
        return;
    }

    requests.forEach(request => {
        const requestElement = document.createElement("div");
        requestElement.classList.add("d-flex", "justify-content-between", "align-items-center", "border", "p-2", "mb-2");

        requestElement.innerHTML = `
            <span>${request.userName}</span>
            <div>
                <button class="btn btn-success btn-sm" onclick="approveJoinRequest(${request.userId})">Akceptuj</button>
                <button class="btn btn-danger btn-sm" onclick="rejectJoinRequest(${request.userId})">Odrzuć</button>
            </div>
        `;

        joinRequestsList.appendChild(requestElement);
    });
}

function approveJoinRequest(userId) {
    const groupId = getGroupIdFromURL();

    fetch(`http://localhost:8080/api/groups/${groupId}/join-request/${userId}/approve`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        alert("Prośba zaakceptowana!");
        location.reload();
    })
    .catch(error => console.error("Error approving join request:", error));
}

function rejectJoinRequest(userId) {
    const groupId = getGroupIdFromURL();

    fetch(`http://localhost:8080/api/groups/${groupId}/join-request/${userId}/reject`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        alert("Prośba odrzucona!");
        location.reload();
    })
    .catch(error => console.error("Error rejecting join request:", error));
}

function updateGroup(event) {
    event.preventDefault();
    const groupId = getGroupIdFromURL();
    const updatedGroup = {
        name: document.getElementById("groupName").value,
        description: document.getElementById("groupDescription").value,
    };

    fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedGroup),
    })
    .then(response => response.json())
    .then(() => alert("Grupa zaktualizowana!"))
    .catch(error => console.error("Error updating group:", error));
}

function deleteGroup() {
    const groupId = getGroupIdFromURL();
    if (confirm("Czy na pewno chcesz usunąć grupę?")) {
        fetch(`http://localhost:8080/api/groups/${groupId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            alert("Grupa usunięta");
            window.location.href = "/my-groups.html";
        })
        .catch(error => console.error("Error deleting group:", error));
    }
}

function loadMembers(groupId, memberIds) {
    const membersList = document.getElementById("membersList");
    membersList.innerHTML = "";
    
    memberIds.forEach(id => {
        fetch(`http://localhost:8080/api/users/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(user => {
            const memberElement = document.createElement("div");
            memberElement.classList.add("col-4");
            memberElement.innerHTML = `
                <p>${user.username}</p>
                <button class="btn btn-warning" onclick="promoteToModerator(${groupId}, ${id})">Promuj na modertora</button>
                <button class="btn btn-danger" onclick="removeMember(${groupId}, ${id})">Usuń z grupy</button>
            `;
            membersList.appendChild(memberElement);
        });
    });
}

function promoteToModerator(groupId, userId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/moderators/${userId}`, {  // userId w URL
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert("Failed to promote user");
        }
    });
}

function removeMember(groupId, userId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert("Failed to remove user");
        }
    });
}

function loadModerators(groupId, moderatorIds) {
    const moderatorsList = document.getElementById("moderatorsList");
    moderatorsList.innerHTML = "";
    
    moderatorIds.forEach(id => {
        fetch(`http://localhost:8080/api/users/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(user => {
            const moderatorElement = document.createElement("div");
            moderatorElement.classList.add("col-4");
            moderatorElement.innerHTML = `
                <p>${user.username}</p>
                <button class="btn btn-secondary" onclick="demoteModerator(${groupId}, ${id})">Usuń range moderatora</button>
            `;
            moderatorsList.appendChild(moderatorElement);
        });
    });
}

function demoteModerator(groupId, userId) {
    fetch(`http://localhost:8080/api/groups/${groupId}/moderators/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            alert("Failed to demote user");
        }
    });
}