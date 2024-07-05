import "../styles/Board.css";

import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import List from "./List";
import AddList from "./AddList";

function Board(props) {
  const [state, setState] = useState({ addingList: false });

  const toggleAddingList = async () => {
    setState({ addingList: !state.addingList });
  }

  const handleDragEnd = ({ source, destination, type }) => {
    console.log("source 👌👌👌👌👌",destination);
    if (!destination) return;

    const { dispatch } = props;

    // Move list
    if (type === "COLUMN") {
      if (source.index !== destination.index) {
        dispatch({
          type: "MOVE_LIST",
          payload: {
            oldListIndex: source.index,
            newListIndex: destination.index
          }
        });
      }
      return;
    }

    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      dispatch({
        type: "MOVE_CARD",
        payload: {
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          oldCardIndex: source.index,
          newCardIndex: destination.index
        }
      });  
    }
  };

  const { board } = props;
  const { addingList } = state;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="COLUMN">
        {(provided, _snapshot) => (
          <div className="Board" ref={provided.innerRef}>
            {board?.lists.map((listId, index) => {
              return <List listId={listId} key={listId} index={index} />;
            })}

            {provided.placeholder}

            <div className="Add-List">
              {addingList ? (
                <AddList toggleAddingList={toggleAddingList} />
              ) : (
                <div
                  onClick={toggleAddingList}
                  className="Add-List-Button"
                >
                  <ion-icon name="add" /> Add a list
                </div>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

}

const mapStateToProps = state => ({ board: state.board });

export default connect(mapStateToProps)(Board);



// // Board.js
// import "../styles/Board.css";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable } from "react-beautiful-dnd";

// import List from "./List";
// import AddList from "./AddList";

// function Board() {
//   const [board, setBoard] = useState([]);
//   const [addingList, setAddingList] = useState(false);

//   useEffect(() => {
//     const fetchBoard = async () => {
//       const response = await axios.get("http://localhost:5000/board");
//       setBoard(response.data);
//     };
//     fetchBoard();
//   }, []);

//   const toggleAddingList = () => {
//     setAddingList(!addingList);
//   };

//   const handleDragEnd = async ({ source, destination, type }) => {
//     if (!destination) return;

//     // Move list
//     if (type === "COLUMN") {
//       if (source.index !== destination.index) {
//         await axios.post("http://localhost:5000/move-list", {
//           oldListIndex: source.index,
//           newListIndex: destination.index
//         });
//         const updatedBoard = [...board];
//         const listToMove = updatedBoard.splice(source.index, 1)[0];
//         updatedBoard.splice(destination.index, 0, listToMove);
//         setBoard(updatedBoard);
//       }
//       return;
//     }

//     // Move card
//     if (
//       source.index !== destination.index ||
//       source.droppableId !== destination.droppableId
//     ) {
//       await axios.post("http://localhost:5000/move-card", {
//         sourceListId: source.droppableId,
//         destListId: destination.droppableId,
//         oldCardIndex: source.index,
//         newCardIndex: destination.index
//       });
//       const updatedBoard = [...board];
//       const sourceListIndex = updatedBoard.findIndex(
//         list => list._id === source.droppableId
//       );
//       const destListIndex = updatedBoard.findIndex(
//         list => list._id === destination.droppableId
//       );
//       const cardToMove = updatedBoard[sourceListIndex].cards.splice(source.index, 1)[0];
//       updatedBoard[destListIndex].cards.splice(destination.index, 0, cardToMove);
//       setBoard(updatedBoard);
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Droppable droppableId="board" direction="horizontal" type="COLUMN">
//         {(provided, _snapshot) => (
//           <div className="Board" ref={provided.innerRef}>
//             {board.map((list, index) => (
//               <List list={list} key={list._id} index={index} />
//             ))}
//             {provided.placeholder}
//             <div className="Add-List">
//               {addingList ? (
//                 <AddList toggleAddingList={toggleAddingList} />
//               ) : (
//                 <div onClick={toggleAddingList} className="Add-List-Button">
//                   <ion-icon name="add" /> Add a list
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// }

// export default Board;
