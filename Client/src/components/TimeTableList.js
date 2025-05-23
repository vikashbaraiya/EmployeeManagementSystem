import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import { useNavigate } from "react-router-dom";
import {  Link } from 'react-router-dom';


import './list.css';

function TimeTableDataTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // This ensures fetchData runs once on mount

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const fetchData = async () => {
    try {
      const path = 'SCM/timetablelist/';
      const response = await fetch(path);
      const jsonData = await response.json();
      setData(jsonData.data);
      // setFilteredData(jsonData.data); // Update filteredData separately
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const filteredData = data.filter(item =>
      item.semester.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const navigate = useNavigate();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleEdit = async (id) => {
    navigate(`/timetable/update/${id}`)
  };

  const handleDelete = async (id) => {
    try {
      // Send delete request to the backend API
      const response = await fetch(`/SCM/timetable/delete/${id}/`, {
        method: 'DELETE'
      });

      // Check if the delete request was successful
      if (response.ok) {
        // Remove the deleted item from the data state
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        console.log("Item deleted successfully with ID:", id);
      } else {
        console.error('Failed to delete item:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiPagination-ul': {
        justifyContent: 'center', // Align pagination items to center
        marginTop: '520px',
        marginLeft: "250px"
      },
      '& .MuiPagination-root ':{
        marginTop: '50px',
        height:"21px",
      },
      '& .MuiPaginationItem-root': {
        color: '#1c375b', // Change text color of pagination items
      },
      '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#1c375b', // Change background color of selected page
        color: 'white', // Change text color of selected page
      },
    },
    
  }));

  const classes = useStyles();

  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <div className='table-container'>
      <div className='row'>
      <h2>Time Table</h2>
      <div className='col-md-3' style={{marginRight:'-100px',marginTop:'10px'}}><Link  className='buttonLink' to="/faculty/add">Add<i className="fa fa-plus" aria-hidden="true"></i></Link>
            </div>
        <div className='col-md-9'>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', width: '50%' }}
      />
       </div>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Exam Time</TableCell>
              <TableCell>Exam Date</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.examTime}</TableCell>
                <TableCell>{item.examDate}</TableCell>
                <TableCell>{item.subject_ID.subjectName}</TableCell>
                <TableCell>{item.course_ID.courseName}</TableCell>
                <TableCell>{item.semester}</TableCell>
                <TableCell><button className='formButton' onClick={() => handleEdit(item.id)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button></TableCell>
                <TableCell><button className='formButton' onClick={() => handleDelete(item.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box component='section' className={classes.root}>
        <Stack spacing={2}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
        </Stack>
      </Box>
    </div>
  );
}

export default TimeTableDataTable;