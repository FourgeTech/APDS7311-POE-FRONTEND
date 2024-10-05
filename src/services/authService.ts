export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
  
    if (!token) return false;
  
    // Check token expiration (you can decode the JWT and verify expiration)
    const decoded = JSON.parse(atob(token.split('.')[1]));  // Decode base64 JWT payload
    const currentTime = Date.now() / 1000;
  
    return decoded.exp > currentTime;  
};