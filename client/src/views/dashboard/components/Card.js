import "../styles/Card.css";

import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";

import CardEditor from "./CardEditor";
import axios from "axios";

function Card(props) {

const [state,setState] = useState({
  hover: false,
  editing: false
})
 const startHover = () => setState({ hover: true });
 const endHover = () => setState({ hover: false });

 const startEditing = () =>
    setState({
      hover: false,
      editing: true,
      text: props.card.text
    });

  const endEditing = () => setState({ hover: false, editing: false });
  const editCard = async (text) => {
    console.log("this.props", props);
    const { card, dispatch } = props;


    try {
      const response = await axios.put(
        `http://localhost:5000/api/board/lists/${card._id}`,
        { title: text }, // Updated title
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Put data", response);
      // Assuming the response.data contains the updated list data
      dispatch({
        type: "CHANGE_CARD_TEXT",
        payload: { cardId: card._id, cardText: text }
      });

      toggleEditingTitle(); // Close the editing mode
    } catch (error) {
      console.error('Error editing list title:', error);
    }
  };

  
  const toggleEditingTitle = () =>
    setState({ editingTitle: !state.editingTitle });

  const deleteCard = async () => {
    const { cardId, card, dispatch } = props;
    if (window.confirm("Are you sure to delete this list?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/board/lists/${cardId}`);
        dispatch({
          type: "DELETE_CARD",
          payload: { cardId, cards: card.text }
        });
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };



    const { card, index } = props;
    const { hover, editing } = state;

    if (!editing) {
      return (
        <Draggable draggableId={card._id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="Card"
              onMouseEnter={startHover}
              onMouseLeave={endHover}
            >
              {hover && (
                <div className="Card-Icons">
                  <div className="Card-Icon" onClick={startEditing}>
                    <ion-icon name="create" />
                  </div>
                </div>
              )}

              {card.text}
            </div>
          )}
        </Draggable>
      );
    } else {
      return (
        <CardEditor
          text={card.text}
          onSave={editCard}
          onDelete={deleteCard}
          onCancel={endEditing}
        />
      );
    }
  }


const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId]
});

export default connect(mapStateToProps)(Card);
