export const STORAGE_KEYS = {
  TOKEN: 'token',
  IS_AUTHENTICATED: 'isAuthenticated',
  USER: 'user',
  COLOR_SCHEME: 'colorScheme',
};

export const QUERY_PATHS = {
  // account
  LOGIN: '/api/worker/account/login',
  RESET_PASSWORD: '/api/worker/password/reset',
  OTP_REQUEST: 'api/worker/otp/request',
  OTP_VERIFY: 'api/worker/otp/verify',
  CHANGE_PASSWORD: '/api/worker/password/change',
  UPDATE_PROFILE: '/api/worker/profile/update/:id',
  UPLOAD_PROFILE_IMAGE: '/api/worker/profile/upload-image',

  // prayer
  PRAYER_ATTENDANCE: '/api/prayer-group/report-attendance',
  PRAYER_PARTICIPANTS: '/api/prayer-group/participants',
  PRAYER_MEETINGS: '/api/prayer-group/meetings',

  // study group
  STUDY_GROUPS: '/api/study-groups',
  STUDY_GROUP: '/api/study-groups/:id',
  STUDY_GROUP_CURRENT_WEEK: '/api/study-groups/current-week',
  STUDY_GROUP_YEAR: '/api/study-groups/weekly/:year',

  //submission
  SUBMISSIONS: '/api/study-group/submissions',
  MEMBER_SUBMISSIONS: '/api/study-group/submissions/worker/registered-member',
  SUBMISSION: '/api/study-group/submissions/:id',
  SUBMISSION_CURRENT_WEEK: '/api/study-group/submissions/current-week',
  SUBMISSION_STATS: '/api/study-group/submissions/stats',
  SUBMISSION_RECENT_ASSIGNMENTS: '/api/study-group/submissions/assignments/recent',

  // pastor
  PASTOR_MEMBERS: '/api/pastor/members',
  PASTOR_SUBMISSIONS_CURRENT_WEEK: '/api/pastor/submissions/current-week',
  PASTOR_SUBMISSIONS_STATS: '/api/pastor/submissions/stats',
  PASTOR_FELLOWSHIPS: '/api/pastor/fellowships',
  PASTOR_FELLOWSHIP_CELLS: '/api/pastor/fellowships/:fellowshipId/cells',

  // fellowship
  FELLOWSHIP_MEMBERS: '/api/fellowship/members',
  FELLOWSHIP_SUBMISSIONS_CURRENT_WEEK: '/api/fellowship/submissions/current-week',
  FELLOWSHIP_SUBMISSIONS_STATS: '/api/fellowship/submissions/stats',
  FELLOWSHIP_CELLS: '/api/fellowship/cells',

  // cell
  CELL_MEMBERS: '/api/cell/members',
  CELL_SUBMISSIONS_CURRENT_WEEK: '/api/cell/submissions/current-week',
  CELL_SUBMISSIONS_STATS: '/api/cell/submissions/stats',

  // members
  THIS_MEMBER: '/api/member/all',
  MEMBER: '/api/member/:id',
  ADD_MEMBER: '/api/member/add',

  // evangelism
  EVANGELISM: '/api/evangelism',
  EVANGELISM_WORKER_HISTORY: '/api/evangelism/worker/history',
  EVANGELISM_ADMIN_ALL: '/api/evangelism/admin/all',
  EVANGELISM_ADMIN_STATS: '/api/evangelism/admin/stats',
  EVANGELISM_BY_ID: '/api/evangelism/:id',

  // follow-up
  FOLLOW_UP: '/api/follow-up',
  FOLLOW_UP_WORKER_HISTORY: '/api/follow-up/worker/history',
  FOLLOW_UP_ADMIN_ALL: '/api/follow-up/admin/all',
  FOLLOW_UP_ADMIN_STATS: '/api/follow-up/admin/stats',
  FOLLOW_UP_BY_ID: '/api/follow-up/:id',

  // attendance
  ATTENDANCE_MARK: '/api/attendance/mark',
  ATTENDANCE_HISTORY: '/api/attendance/history',
  ATTENDANCE_ADMIN_MEETING: '/api/attendance/admin/meeting',
  ATTENDANCE_ADMIN_MEETINGS: '/api/attendance/admin/meetings',
};
