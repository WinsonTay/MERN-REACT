import React, {useEffect, useState} from 'react';
import useHttpClient from '../../shared/hooks/http-hook'
import UsersList from  '../components/UsersList'
import ErrorModal from '../../shared/components/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner'


const Users = () => {
  const [loadedUser, setLoadedUser] =  useState()
  const {isLoading, error, sendRequest , clearError} = useHttpClient()

  useEffect(()=> {
    const fetchUsers = async ()=>{
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users');
        setLoadedUser(responseData.users)
        
      } catch (err) {}
    };
    fetchUsers()
  },[sendRequest])
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && 
      <div className='center'>
        <LoadingSpinner/>
      </div>}
      {!isLoading && loadedUser && <UsersList items = {loadedUser}></UsersList>}
    </React.Fragment>
    
  )
};

export default Users;
