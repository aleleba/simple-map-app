import React, { Component } from 'react';

import { gql } from "apollo-boost";

//import { createClient } from 'graphql-ws';

import { apiUrl, wwUrl } from './ApiUrl';

import { connect } from 'react-redux';


import ChangeView from './ChangeView';
import LocateControl from './LocateControl';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import './App.css';


class App extends Component {

  async componentDidMount(){

    let This = this

    this.props.client.subscribe({
      query: gql`
      subscription { 
        newPosition 
      }
    `,
      variables: {}
    }).subscribe({
      next (res) {
        This.props.dispatch({
          type: 'ADD_POSITION_TO_POSITIONS',
          payload: {
            newPosition: res.data.newPosition
          }
        })
        // Notify your application with the new arrived data
      }
    })

  }

  render(){

    return (
      <MapContainer id="map-template" center={this.props.position} zoom={19} scrollWheelZoom={true} whenCreated={(map)=> {

        let query = {
          "query": `
            mutation {
              newPosition(position: ${JSON.stringify(this.props.position)})
            }
          `
        }
    
        const options = {
          method: 'post',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(query),
          credentials: 'include'
        }
      
        //llamada de datos con Fetch
        fetch(apiUrl, options)
        .then(res => res.json())
        .then( (res) => {
          this.props.dispatch({
            type: 'SET_POSITION',
            payload: {
              position: res.data.newPosition
            }
          })
        })

        map.locate({enableHighAccuracy: true})
        map.setView(this.props.position, 19);

      }} >
        <ChangeView center={this.props.position} zoom={19}/>
        <LocateControl startDirectly/>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={this.props.position}>
          <Popup>
            Tu estas aqui
          </Popup>
        </Marker>

        {
          this.props.otherPositions.map( (position, i) => (
            <Marker key={i} position={position}>
              <Popup>
                Otro marcador
              </Popup>
            </Marker>
          ))
        }

      </MapContainer>
    );
  }
}

let mapStateToProps = (state, props) => {
  return {
    client: state.apolloClient.client,
    position: state.dataPosition.position,
    otherPositions: state.dataPosition.otherPositions
  }
}

export default connect(mapStateToProps)(App)