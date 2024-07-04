import "../styles/List.css";

import React, { Component, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";

import Card from "./Card";
import CardEditor from "./CardEditor";
import ListEditor from "./ListEditor";
// import AddIcon from '@mui/icons-material/Add';

import shortid from "shortid";
import axios from "axios";
import { set } from "mongoose";

function List(props) {
  const { listId, list, index ,dispatch,data} = props;
  const [state, setState] = useState({
    editingTitle: false,
    title: props.list.title,
    addingCard: false
  });
  const { editingTitle, addingCard, title } = state;


  const toggleAddingCard = () =>

    setState({ addingCard: !state.addingCard });



  const addCard = async (cardText) => {
    toggleAddingCard();

    const cardId = shortid.generate();
    const data = {
      cardText,
      cardId,
      listId
    }
    try {
      const response = await axios.post('http://localhost:5000/api/board/add', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      dispatch({
        type: "ADD_CARD",
        payload: { cardText: response.data.title, cardId: response.data._id, listId }
      });

    } catch (error) {
      console.log(error);
    }
  };

  const toggleEditingTitle = () =>
    setState({ editingTitle: !state.editingTitle });

  const handleChangeTitle = e => setState({ title: e.target.value });

  const editListTitle = async () => {
    const { listId, dispatch } = props;
    const { title } = state;
    toggleEditingTitle();
    dispatch({
      type: "CHANGE_LIST_TITLE",
      payload: { listId, listTitle: title }
    });
  };

  const deleteList = async () => {

    if (window.confirm("Are you sure to delete this list?")) {
      dispatch({
        type: "DELETE_LIST",
        payload: { listId, cards: list.cards }
      });
    }
  };


 

  return (


    <Draggable draggableId={list._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="List"
        >
          {editingTitle ? (
            <ListEditor
              list={list}
              title={title}
              handleChangeTitle={handleChangeTitle}
              saveList={editListTitle}
              onClickOutside={editListTitle}
              deleteList={deleteList}
            />
          ) : (
            <div className="List-Title" onClick={toggleEditingTitle}>
              {list.title}
            </div>
          )}

          <Droppable droppableId={list._id}>
            {(provided, _snapshot) => (
              <div ref={provided.innerRef} className="Lists-Cards">
                {list.cards &&
                  list.cards.map((cardId, index) => (
                    <Card
                      key={cardId}
                      cardId={cardId}
                      index={index}
                      listId={list._id}
                    />
                  ))}

                {provided.placeholder}

                {addingCard ? (
                  <CardEditor
                    onSave={addCard}
                    onCancel={toggleAddingCard}
                    adding
                  />
                ) : (
                  <div className="Toggle-Add-Card" onClick={toggleAddingCard}>
                    Add a card
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}


const mapStateToProps = (state, ownProps) => ({
  list: state.listsById[ownProps.listId]
});


export default connect(mapStateToProps)(List);


// const editListTitle = async () => {
//   const { listId, dispatch } = props;
//   const { title } = state;

//   try {
//     const response = await axios.put(
//       `http://localhost:5000/api/board/lists/${listId}`,
//       { title }, // Updated title
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     // Assuming the response.data contains the updated list data
//     dispatch({
//       type: "CHANGE_LIST_TITLE",
//       payload: { listId, listTitle: response.data.title }
//     });

//     toggleEditingTitle(); // Close the editing mode
//   } catch (error) {
//     console.error('Error editing list title:', error);
//   }
// };


// const deleteList = async () => {
//   if (window.confirm("Are you sure to delete this list?")) {
//     try {
//       await axios.delete(`http://localhost:5000/api/board/lists/${listId}`);

//       dispatch({
//         type: "DELETE_LIST",
//         payload: { listId, cards: list.cards }
//       });
//     } catch (error) {
//       console.error('Error deleting list:', error);
//     }
//   }
// };
