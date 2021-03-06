import { baseUrl, handleResponse } from '../helpers/helpers' 
import { getToken } from './auth'

export const setCurrentDetail = (detailId) => {
    return (dispatch) => {
        dispatch({type: "SET_CURRENT_DETAIL", payload: detailId})
    }
}

export const completeDetail = (detail) => {
    return (dispatch) => {
        return fetch(`${baseUrl}/details/${detail.id}/complete`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: getToken()
            },
            body: JSON.stringify({status: detail.completed})
        })
        .then(res => {
            return handleResponse(res, (json) => {
                dispatch({
                    type: 'COMPLETE_DETAIL', 
                    payload: {detail: detail, status: detail.completed}
                })
            })
        })
    }
}

export const addDetail = (content, currentTask, currentUser, deadline) => {
    return (dispatch) => {
        return fetch(`${baseUrl}/details`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: getToken()
            },
            body: JSON.stringify({
                content: content, 
                task_id: currentTask.id, 
                creator_id: currentUser.id,
                deadline: deadline
            })
        })
        .then(res => {
            return handleResponse(res, (json) => {
                dispatch({ type: "ADD_DETAIL", payload: json.detail})
                dispatch({ type: "SET_CURRENT_DETAIL", payload: json.detail.id })
                dispatch({
                    type: "SET_USER_SELECTED", 
                    payload: {
                        'selected_detail': json.detail.id
                    }
                })
            })
        })
    }
}

export const deleteDetail = (detailId) => {
    return (dispatch) => {
        return fetch(`${baseUrl}/details/${detailId}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: getToken()
            }
        })
        .then(res => {
            return handleResponse(res, (json) => {
                dispatch({type: 'DELETE_DETAIL', payload: detailId})
                dispatch({type: 'SET_USER_SELECTED', payload: {selected_detail: null}})
            })
        })
    }
}




export const updateDetail = (detailId, param) => {
    return (dispatch) => {
        return fetch(`${baseUrl}/details/${detailId}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: getToken()
            },
            body: JSON.stringify({detail: param})
        })
        .then(res => {
            return handleResponse(res, (json) => {
                dispatch({type: 'UPDATE_DETAIL', payload: json.detail})
                dispatch({type: 'SET_CURRENT_DETAIL', payload: json.detail})
            })
        })
    }
}


