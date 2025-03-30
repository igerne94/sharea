import React from 'react'

function ProfilePage({ params }: { params: { username: string } }) {
    console.log(params.username)
    return (
        <div>page</div>
  )
}

export default ProfilePage