document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const token = await response.text();


            localStorage.removeItem('token');
            localStorage.setItem('token', token);

            window.location.href = 'dashboard.html';
        } else {
            const error = await response.json();
            alert('Błąd logowania: ' + (error.message || 'Niepoprawne dane'));
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        alert('Nie można połączyć z serwerem.');
    }
});