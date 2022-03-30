import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebase";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const collectionRef = collection(db, "todos");
  if (req.method === "GET") {
    const qr = query(collectionRef, orderBy("createdAt", "desc"));
    onSnapshot(qr, (querySnapshot: any) => {
      var data = querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
        todo: doc.data().todo,
        isComplete: doc.data().isComplete,
        createdAt: doc.data().createdAt?.toDate().getTime(),
      }));
      res.status(200).json(data);
    });
  } else if (req.method === 'POST') {
    const todo = req.body.todo
    addDoc(collectionRef, {
        todo: todo,
        createdAt: serverTimestamp(),
        isComplete: false,
    });
    res.status(201).json({response : 'success'});
  }
}
