import React from 'react';

import { connect } from 'react-redux';

import { useMapEvents } from "react-leaflet";

function MyComponent(props) {

    const map = useMapEvents({
      click: () => {
        map.locate({enableHighAccuracy: true})
      },
      load: () => {
        map.locate({enableHighAccuracy: true}) 
      },
      locationfound: (location) => {

        let position = [location.latitude, location.longitude]
        props.dispatch({
          type: 'SET_POSITION',
          payload: {position}
        })
        //console.log('location found:', position)
      },
    })

    return null
}

let mapStateToProps = (state, props) => {
  return state
}

export default connect(mapStateToProps)(MyComponent)