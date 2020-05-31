import React , {useEffect,useState} from 'react'
import PlaceList from '../pages/components/PlaceList'
import { useParams  } from 'react-router-dom'
import useHttpClient from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElement/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner'

const UserPlaces =  (props) => {
    const userId = useParams().userId
    const [loadedPlaces, setUserPlaces] = useState([])
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    
    useEffect(()=> {
        const fetchUserPlaces = async () =>{
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
                setUserPlaces(responseData.userPlaces)
            } catch (err) {}
        }
        fetchUserPlaces();
        
    }, [sendRequest, userId])
    
    const deletePlaceHandler = (id) =>{
        setUserPlaces(prevPlace => prevPlace.filter((place)=> place.id !== id ))
    }
    return(
        <React.Fragment>
            {isLoading && 
            <div className='center'>
                <LoadingSpinner asOverlay/>
            </div>}
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlaces &&  <PlaceList items = {loadedPlaces} onDeletePlace = {deletePlaceHandler}/>}
        </React.Fragment>
    );

};export default UserPlaces