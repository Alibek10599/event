import React, {useEffect, useState, useRef} from "react";
import axios from 'axios'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import TablePagination from "@mui/material/TablePagination";



export default function App() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false);

  const initTransferEvents = (async ()=>{
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/parse-events');
      console.log('Fetched events:', response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  })
  
  const fetchData = useRef(async () => {
     await axios({
      method: "GET",
      baseURL: `http://localhost:9000/events` //?pageSize=${pageSize}&pageNumber=${page}`
    }).then((res) => {
      console.log(res.data)
      setEvents(res.data.events);
      setTotal(res.data.total)
    });
  })

  useEffect(() => {
    fetchData.current();
  }, []);

  const { current: handleChangePage } = useRef((e, newPage) => {
    const { value } = e.target;
    if (!value) {
      setPage(newPage);
    } else {
      setPage(0);
      setPageSize(value);
    }
  });

  const { current: handleChangeRowsPerPage } = useRef(e => {
    setPage(0);
    setPageSize(+e.target.value);
  });

  return (
    <div>
        <Paper>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} 
                    aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell align="right">amount
                            </TableCell>
                            <TableCell align="right">blockNumber
                            </TableCell>
                            <TableCell align="right">from
                            </TableCell>
                            <TableCell align="right">to
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.slice(page * pageSize, page * pageSize + pageSize).map((row) => (
                            <TableRow
                                key={row._id}
                            >
                                <TableCell component="th" scope="row">
                                    {row._id}
                                </TableCell>
                                <TableCell align="right">{row.amount}
                                </TableCell>
                                <TableCell align="right">{row.blockNumber}
                                </TableCell>
                                <TableCell align="right">{row.from}
                                </TableCell>
                                <TableCell align="right">{row.to}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>

        <Button 
        sx={{ mt:2, ml:3 }} 
        variant="contained"
        disabled={loading}
        onClick={initTransferEvents}
        >Fetch Events</Button>
    </div>
  );
}

