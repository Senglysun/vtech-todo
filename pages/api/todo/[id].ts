import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;
  const docRef = doc(db, "todos", `${id}`);

  if (req.method === "DELETE") {
  
    deleteDoc(docRef);
    res.status(200).json({ response: `success` });
  } else if (req.method === "PUT") {
    const updateTodo = {
      ...req.body,
      todo: req.body.todo,
      createdAt: serverTimestamp()
    };
    updateDoc(docRef, updateTodo);
    res.status(200).json({ response: `success` });
  }
  else if (req.method === "PATCH") {
    const updateTodo = {
      ...req.body,
      isComplete: req.body.isComplete,
      createdAt: serverTimestamp()
    };
    updateDoc(docRef, updateTodo);
    res.status(200).json({ response: `success` });
  }
};
