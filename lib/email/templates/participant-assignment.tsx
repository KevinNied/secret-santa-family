import * as React from 'react'

interface ParticipantAssignmentEmailProps {
  participantName: string
  receiverName: string
  drawName: string
  participantLink: string
  customMessage?: string
  budget?: string
}

export const ParticipantAssignmentEmail: React.FC<ParticipantAssignmentEmailProps> = ({
  participantName,
  receiverName,
  drawName,
  participantLink,
  customMessage,
  budget,
}) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Secret Santa Family'
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #D4AF37' }}>
        <h1 style={{ color: '#1e3d59', margin: '0 0 10px 0', fontSize: '28px' }}>
          🎅 {appName}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>{drawName}</p>
      </div>

      {/* Saludo */}
      <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        ¡Hola <strong>{participantName}</strong>!
      </p>

      {/* Mensaje personalizado del organizador */}
      {customMessage && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #D4AF37' }}>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
            {customMessage}
          </p>
        </div>
      )}

      {/* Asignación destacada */}
      <div style={{ 
        backgroundColor: '#1e3d59', 
        color: '#ffffff',
        padding: '30px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 15px 0', fontSize: '18px', opacity: 0.9 }}>
          Tu amigo invisible es:
        </p>
        <h2 style={{ margin: 0, fontSize: '32px', color: '#D4AF37', fontWeight: 'bold' }}>
          🎁 {receiverName}
        </h2>
      </div>

      {/* Presupuesto */}
      {budget && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            <strong>Presupuesto:</strong> {budget}
          </p>
        </div>
      )}

      {/* Botón CTA */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a 
          href={participantLink}
          style={{
            display: 'inline-block',
            backgroundColor: '#D4AF37',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          }}
        >
          Ver Mi Panel de Participante
        </a>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '20px', marginTop: '30px' }}>
        <p style={{ color: '#999', fontSize: '12px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
          <strong>Importante:</strong> Este link es único y personal. No lo compartas con nadie.
        </p>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          ¡Que disfrutes buscando el regalo perfecto! 🎄✨
        </p>
      </div>
    </div>
  )
}





