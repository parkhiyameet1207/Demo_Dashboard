import shortid from "shortid";

export default function seed(store) {
  console.log("Insert first list");
  const firstListId = shortid.generate();

  // store.dispatch({
  //   type: "ADD_LIST",
  //   payload: { listId: firstListId, listTitle: "First list" }
  // });



  // console.log("Insert second list");
  // const secondListId = shortid.generate();

  // store.dispatch({
  //   type: "ADD_LIST",
  //   payload: { listId: secondListId, listTitle: "Second list" }
  // });


};
