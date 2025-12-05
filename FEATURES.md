# Features & Roadmap 🎁

This document outlines the functional requirements and features for Secret Santa Family.

---

## 🎯 Core Features (MVP)

### Participant Management

- ✅ Add participants with name and email
- ✅ Email format validation
- ✅ Support for dynamically adding multiple participants
- ✅ Support for emojis in names

### Exclusion System

- [ ] Configure exclusions between participants (couples, siblings, etc.)
- [ ] Simple interface to define "X cannot be assigned to Y"
- [ ] Validation for circular exclusions

### Creation Process (3 Steps)

**Step 1: Participant Setup**
- [ ] Enter names, emails, and exclusions
- [ ] Visual interface to add/remove participants
- [ ] Define exclusion rules

**Step 2: Customize Message**
- [ ] Set budget suggestion
- [ ] Set gift exchange date
- [ ] Add custom rules or instructions
- [ ] Personalize the message sent to participants

**Step 3: Review and Confirm**
- [ ] Review participant list
- [ ] Confirm exclusion rules
- [ ] Send emails to all participants

### Assignment Algorithm

- [ ] Random assignment respecting exclusions
- [ ] Nobody gets themselves
- [ ] Everyone has a Secret Santa assigned
- [ ] **CRITICAL: Admin CANNOT see the assignments**

### Email System

- [ ] Automatic email sent to each participant with:
  - [ ] Unique personal link with token
  - [ ] Organizer's custom message
  - [ ] Instructions on how to use the platform

### Admin Panel (WITHOUT Seeing Assignments)

- [ ] View participant list for the draw
- [ ] View email status (sent/not sent)
- [ ] **Resend ALL emails** (keeps original assignments)
- [ ] **Redo entire draw** (generates new assignments, useful if there were spoilers)
- [ ] ⚠️ **CANNOT see who got whom** - keeps the magic alive

### Participant Panel

- [ ] View who they got as their Secret Santa
- [ ] View their assigned person's wishlist
- [ ] Create/edit their own wishlist
- [ ] Send anonymous hints to their assigned person

### Wishlist System

- [ ] Free-text editor for each participant
- [ ] Can include: interests, hobbies, sizes, colors, links
- [ ] Only visible to the person who has them assigned

### Anonymous Hints System

- [ ] Send anonymous messages to your assigned person
- [ ] Receiver gets email with the hint
- [ ] Builds anticipation before Christmas
- [ ] History of received hints in the panel

### No Login/Registration Required

- [ ] Token-based system using unique UUIDs
- [ ] URLs like: `/admin/{draw_id}` and `/participant/{token}`
- [ ] No passwords, no registration, direct access via link
- [ ] Secure token generation for access control

---

## 🚀 Planned Features (Phase 2)

### Enhanced Wishlist
- [ ] Add photos to wishlist items
- [ ] Link to specific products
- [ ] Price range indicators
- [ ] Priority levels for items

### Communication Enhancements
- [ ] Multiple hint types (text, image, emoji)
- [ ] Hint scheduling (send hints on specific dates)
- [ ] Push notifications for new hints
- [ ] Read receipts for hints

### Admin Enhancements
- [ ] Multiple draws per year
- [ ] Archive completed draws
- [ ] Statistics (participation rate, emails opened, etc.)
- [ ] Export participant data
- [ ] Custom email templates

### Participant Experience
- [ ] Mark gift as purchased (hidden from assigned person)
- [ ] Gift delivery confirmation
- [ ] Thank you notes (post-exchange)
- [ ] Rate the gift experience

---

## 🎨 Fun Feature Ideas (Phase 3)

### Entertainment
- [ ] **Funny participant descriptions** - Add quirky bios for each person
- [ ] **Mini-profiles** - Card-style profiles with photos
- [ ] **Excuse generator** - Auto-generate funny excuses for late gifts
- [ ] **Mystery mode** - Give clues instead of revealing the person directly

### Gamification
- [ ] **Points system** - Earn points for thoughtful gifts
- [ ] **Gift rating** - Rate received gifts (anonymously)
- [ ] **Hall of fame** - Best gifts from previous years
- [ ] **Badges** - Achievements (best gift giver, most creative, etc.)

### Social Features
- [ ] **Photo sharing** - Share photos of gifts (after reveal)
- [ ] **Gift reveal party mode** - Virtual reveal party
- [ ] **Voting** - Vote for best wrapped gift, most creative, etc.
- [ ] **Timeline** - Visual timeline of the Secret Santa journey

### Advanced
- [ ] **Theme selector** - Different UI themes (classic, modern, minimal)
- [ ] **Multi-language support** - Spanish, English, Portuguese
- [ ] **Calendar integration** - Add gift exchange date to calendar
- [ ] **Budget tracker** - Track spending across multiple groups

---

## 🔧 Technical Improvements

### Performance
- [ ] Image optimization for participant photos
- [ ] Lazy loading for large groups
- [ ] Caching strategies
- [ ] Database query optimization

### Security
- [ ] Two-factor authentication
- [ ] Assignment encryption
- [ ] Rate limiting on API endpoints
- [ ] Audit log for admin actions

### DevOps
- [ ] Automated testing (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Plausible/PostHog)

---

## 💡 Feature Requests

Have an idea? Open an issue on GitHub with the label `feature-request`!

### How to Request a Feature

1. Check if the feature is already listed here
2. Search existing issues to avoid duplicates
3. Create a new issue with:
   - Clear description of the feature
   - Use case / problem it solves
   - Optional: Mockups or examples

---

## 📊 Priority Matrix

| Priority | Category | Timeline |
|----------|----------|----------|
| 🔴 High | Core Features (MVP) | Now |
| 🟡 Medium | Enhanced Features | Q1 2026 |
| 🟢 Low | Fun Features | Q2 2026 |
| 🔵 Future | Advanced Features | TBD |

---

## 🎯 Current Sprint Focus

Focus on completing the MVP core features:

1. ✅ Project setup
2. ✅ Database schema with Prisma
3. ⏳ **Token-based authentication system** (IN PROGRESS)
4. ⏳ **3-step creation flow UI**
5. ⏳ **Assignment algorithm with exclusions**
6. ⏳ **Email integration with unique tokens**
7. ⏳ **Admin panel (without viewing assignments)**
8. ⏳ **Participant panel with wishlist**
9. ⏳ **Anonymous hints system**
10. ⏳ **Deploy to production**

---

## 🔑 Key Technical Decisions

### Authentication Architecture
- **Token-based access** instead of traditional auth
- Admin gets one URL, each participant gets unique URL
- URLs contain UUID tokens stored in database
- No password management needed

### Privacy & Security
- Assignments are **encrypted or token-protected**
- Admin cannot query who-got-whom from database
- Only participant can see their assignment via their token
- Resend emails keeps same tokens (same assignments)
- Redo draw generates NEW tokens (new assignments)

### Email Strategy
- All emails sent via Resend
- Each email contains unique participant token
- Token format: UUID v4 (cryptographically secure)
- URLs are long-lived (valid for entire season)

---

## 📝 Notes

- Features marked with ✅ are implemented
- Features marked with [ ] are planned
- Features marked with ⏳ are in progress

**Important Design Principles:**
- **Simplicity First**: No login required, access via links
- **Privacy First**: Admin cannot see assignments
- **Magic First**: Keep the surprise and mystery alive
- **Mobile First**: Works great on phones

Last updated: Nov 29, 2025

