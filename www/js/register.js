document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Hasła nie są zgodne!');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Rejestracja zakończona sukcesem!');
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            alert('Błąd rejestracji: ' + (error.message || 'Niepoprawne dane'));
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        alert('Nie można połączyć z serwerem.');
    }
});