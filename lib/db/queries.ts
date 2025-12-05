import { prisma } from '../db'

// ============================================
// DRAW QUERIES
// ============================================

// Get draw by admin token (for admin panel)
export async function getDrawByAdminToken(adminToken: string) {
  return await prisma.draw.findUnique({
    where: { adminToken },
    include: {
      participants: {
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          emailSent: true,
          emailSentAt: true,
          viewedAssignment: true,
          viewedAt: true,
          createdAt: true,
        },
      },
      exclusions: {
        include: {
          participant1: { select: { id: true, name: true } },
          participant2: { select: { id: true, name: true } },
        },
      },
      _count: {
        select: {
          participants: true,
          assignments: true,
          hints: true,
        },
      },
    },
  })
}

// ============================================
// PARTICIPANT QUERIES
// ============================================

// Get participant by token (for participant panel)
export async function getParticipantByToken(token: string) {
  return await prisma.participant.findUnique({
    where: { token },
    include: {
      draw: {
        select: {
          id: true,
          name: true,
          budget: true,
          exchangeDate: true,
          customMessage: true,
          rules: true,
        },
      },
    },
  })
}

// Get participant's assignment (who they have to give to)
export async function getParticipantAssignment(token: string) {
  const participant = await prisma.participant.findUnique({
    where: { token },
  })

  if (!participant) return null

  return await prisma.assignment.findUnique({
    where: {
      drawId_giverId: {
        drawId: participant.drawId,
        giverId: participant.id,
      },
    },
    include: {
      receiver: {
        select: {
          id: true,
          name: true,
          wishlist: true,
          token: false, // Never expose another participant's token
        },
      },
    },
  })
}

// ============================================
// HINTS QUERIES
// ============================================

// Get hints received by a participant
export async function getHintsForParticipant(receiverToken: string) {
  return await prisma.hint.findMany({
    where: { receiverToken },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      message: true,
      createdAt: true,
      viewedByReceiver: true,
      // Don't include sender info - it's anonymous!
    },
  })
}

// Get hints sent by a participant
export async function getHintsSentByParticipant(senderToken: string) {
  return await prisma.hint.findMany({
    where: { senderToken },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      message: true,
      createdAt: true,
      emailSent: true,
      receiver: {
        select: {
          name: true, // They can see who they sent it to
        },
      },
    },
  })
}

// ============================================
// EXCLUSIONS QUERIES
// ============================================

// Get exclusions for a draw
export async function getExclusionsByDrawId(drawId: string) {
  return await prisma.exclusion.findMany({
    where: { drawId },
    include: {
      participant1: { select: { id: true, name: true } },
      participant2: { select: { id: true, name: true } },
    },
  })
}

// Check if two participants have an exclusion
export async function hasExclusion(
  drawId: string,
  participant1Id: string,
  participant2Id: string
): Promise<boolean> {
  const exclusion = await prisma.exclusion.findFirst({
    where: {
      drawId,
      OR: [
        { participant1Id, participant2Id },
        { participant1Id: participant2Id, participant2Id: participant1Id },
      ],
    },
  })

  return !!exclusion
}

// ============================================
// ASSIGNMENT QUERIES (Use carefully - privacy!)
// ============================================

// Check if draw has assignments (for admin)
export async function hasAssignments(drawId: string): Promise<boolean> {
  const count = await prisma.assignment.count({
    where: { drawId },
  })

  return count > 0
}

// Get all participants for a draw (for algorithm)
export async function getParticipantsByDrawId(drawId: string) {
  return await prisma.participant.findMany({
    where: { drawId },
    orderBy: { name: 'asc' },
  })
}

