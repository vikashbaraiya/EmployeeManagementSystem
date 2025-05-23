import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import {  Link } from 'react-router-dom';
// import Button from 'material-ui/Button';
// import DeleteIcon from '@material-ui/icons/Delete';
// import Icon from '@material-ui/core/Icon';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import './list.css'

function StudentList() {
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
        const path = 'SCM/studentlist/'
        const response = await fetch(path);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      const filteredData = data.filter(item =>
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filteredData);
    }, [searchTerm, data]);
  
    // Calculate total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    // Calculate index range for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const navigate = useNavigate();
  
    
  
    // Handle pagination navigation
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
  
    };
  
    const handleEdit = async (id) => {
        navigate(`/student/update/${id}`)
      };
      
   
    
      const handleDelete = async (id) => {
        try {
          // Send delete request to the backend API
          const response = await fetch(`/SCM/student/delete/${id}/`, {
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
  
  
  
     
    // Get items for current page
    const currentItems = filteredData.slice(startIndex, endIndex);
  
    console.log(filteredData)
  
    return (
        <div className='table-container'>
          <div className='row'>
          <h2>Student Table</h2>
            <div className='col-md-3' style={{marginRight:'-100px',marginTop:'10px'}}><Link  className='buttonLink' to="/student/add">Add<i className="fa fa-plus" aria-hidden="true"></i></Link>
            </div>
            <div className='col-md-9'>
            
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '1rem', width: '60%' }}
            />
            </div>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            {/* Table headers */}
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Dob</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Update</TableCell>
              <TableCell>Delete</TableCell>
              {/* Add more table headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Table rows */}
            {currentItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.dob}</TableCell>
                <TableCell>{item.mobileNumber}</TableCell>
                <TableCell>{item.college_ID.collegeName}</TableCell>
                <TableCell><button className='formButton' onClick={() => handleEdit(item.id)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button></TableCell>
                <TableCell><button className='formButton' onClick={() => handleDelete(item.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></button></TableCell>

                {/* Add more table cells if needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.root}>
      <Stack spacing={2}>
      <Pagination      sx={{ margin: '30px', padding: '10px' }} // Adjust margin and padding as needed
         count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
    </Stack>
        
      </div>
    </div>
    );
}


export default StudentList;
