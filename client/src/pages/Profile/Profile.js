import React, {useState, useEffect} from 'react'

export default function Profile() {
    const [user, setUser] = useState({})

    useEffect(() => {
        const token = localStorage.getItem("example-app");

        if (token) {
          setAuthToken(token);
        }
    
        axios
          .get("api/user")
          .then((response) => {
              setUser(response.data)
          })
          .catch((err) => console.log(err.response));
      });
    
    return (
        <div>
            
        </div>
    )
}
