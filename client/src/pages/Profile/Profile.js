import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import axios from "axios";
export default function Profile() {
  const { id } = useParams();

  useEffect(() => {
    console.log(id)
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

   

    axios.get('/api/notCurrentUser', {
      params: {
        username: id
      }
    })
    .then((res) => {console.log(res.data)})
    .catch((err) => console.log(err));
   
  }, []);

  return <div>Welcome</div>;
}
