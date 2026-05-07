/**
 * @typedef {'gm' | 'staff' | 'guest'} UserRole
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {UserRole} role
 *
 * @typedef {'open' | 'in-progress' | 'resolved' | 'escalated'} ComplaintStatus
 *
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} roomNumber
 * @property {string} guestName
 * @property {string} issueType
 * @property {string} description
 * @property {ComplaintStatus} status
 * @property {string} submittedAt
 * @property {string} [photoUrl]
 * @property {string} referenceNumber
 *
 * @typedef {Object} DashboardStats
 * @property {number} tasksDoneToday
 * @property {number} openComplaints
 * @property {number} overdueTasks
 * @property {number} staffOnShift
 * @property {string} gmName
 * @property {number} shiftsLeft
 *
 * @typedef {Object} Alert
 * @property {string | number} id
 * @property {string | null} room
 * @property {string} title
 * @property {string} badge
 * @property {'red' | 'orange' | 'green' | 'blue'} badgeColor
 * @property {string} submittedAgo
 * @property {string} detail
 * @property {string} icon
 *
 * @typedef {Object} Department
 * @property {string} name
 * @property {number} completion
 * @property {string} color
 *
 * @typedef {Object} Room
 * @property {number} number
 * @property {string} url
 */

export {};
