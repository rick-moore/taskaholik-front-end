import React, { useState } from 'react'
import './AddMemberForm.css'
import { connect } from 'react-redux' 
import { addMember } from '../actions/team'

function AddMemberForm({ addMember, currentTeam }) {
    
    const [query, setQuery] = useState('')

    return (
        <div className="add-member-form">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    addMember(query, currentTeam.id)
                }}
            >
                <input 
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value)
                    }}
                />
                <input type="submit" value="Add Member"/>
            </form>
        </div>
    )
}

export default connect(null, { addMember })(AddMemberForm)