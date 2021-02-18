import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function Chat() {
    const { id } = useParams();

    return (
        <div>
            <h1>Chat</h1>
        </div>
    )
}
