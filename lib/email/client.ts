import nodemailer from 'nodemailer'

const isDev = process.env.NODE_ENV === 'development'

// Crear transporter de Gmail SMTP
let transporter: nodemailer.Transporter | null = null

/**
 * Inicializa el transporter de Gmail SMTP
 */
function initializeTransporter() {
  if (transporter) return transporter

  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailAppPassword) {
    if (isDev) {
      console.warn('⚠️  [EMAIL CLIENT] GMAIL_USER o GMAIL_APP_PASSWORD no configurados. Los emails no se enviarán.')
    }
    return null
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  if (isDev) {
    console.log('✅ [EMAIL CLIENT] Transporter de Gmail SMTP inicializado')
    console.log('   - Usuario:', gmailUser)
  }

  return transporter
}

/**
 * Obtiene el transporter de Gmail SMTP
 */
export function getEmailTransporter(): nodemailer.Transporter | null {
  return initializeTransporter()
}

/**
 * Verifica si el email está configurado
 */
export function isEmailConfigured(): boolean {
  return !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD
}

/**
 * Verifica la conexión SMTP (útil para testing)
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    const transporter = getEmailTransporter()
    if (!transporter) return false
    
    await transporter.verify()
    if (isDev) {
      console.log('✅ [EMAIL CLIENT] Conexión SMTP verificada')
    }
    return true
  } catch (error) {
    if (isDev) {
      console.error('❌ [EMAIL CLIENT] Error al verificar conexión SMTP:', error)
    }
    return false
  }
}
