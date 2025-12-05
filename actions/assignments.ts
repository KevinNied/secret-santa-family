'use server'

import { prisma } from '@/lib/db'
import { generateAssignments, validateAssignments } from '@/lib/assignment/algorithm'
import { getParticipantsByGroupId, getExclusionsByGroupId } from '@/lib/db/queries'
// Legacy file - not used in current implementation
// import { sendAssignmentEmail } from '@/lib/email/send'

export async function generateAndNotifyAssignments(groupId: string) {
  try {
    // 1. Get participants
    const participants = await getParticipantsByGroupId(groupId)
    if (participants.length < 3) {
      return { error: 'Need at least 3 participants' }
    }

    // 2. Get exclusions
    const exclusions = await getExclusionsByGroupId(groupId)

    // 3. Generate assignments
    const assignments = generateAssignments(
      participants.map(p => ({
        id: p.id,
        groupId: p.groupId,
        name: p.name,
        email: p.email,
        createdAt: p.createdAt,
      })),
      exclusions.map(e => ({
        id: e.id,
        groupId: e.groupId,
        participant1Id: e.participant1Id,
        participant2Id: e.participant2Id,
        reason: e.reason || undefined,
      }))
    )

    // 4. Save to database
    await prisma.assignment.createMany({
      data: assignments.map(a => ({
        groupId,
        giverId: a.giverId,
        receiverId: a.receiverId,
      })),
    })

    // 5. Mark group as assigned
    await prisma.group.update({
      where: { id: groupId },
      data: { assignmentDate: new Date() },
    })

    // 6. Send emails (TODO: implement email sending)
    // for (const assignment of assignments) {
    //   const giver = participants.find(p => p.id === assignment.giverId)
    //   const receiver = participants.find(p => p.id === assignment.receiverId)
    //   if (giver && receiver) {
    //     await sendAssignmentEmail(giver.email, giver.name, receiver.name, groupName)
    //   }
    // }

    return { success: true }
  } catch (error) {
    console.error('Error generating assignments:', error)
    return { error: 'Failed to generate assignments' }
  }
}

export async function getMyAssignment(groupId: string, participantId: string) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        groupId_giverId: {
          groupId,
          giverId: participantId,
        },
      },
      include: {
        receiver: true,
      },
    })

    return { success: true, data: assignment }
  } catch (error) {
    console.error('Error getting assignment:', error)
    return { error: 'Failed to get assignment' }
  }
}

