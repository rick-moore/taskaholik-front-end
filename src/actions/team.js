import { baseUrl } from '../helpers/helpers'

export const populateTeams = (userId, preSelectId) => {
    return async (dispatch) => {
        return await fetch(`${baseUrl}/teams?userId=${userId}`)
        .then((res) => res.json())
        .then((teams) => {
            dispatch({ type: "POPULATE_TEAMS", payload: teams })
            dispatch({ type: "SET_CURRENT_TEAM", payload: preSelectId })
        })
    }
};

export const setCurrentTeam = (teamId) => {
    return (dispatch) => {
        dispatch({type: "CLEAR_PROJECTS"})
        dispatch({type: "CLEAR_TASKS"})
        dispatch({type: "CLEAR_DETAILS"})
        dispatch({type: "SET_CURRENT_TEAM", payload: Number(teamId)})
    }
}

export const addTeam = (teamName, currentUser) => {
    return (dispatch) => {
        return fetch(`${baseUrl}/teams`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                team: {
                    name: teamName, 
                    user_id: currentUser.id
                }
            })
        })
        .then(res => res.json())
        .then(json => {
            let team = json.team
            team.members = []
            team.leader = currentUser.username
            dispatch({type: 'ADD_TEAM', payload: json.team})
            return json
        })
    }
}

export const addMember = (query, teamId) => {
    return (dispatch) => {
        fetch(`${baseUrl}/memberships`, {
            method: 'POST',
            headers: {
                'Accept': 'applicaiton/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({membership: {query: query, team_id: teamId}})
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch({type: "ADD_MEMBER", payload: {member: json.member, teamId: teamId}})
        })
        .catch(err => console.log(err))
    }
}

export const removeMember = (memberId, teamId) => {
    return (dispatch) => {
        fetch(`${baseUrl}/memberships`, {
            method: 'DELETE',
            headers: {
                'Accept': 'applicaiton/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({membership: {user_id: memberId, team_id: teamId}})
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            dispatch({type: "REMOVE_MEMBER", payload: {memberId: memberId, teamId: teamId}})
        })
        .catch(err => console.log(err))
    }
}