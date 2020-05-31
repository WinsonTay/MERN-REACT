import React from 'react'
import Card from '../../../shared/components/UIElement/Card'
import PlaceItem from './PlaceItem'
import Button from '../../../shared/components/FormElements/Button'
import './PlaceList.css'

const PlaceList = (props) => {
   if (props.items.length ===0) {
       return <div className='place-list center'>
           <Card>
                <h2>No places Found. Maybe Create One ?</h2>
                <Button to='/places/new'>Share Places</Button>

           </Card>
       </div>
   }
    return(
        <ul className='place-list'>
        {props.items.map(place => <PlaceItem key ={place.id}
                                        id={place.id}
                                        title ={place.title}
                                        description={place.description}
                                        address ={place.address}
                                        image = {place.image}
                                        creatorID ={place.creator}
                                        coordinates={place.location}
                                        onDelete = {props.onDeletePlace}
                                        />
                                        )}

            
        </ul>
)


};export default PlaceList