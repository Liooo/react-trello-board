import faker from 'faker';

export const GET_LISTS_START = 'GET_LISTS_START';
export const GET_LISTS = 'GET_LISTS';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_LIST = 'MOVE_LIST';
export const TOGGLE_DRAGGING = 'TOGGLE_DRAGGING';

export function getLists(quantity) {
  return dispatch => {
    dispatch({ type: GET_LISTS_START, quantity });
    setTimeout(() => {
      const lists = [];
      let count = 0;
      for (let i = 0; i < quantity; i++) {
        const cards = [];
        // else if(i== 1){ const randomQuantity = 1 }
        // else {
        let randomQuantity;
        // }
        if(i==0){
          randomQuantity = 1
        }else if(i==1){
          randomQuantity = 0
        }else{
          randomQuantity =  Math.floor(Math.random() * (9 - 1 + 1)) + 10;
        }
        for (let ic = 0; ic < randomQuantity; ic++) {
          cards.push({
            id: count,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            title: faker.name.jobTitle()
          });
          count = count + 1;
        }
        lists.push({
          id: i,
          name: faker.commerce.productName(),
          cards
        });
      }
      dispatch({ type: GET_LISTS, lists, isFetching: true });
    }, 1000); // fake delay
    dispatch({ type: GET_LISTS_START, isFetching: false });
  };
}

export function moveList(lastListIndex, nextListIndex) {
  return (dispatch) => {
    dispatch({ type: MOVE_LIST, lastListIndex, nextListIndex });
  };
}

export function moveCard(lastListIndex, lastCardIndex, nextListIndex, nextCardIndex) {
  return (dispatch) => {
    dispatch({ type: MOVE_CARD, lastListIndex, lastCardIndex, nextListIndex, nextCardIndex });
  };
}

export function toggleDragging(isDragging) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_DRAGGING, isDragging });
  };
}
