import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import useCookie from '../components/useCookie'

const HISTORY_HOST = process.env.REACT_APP_HISTORY_HOST ? process.env.REACT_APP_HISTORY_HOST : "http://localhost:5000/api/history"

function QuestionHistoryPage() {
    const [data, setData] = useState("welcome to the qsn history page")
    const [history, setHistory] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const { getAuthCookie } = useCookie()
  
    const token = getAuthCookie()
    const tokenBody = token.split('.')[1]
    let buffer = JSON.parse(atob(tokenBody))
    const user_id = buffer.user_data.user_id
    console.log(user_id)

    useEffect(() => {
        const response  = axios.get(HISTORY_HOST, {
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': getAuthCookie()
            }, })
            .then(response => {
                if (response.status === 403) {
                  // Handle the forbidden error
                  return response.then(err => { throw err })
                }
                setData(response.data)
                console.log(response.data)
              })
            .catch(error => {
                console.error('Error:', error);
                return;
            })

    }, [getAuthCookie])
    

    return <div>~~ {data} ~~</div>  
}

export default QuestionHistoryPage;