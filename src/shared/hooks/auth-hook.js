import {useEffect, useCallback, useState } from 'react'
let logoutTimer;
export const useAuth = () => {
    
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(null);
    const [TokenExpiredTime , setTokenExpiration] = useState();
    
    const login = useCallback( (uid,token, expirationDate)=> {
      setToken(token);
      setUserId(uid);
                                  //  If no expirationDate , then create a new expirationDate 
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
      setTokenExpiration(tokenExpirationDate)
      localStorage.setItem('userData', JSON.stringify({userId:uid ,token:token , expiration:tokenExpirationDate.toISOString()}))
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null)
      setTokenExpiration(null)
      localStorage.removeItem('userData')
    }, []); 
    useEffect(()=>{
      const storedData = JSON.parse(localStorage.getItem('userData'))
      if (storedData && storedData.token && new Date(storedData.expiration)  > new Date()){
         login(storedData.userId, storedData.token, new Date(storedData.expiration))
      }
  
    },[login])
  
    useEffect(()=>{
      if (token && TokenExpiredTime){
        const remainingTime = TokenExpiredTime.getTime() - new Date().getTime();
        logoutTimer= setTimeout(logout, remainingTime)
      }else{
        clearTimeout(logoutTimer)
      }
    },[token ,logout,TokenExpiredTime])
  
    return {token ,login ,logout , userId}
}