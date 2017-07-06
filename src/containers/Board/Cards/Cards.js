import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import Card from './DraggableCard';
import { CARD_WIDTH, CARD_MARGIN, OFFSET_WIDTH } from '../../../constants.js';


const FIRST_CARD_LEFT = 31
function getPlaceholderIndex(x, scrollLeftTip) {
  // shift placeholder if x position more than card width / 2
  // console.log("---", x, scrollLeftTip)
  const xPos = x + scrollLeftTip - FIRST_CARD_LEFT;
  let placeholderIndex;
  if (xPos < CARD_WIDTH / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((xPos - CARD_WIDTH / 2) / (CARD_WIDTH + CARD_MARGIN));
  }
  return placeholderIndex;
}

const specs = {
  drop(props, monitor, component) {
    document.getElementById(monitor.getItem().id).style.display = 'block';
    const { placeholderIndex } = component.state;
    const lastListIndex = monitor.getItem().listIndex;
    const lastCardIndex = monitor.getItem().cardIndex;
    const nextListIndex = props.listIndex;
    let nextCardIndex = placeholderIndex;
    console.log('list from', lastListIndex, 'to', nextListIndex)
    console.log('card from', lastCardIndex, 'to', nextCardIndex)
    if (lastCardIndex > nextCardIndex) { // move top
      nextCardIndex += 1;
    } else if (lastListIndex !== nextListIndex) { // insert into another list
      nextCardIndex += 1;
    }

    if (lastListIndex === nextListIndex && lastCardIndex === nextCardIndex) { // if position equel
      return;
    }

    props.moveCard(lastListIndex, lastCardIndex, nextListIndex, nextCardIndex);
  },
  hover(props, monitor, component) {
    // defines where placeholder is rendered
    let dom = findDOMNode(component)
    const placeholderIndex = getPlaceholderIndex(
      monitor.getClientOffset().x,
      findDOMNode(component).scrollLeft
   );

    // console.log("hover!")
    // vertical scroll
    if (!props.isScrolling) {
      if (window.innerHeight - monitor.getClientOffset().y < 200) {
        // props.startScrolling('toBottom');
      } else if (monitor.getClientOffset().y < 200) {
        // props.startScrolling('toTop');
      }
    } else {
      if (window.innerHeight - monitor.getClientOffset().y > 200 &&
          monitor.getClientOffset().y > 200
      ) {
        props.stopScrolling();
      }
    }

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({ placeholderIndex });
    
    // when drag begins, we hide the card and only display cardDragPreview
    const item = monitor.getItem();
    document.getElementById(item.id).style.display = 'none';
  }
};


@DropTarget('card', specs, (connectDragSource, monitor) => ({
  connectDropTarget: connectDragSource.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  item: monitor.getItem()
}))
export default class Cards extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    cards: PropTypes.array.isRequired,
    listIndex: PropTypes.number.isRequired,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    canDrop: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined,
      isScrolling: false,
    };
  }

  render() {
    const { connectDropTarget, listIndex, cards, isOver, canDrop } = this.props;
    const { placeholderIndex } = this.state;

    let isPlaceHold = false;
    let cardList = [];
    let placeHolder = <div key="placeholder" className="item placeholder">placeholder!</div>
    cards.forEach((item, i) => {
      if (isOver && canDrop) {
        isPlaceHold = false;
        if (i === 0 && placeholderIndex === -1) {
          cardList.push(placeHolder);
        } else if (placeholderIndex > i) {
          isPlaceHold = true;
        }
      }
      if (item !== undefined) {
        cardList.push(
          <Card listIndex={listIndex} cardIndex={i}
            item={item}
            key={item.id}
            stopScrolling={this.props.stopScrolling}
          />
        );
      }
      if (isOver && canDrop && placeholderIndex === i) {
        cardList.push(placeHolder);
      }
    });

    // if placeholder index is greater than array.length, display placeholder as last
    if (isPlaceHold) {
      cardList.push(placeHolder);
    }

    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && canDrop && cards.length === 0) {
      cardList.push(placeHolder);
    }

    return connectDropTarget(
      <div className="desk-items">
        {cardList}
      </div>
    );
  }
}
