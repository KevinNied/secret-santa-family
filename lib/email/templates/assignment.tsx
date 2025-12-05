import * as React from 'react'

interface AssignmentEmailProps {
  giverName: string
  receiverName: string
  groupName: string
}

export const AssignmentEmail: React.FC<AssignmentEmailProps> = ({
  giverName,
  receiverName,
  groupName,
}) => {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#dc2626' }}>🎅 Secret Santa Assignment</h1>
      <p>Hi {giverName}!</p>
      <p>
        Your Secret Santa assignment for <strong>{groupName}</strong> is:
      </p>
      <div
        style={{
          background: '#fef2f2',
          border: '2px solid #dc2626',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: 0, color: '#dc2626' }}>🎁 {receiverName}</h2>
      </div>
      <p>Remember to keep it a secret! 🤫</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Happy gift hunting!
        <br />
        The Secret Santa Family Team
      </p>
    </div>
  )
}

