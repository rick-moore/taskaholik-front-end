import React, { useState } from 'react'
import './NewMemberForm.css'
import { currentTeam } from '../../helpers/helpers'
import { connect } from 'react-redux' 
import { addMember } from '../../actions/team'

function AddMemberForm({ addMember }) {
    
    const [query, setQuery] = useState('')

    return (
        <div className="new-member-form">
            <h3>Search for team members by email or username:</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    addMember(query, currentTeam().id)
                    setQuery('')
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