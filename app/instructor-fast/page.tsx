export default function FastInstructorLogin() {
  return (
    <html>
      <head>
        <title>Instructor Login</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', padding: '50px' }}>
        <h1>Instructor Login</h1>
        <form id="loginForm" style={{ maxWidth: '300px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label><br/>
            <input 
              type="email" 
              id="email" 
              value="instructor@coastedcode.com" 
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label><br/>
            <input 
              type="password" 
              id="password" 
              value="instructor123" 
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <button 
            type="button" 
            onclick="handleLogin()" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
        
        <script>
          async function handleLogin() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
              const response = await fetch('/api/instructor/simple-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
              });
              
              const data = await response.json();
              
              if (response.ok && data.success) {
                localStorage.setItem('instructorToken', data.token);
                localStorage.setItem('instructorData', JSON.stringify(data.instructor));
                window.location.href = '/instructor/dashboard';
              } else {
                alert('Login failed: ' + (data.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Network error: ' + error.message);
            }
          }
        </script>
      </body>
    </html>
  )
}
