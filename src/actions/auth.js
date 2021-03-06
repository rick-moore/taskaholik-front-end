import { baseUrl, currentTeam, currentProject, currentTask, currentDetail } from '../helpers/helpers' 

const setToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("lastLoginTime", new Date(Date.now()).getTime());
};

export const getToken = () => {
  const now = new Date(Date.now()).getTime();
  const thirtyMinutes = 1000 * 60 * 30;
  const timeSinceLastLogin = now - localStorage.getItem("lastLoginTime");
  if (timeSinceLastLogin < thirtyMinutes) {
    return localStorage.getItem("token");
  }
};

export const signupUser = (credentials) => {
    return (dispatch) => {
      return fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: credentials })
      }).then((res) => {
        if (res.ok) {
          setToken(res.headers.get("Authorization"));
          return res
            .json()
            .then((userJson) =>
              dispatch({ type: 'AUTHENTICATED', payload: userJson })
            );
        } else {
          return res.json().then((errors) => {
            dispatch({ type: 'NOT_AUTHENTICATED' });
            return Promise.reject(errors.status.message);
          });
        }
      });
    };
};

export const loginUser = (credentials) => {
    return async (dispatch) => {
        return fetch(`${baseUrl}/login`, {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: credentials }),
        })
        .then((res) => {
          if (res.ok) {
            setToken(res.headers.get("Authorization"));
            return res.json()
            .then((userJson) => {
              dispatch({ type: 'AUTHENTICATED', payload: userJson.data })
              return userJson
            })
          } else {
            return res.json()
            .then((errors) => {
              dispatch({ type: 'NOT_AUTHENTICATED' });
              return Promise.reject(errors.error);
            });
          }
        });
    };
};
  
export const logoutUser = () => {
    return (dispatch) => {
        return fetch(`${baseUrl}/logout`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getToken()
        },
        }).then((res) => {
        if (res.ok) {
            dispatch({type: 'CLEAR_DETAILS'})
            dispatch({type: 'CLEAR_TASKS'})
            dispatch({type: 'CLEAR_PROJECTS'})
            dispatch({type: 'CLEAR_TEAMS'})
            return dispatch({ type: 'NOT_AUTHENTICATED' });

        } else {
            return res.json().then((errors) => {
            dispatch({ type: 'NOT_AUTHENTICATED' });
            return Promise.reject(errors);
            });
        }
        });
    };
};

export const checkAuth = () => {
    return (dispatch) => {
      return fetch(`${baseUrl}/current_user`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: getToken()
        }
      }).then((res) => {
        if (res.ok) {
          return res.json().then(user => dispatch({type: 'AUTHENTICATED', payload: user}))
        } else {
          return Promise.reject(dispatch({type: 'NOT_AUTHENTICATED'}))
        }
      });
    };
  };

export const updateUserSelections = (currentUserId) => {
  const selectionObj = {
    selected_team: currentTeam() ? currentTeam().id : null,
    selected_project: currentProject() ? currentProject().id : null,
    selected_task: currentTask() ? currentTask().id : null,
    selected_detail: currentDetail() ? currentDetail().id : null
  }
  
  return (dispatch) => {
    dispatch({type: 'SET_USER_SELECTED', payload: selectionObj})
    return fetch(`${baseUrl}/users/${currentUserId}/set_selected`, {
      method: 'PATCH',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getToken()
      },
      body: JSON.stringify(
         selectionObj
      )
    }).then((res) => res);
  };
}