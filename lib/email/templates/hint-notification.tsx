import * as React from 'react'

interface HintNotificationEmailProps {
  receiverName: string
  drawName: string
  participantLink: string
}

export const HintNotificationEmail: React.FC<HintNotificationEmailProps> = ({
  receiverName,
  drawName,
  participantLink,
}) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Secret Santa Family'
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #D4AF37' }}>
        <h1 style={{ color: '#1e3d59', margin: '0 0 10px 0', fontSize: '28px' }}>
          💬 {appName}
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>{drawName}</p>
      </div>

      {/* Saludo */}
      <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        ¡Hola <strong>{receiverName}</strong>!
      </p>

      {/* Mensaje principal */}
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        border: '2px solid #D4AF37',
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e3d59', fontWeight: '600' }}>
          ✨ ¡Tienes una nueva pista anónima!
        </p>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Tu amigo invisible te ha enviado un mensaje secreto.
        </p>
      </div>

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
          Ver Mi Pista
        </a>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '20px', marginTop: '30px' }}>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          El remitente permanece anónimo. ¡Disfruta la pista! 🎁
        </p>
      </div>
    </div>
  )
}





