const API_BASE_URL = "http://localhost:8080/api";


function getJWTToken() {
    return localStorage.getItem('token');
}


export async function createGroupAPI(groupData) {
    const token = getJWTToken();

    if (!token) {
        throw new Error("JWT token is not available in localStorage");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(groupData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const locationHeader = response.headers.get("Location");
        if (!locationHeader) {
            console.warn("No Location header in response");

            return null;
        }
    
        return locationHeader;
    } catch (error) {
        console.error("Error creating group via API:", error);
        throw error; // Rzucenie błędu do obsługi w wywołującym kodzie
    }
}

export async function fetchAllGroupsAPI() {
    const token = getJWTToken();
    if (!token) {
        throw new Error("Brak tokenu, zaloguj się.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/groups`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Otrzymane grupy:", data); // Debugowanie

        if (!Array.isArray(data)) {
            throw new Error("API zwróciło nieprawidłowy format danych (nie tablica)");
        }

        return data; // Zwracamy listę grup
    } catch (error) {
        console.error("Błąd podczas pobierania grup:", error);
        return [];
    }
}


async function getGroups() {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) throw new Error("Nie udało się pobrać listy grup");
    return response.json();
}

export async function getGroupDetails(groupId) {
    const token = getJWTToken(); // Pobieranie tokena
    if (!token) {
        throw new Error("Brak tokenu, zaloguj się.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/details`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Błąd podczas pobierania szczegółów grupy:", error);
        throw error; // Przekazujemy błąd do obsługi w kodzie wywołującym
    }
}



export async function getThreadsByGroup(groupId, page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/threads?page=${page}&size=${size}`);
    if (!response.ok) throw new Error("Nie udało się pobrać wątków");
    return response.json();
}
