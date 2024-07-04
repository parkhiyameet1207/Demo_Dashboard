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


// import "../styles/List.css";
// import React, { useEffect, useState } from "react";
// import { Droppable, Draggable } from "react-beautiful-dnd";
// import axios from "axios";
// import Card from "./Card";
// import CardEditor from "./CardEditor";
// import ListEditor from "./ListEditor";
// import shortid from "shortid";

// function List(props) {
//   const { listId, index } = props;
//   const [list, setList] = useState(null);
//   const [state, setState] = useState({
//     editingTitle: false,
//     title: "",
//     addingCard: false,
//   });
//   const { editingTitle, addingCard, title } = state;

//   useEffect(() => {
//     const fetchList = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/board/lists`);
//         const list = response.data.find(list => list._id === listId);
//         setList(list);
//         setState({ ...state, title: list.title });
//       } catch (error) {
//         console.error("Error fetching list:", error);
//       }
//     };
//     fetchList();
//   }, [listId]);

//   const toggleAddingCard = () => setState({ ...state, addingCard: !state.addingCard });

//   const addCard = async (cardText) => {
//     toggleAddingCard();
//     const cardId = shortid.generate();
//     const data = { cardText, cardId, listId };
//     try {
//       const response = await axios.post('http://localhost:5000/api/board/add', data, {
//         headers: { 'Content-Type': 'application/json' }
//       });
//       setList(prevList => ({ ...prevList, cards: [...prevList.cards, cardId] }));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const toggleEditingTitle = () => setState({ ...state, editingTitle: !state.editingTitle });

//   const handleChangeTitle = e => setState({ ...state, title: e.target.value });

//   const editListTitle = async () => {
//     // Implement edit list title functionality
//   };

//   const deleteList = async () => {
//     // Implement delete list functionality
//   };

//   return list ? (
//     <Draggable draggableId={list._id} index={index}>
//       {(provided, snapshot) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="List"
//         >
//           {editingTitle ? (
//             <ListEditor
//               list={list}
//               title={title}
//               handleChangeTitle={handleChangeTitle}
//               saveList={editListTitle}
//               onClickOutside={editListTitle}
//               deleteList={deleteList}
//             />
//           ) : (
//             <div className="List-Title" onClick={toggleEditingTitle}>
//               {list.title}
//             </div>
//           )}

//           <Droppable droppableId={list._id}>
//             {(provided, _snapshot) => (
//               <div ref={provided.innerRef} className="Lists-Cards">
//                 {list.cards && list.cards.map((cardId, index) => (
//                   <Card key={cardId} cardId={cardId} index={index} listId={list._id} />
//                 ))}

//                 {provided.placeholder}

//                 {addingCard ? (
//                   <CardEditor onSave={addCard} onCancel={toggleAddingCard} adding />
//                 ) : (
//                   <div className="Toggle-Add-Card" onClick={toggleAddingCard}>
//                     Add a card
//                   </div>
//                 )}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       )}
//     </Draggable>
//   ) : null;
// }

// export default List;
