import { Record } from 'immutable';

import {
  GET_LISTS,
  GET_LISTS_START,
  MOVE_CARD,
  MOVE_LIST,
  TOGGLE_DRAGGING
} from '../actions/lists';

/* eslint-disable new-cap */
const InitialState = Record({
  isFetching: false,
  lists: [],
  isDragging: false
});
/* eslint-enable new-cap */
const initialState = new InitialState;


export default function lists(state = initialState, action) {
  switch (action.type) {
    case GET_LISTS_START:
      return state.set('isFetching', true);
    case GET_LISTS:
      return state.withMutations((ctx) => {
        ctx.set('isFetching', false)
            .set('lists', action.lists);
      });
    case MOVE_CARD: {
      const newLists = [...state.lists];
      const { lastListIndex, lastCardIndex, nextListIndex, nextCardIndex } = action;
      if (lastListIndex === nextListIndex) {
        newLists[lastListIndex].cards.splice(nextCardIndex, 0, newLists[lastListIndex].cards.splice(lastCardIndex, 1)[0]);
      } else {
        // move element to new place
        newLists[nextListIndex].cards.splice(nextCardIndex, 0, newLists[lastListIndex].cards.splice(lastCardIndex, 1)[0]);
      }
      return state.withMutations((ctx) => {
        ctx.set('lists', newLists);
      });
    }
    case MOVE_LIST: {
      const newLists = [...state.lists];
      const { lastListIndex, nextListIndex } = action;
      const t = newLists.splice(lastListIndex, 1)[0];

      newLists.splice(nextListIndex, 0, t);

      return state.withMutations((ctx) => {
        ctx.set('lists', newLists);
      });
    }
    case TOGGLE_DRAGGING: {
      return state.set('isDragging', action.isDragging);
    }
    default:
      return state;
  }
}
