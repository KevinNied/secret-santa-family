/**
 * Template HTML para email de asignación de participante
 */
export function getParticipantAssignmentEmailHTML({
  participantName,
  receiverName,
  drawName,
  participantLink,
  customMessage,
  budget,
}: {
  participantName: string
  receiverName: string
  drawName: string
  participantLink: string
  customMessage?: string
  budget?: string
}): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Secret Santa Family'
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName} - Tu Amigo Invisible</title>
</head>
<body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding: 30px 20px; border-bottom: 2px solid #D4AF37; background-color: #1e3d59;">
              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 28px;">
                🎅 ${appName}
              </h1>
              <p style="margin: 0; color: #ffffff; opacity: 0.9; font-size: 16px;">${drawName}</p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding: 30px 20px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ¡Hola <strong>${participantName}</strong>!
              </p>
              ${customMessage ? `
              <!-- Mensaje personalizado -->
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #D4AF37;">
                <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                  ${customMessage.replace(/\n/g, '<br>')}
                </p>
              </div>
              ` : ''}

              <!-- Asignación destacada -->
              <div style="background-color: #1e3d59; color: #ffffff; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; font-size: 18px; opacity: 0.9;">
                  Tu amigo invisible es:
                </p>
                <h2 style="margin: 0; font-size: 32px; color: #D4AF37; font-weight: bold;">
                  🎁 ${receiverName}
                </h2>
              </div>

              ${budget ? `
              <!-- Presupuesto -->
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Presupuesto:</strong> ${budget}
                </p>
              </div>
              ` : ''}

              <!-- Botón CTA -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${participantLink}" style="display: inline-block; background-color: #D4AF37; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
                  Ver Mi Panel de Participante
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #e5e5e5; padding: 20px; background-color: #f9f9f9;">
              <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0 0 10px 0;">
                <strong>Importante:</strong> Este link es único y personal. No lo compartas con nadie.
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                ¡Que disfrutes buscando el regalo perfecto! 🎄✨
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

