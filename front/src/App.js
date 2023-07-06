import React, {useEffect, useState} from "react";
import axios from 'axios'


export default function App() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  useEffect(() => {
    axios({
      method: "GET",
      baseURL: `http://localhost:9000/events?pageSize=${pageSize}&pageNumber=${page}`
    }).then((res) => {
      console.log(res.data)
      setEvents(res.data);
    });
  }, []);
  return (
    <div>
      {events &&
        events.map(item =>{
          return <h1>{item._id}</h1>
        })
      }
    </div>
  );
}

