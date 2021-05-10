import React from 'react'
import { connect } from 'react-redux'
import './DetailEditor.css'
import { completeDetail, deleteDetail } from '../actions/detail'
import CommentCard from '../components/CommentCard'
import NewCommentForm from './NewCommentForm'
import { currentDetail, parseTimestamp } from '../helpers/helpers'
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline'
import CheckCircle from '@material-ui/icons/CheckCircle'

function DetailEditor({ completeDetail, deleteDetail, comments, assignees }) {

    if (currentDetail()) {
        return (
            <section className='detail-editor'>
                <h2>{currentDetail().content}</h2>
                <button 
                    type='button'
                    className={currentDetail().completed ? "complete-btn complete" : "complete-btn"}
                    onClick={(e) => {
                        completeDetail(currentDetail())
                    }}
                >
                    {currentDetail().completed ? <CheckCircle /> : <CheckCircleOutline/>}
                </button>
                <span className='deadline'>Deadline: {parseTimestamp(currentDetail().deadline)}</span>
                <div className="assignments">
                    <h3>Assigned team members:</h3>
                    {assignees.map(assignee => 
                        <div className="assignment-card">
                            {assignee.username}
                        </div>
                    )}
                </div>
                <br/>
                <br/>
                <NewCommentForm commentType='detail'/>
                <div className="comments-container">
                    {comments.map(comment =>
                        <CommentCard 
                            key={comment.id} 
                            comment={comment} 
                            commentType='detail' 
                        />
                    )}
                </div>
                <button 
                    type='button'
                    className='delete-btn'
                    onClick={() => {
                        deleteDetail(currentDetail.id)
                    }} 
                >
                    Delete This Detail
                </button>
            </section>
        )
    
    } else {
        return (
            <section className="detail-editor">
                Select a detail to edit
            </section>
        )
    }

}

export default connect((state) => {
    return {
        comments: state.detail.detailComments,
        currentUser: state.auth.currentUser,
        assignees: state.detail.detailAssignees
    }
}, { completeDetail, deleteDetail })(DetailEditor)


