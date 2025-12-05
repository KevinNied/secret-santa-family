# Architecture & Data Model 🏗️

This document explains the architecture decisions and data model for Secret Santa Family.

---

## 🎯 Core Design Principles

### 1. **Simplicity First: No Login Required**
- Access via unique tokens embedded in URLs
- No passwords to remember
- No registration forms
- Direct access: just click the link

### 2. **Privacy First: Admin Cannot See Assignments**
- Assignments are only accessible via participant tokens
- Admin can manage the draw but cannot query "who got whom"
- Database design prevents easy admin access to assignments
- Maintains the "magic" and surprise

### 3. **Token-Based Access**
- Each draw has one **admin token** (for the organizer)
- Each participant has a **unique token** (for their panel)
- Tokens are UUIDs (cryptographically secure)
- URLs like: `/admin/abc-123` and `/participant/xyz-789`

---

## 📊 Data Model

### **Draw** (Main Entity)
Represents one Secret Santa event.

```typescript
{
  id: string              // UUID
  adminToken: string      // Unique token for admin access
  
  // Configuration
  name: string            // "Christmas 2025"
  budget?: string         // "$20-$50"
  exchangeDate?: Date     // When gifts are exchanged
  customMessage?: string  // Organizer's message
  rules?: string          // Custom rules
  
  // State
  isComplete: boolean     // Has the draw been executed?
  emailsSent: boolean     // Were initial emails sent?
  assignmentDate?: Date   // When assignments were generated
}
```

**Admin Access:** `/admin/{adminToken}`

### **Participant**
Each person in the draw.

```typescript
{
  id: string
  drawId: string
  token: string           // Unique token for participant access
  
  name: string            // "John Doe 🎄" (emojis supported)
  email: string
  wishlist?: string       // Free-text wishlist
  
  // Tracking
  emailSent: boolean      // Was email sent?
  emailSentAt?: Date
  viewedAssignment: boolean  // Did they view their assignment?
  viewedAt?: Date
}
```

**Participant Access:** `/participant/{token}`

### **Assignment**
Who gives to whom (protected information).

```typescript
{
  id: string
  drawId: string
  giverId: string         // Participant who gives
  receiverId: string      // Participant who receives
}
```

**Privacy Note:** Only accessible through participant's own token.

### **Exclusion**
Rules about who cannot be assigned to whom.

```typescript
{
  id: string
  drawId: string
  participant1Id: string
  participant2Id: string
  reason?: string         // "couple", "siblings", etc.
}
```

**Bidirectional:** If A cannot be assigned to B, then B cannot be assigned to A.

### **Hint**
Anonymous messages from giver to receiver.

```typescript
{
  id: string
  drawId: string
  senderToken: string     // Token of giver (anonymous to receiver)
  receiverToken: string   // Token of receiver
  message: string
  
  emailSent: boolean
  viewedByReceiver: boolean
  createdAt: Date
}
```

**Privacy:** Receiver only sees the message, not who sent it.

---

## 🔐 Security & Privacy

### Token Generation
```typescript
import crypto from 'crypto'

// Generate secure tokens
const adminToken = crypto.randomUUID()      // For admin
const participantToken = crypto.randomUUID() // For each participant
```

### Access Control

**Admin Panel (`/admin/{adminToken}`):**
- ✅ View participant list
- ✅ View email status
- ✅ Resend all emails (keeps same tokens)
- ✅ Redo draw (generates new assignments)
- ❌ **CANNOT** see who got whom

**Participant Panel (`/participant/{token}`):**
- ✅ View own assignment (who they got)
- ✅ View assigned person's wishlist
- ✅ Edit own wishlist
- ✅ Send anonymous hints
- ✅ View hints received
- ❌ **CANNOT** see other assignments
- ❌ **CANNOT** see who has them

### Database Queries

```typescript
// ✅ ALLOWED: Get own assignment via token
const assignment = await getParticipantAssignment(token)

// ❌ FORBIDDEN: Admin querying all assignments
// This function should NOT exist or require special permissions
const allAssignments = await getAllAssignments(drawId) // DON'T DO THIS
```

---

## 🎨 URL Structure

### Admin URLs
```
/admin/{adminToken}
```
Example: `/admin/550e8400-e29b-41d4-a716-446655440000`

**Features:**
- View participant list
- Email status dashboard
- Resend emails button
- Redo draw button (with confirmation)
- Manage exclusions (before draw)

### Participant URLs
```
/participant/{token}
```
Example: `/participant/123e4567-e89b-12d3-a456-426614174000`

**Features:**
- View assigned person + their wishlist
- Edit own wishlist
- Send anonymous hints
- View received hints

### Creation Flow
```
/create/step-1  → Add participants + exclusions
/create/step-2  → Customize message, budget, date
/create/step-3  → Review + send emails
```

---

## 📧 Email Flow

### Initial Email (Sent to Participants)
```
Subject: 🎁 You're in a Secret Santa!

Hi {participantName}!

You've been invited to "{drawName}"

{customMessage}

Click here to see who you got:
👉 {appUrl}/participant/{token}

Budget: {budget}
Exchange Date: {exchangeDate}
```

### Hint Notification Email
```
Subject: 💡 You received a hint!

Hi {participantName}!

Someone sent you a hint for {drawName}:

"{hintMessage}"

View all hints: {appUrl}/participant/{token}
```

---

## 🔄 State Transitions

### Draw Lifecycle

```
1. CREATED
   ↓ (admin adds participants + exclusions)
   
2. CONFIGURED
   ↓ (admin confirms and sends emails)
   
3. EMAILS SENT
   ↓ (participants view assignments)
   
4. ACTIVE
   ↓ (participants send hints, update wishlists)
   
5. COMPLETED
   ↓ (gift exchange happens)
   
6. ARCHIVED
```

### Admin Actions

**Resend Emails:**
- Keeps same assignments
- Keeps same tokens
- Updates `emailSent` flags
- Useful if someone lost their link

**Redo Draw:**
- Deletes old assignments
- Generates NEW assignments
- Keeps same participant tokens
- Updates `assignmentDate`
- Useful if assignments were spoiled

---

## 🧪 Testing Strategy

### Unit Tests
- Assignment algorithm (exclusions, no self-assignment)
- Exclusion validation (circular checks)
- Token generation (uniqueness)

### Integration Tests
- Complete draw creation flow
- Email sending
- Token-based access

### E2E Tests
- Admin flow: create → configure → send
- Participant flow: view → wishlist → hints
- Privacy: cannot access other's data

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Database Migrations
```bash
# Development
pnpm db:push

# Production
pnpm db:migrate
```

### Scaling
- Database indexes on tokens (fast lookups)
- Connection pooling via Supabase
- Stateless design (no sessions)
- Email queue for bulk sending

---

## 📝 Future Enhancements

### Potential Additions
- [ ] Soft-delete draws (archive instead of delete)
- [ ] Draw templates (reuse last year's setup)
- [ ] Analytics (participation rate, hints sent)
- [ ] Multi-language support
- [ ] Custom email templates per draw

### Security Enhancements
- [ ] Token expiration (optional)
- [ ] Rate limiting on hint sending
- [ ] IP-based access logs
- [ ] Email verification (optional)

---

Last updated: Nov 29, 2025

