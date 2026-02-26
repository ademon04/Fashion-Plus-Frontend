import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  console.log('🔵 AdminLogin renderizado'); 
  console.log('🔵 login function:', login); 

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('═══════════════════════════════════'); 
    console.log('🚀 FORMULARIO ENVIADO'); 
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password:', credentials.password ? '***' : 'VACÍO'); 
    console.log('═══════════════════════════════════'); 
    
    setLoading(true);
    setError('');

    try {
      console.log('⏳ Llamando a login()...'); 
      const result = await login(credentials.email, credentials.password);
      console.log('📥 Resultado de login():', result); 
      
      if (result.success) {
        console.log('✅ Login exitoso, navegando a dashboard...');
        navigate('/admin/dashboard');
      } else {
        console.log(' Login falló:', result.error); 
      }
    } catch (error) {
      console.error(' ERROR CATCH:', error); 
      console.error(' ERROR STACK:', error.stack); 
      setError('Error al iniciar sesión');
    } finally {
      console.log(' Finalizando...');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;