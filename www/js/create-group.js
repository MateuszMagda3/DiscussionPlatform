import { createGroupAPI } from './api.js';

document.getElementById("createGroupForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const groupName = document.getElementById("groupName").value.trim();
    const groupDescription = document.getElementById("groupDescription").value.trim();
    const errorElement = document.getElementById("formError");
    
    errorElement.textContent = "";
    errorElement.style.display = "none";
    
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    const sanitizedGroupName = sanitizeInput(groupName);
    const sanitizedGroupDescription = sanitizeInput(groupDescription);
    
    // Walidacja danych
    if (sanitizedGroupName.length < 1 || sanitizedGroupName.length > 50) {
        errorElement.textContent = "Nazwa grupy musi mieć od 1 do 50 znaków.";
        errorElement.style.display = "block";
        return;
    }
    
    if (sanitizedGroupDescription.length < 1 || sanitizedGroupDescription.length > 250) {
        errorElement.textContent = "Opis grupy musi mieć od 1 do 250 znaków.";
        errorElement.style.display = "block";
        return;
    }
    
    try {
        const groupData = { name: sanitizedGroupName, description: sanitizedGroupDescription };
        const location = await createGroupAPI(groupData);

        if (location) {
            alert(`Grupa została utworzona`);
            document.getElementById("createGroupForm").reset();
        }
    } catch (error) {
        alert("Wystąpił błąd podczas tworzenia grupy.");
    }
});

