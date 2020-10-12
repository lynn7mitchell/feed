import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./post.css";
import axios from "axios";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState({});

  useEffect(() => {
    axios
      .get("/specificPost", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return <div></div>;
}
