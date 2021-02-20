const initialState = {
    position: [14.734270, -91.154949],
    otherPositions: []
}
  
let dataPosition = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_POSITION': {

            //Obtener datos almacenados Res
            let position = action.payload.position;

            let newState = {
                ...state,
                position
            }

            return newState

        }

        case 'ADD_POSITION_TO_POSITIONS': {

            let newPosition = action.payload.newPosition

            let newState = {
                ...state,
                otherPositions: [...state.otherPositions, newPosition]
            }

            return newState

        }

        //break;
        default:
        return state
    }
}



export default dataPosition