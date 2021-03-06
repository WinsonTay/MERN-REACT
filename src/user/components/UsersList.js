import React from 'react'
import UserItem from './Useritem'
import './UsersList.css'
const UserLists = props =>{

    if (props.items.length ===0 ){
        return <div className='center'>
            <h2>No Users Found</h2>
        </div>
    }
    return (
        <ul className ='users-list'>
            {props.items.map(user=>{
                return <UserItem key ={user.id} 
                        id={user.id} 
                        image={user.image}
                        name={user.name}
                        placeCount={user.places.length}/>
            })}
        </ul>

    )
}

export default UserLists