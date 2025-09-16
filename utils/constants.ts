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
  PRAYER_ATTENDANCE: '/api/worker/prayer/report-attendance',
  PRAYER_PARTICIPANTS: '/api/worker/prayer/participants',
  PRAYER_MEETINGS: '/api/worker/prayer/meetings',

  // study group
  STUDY_GROUPS: '/api/study-groups',
  STUDY_GROUP: '/api/study-groups/:id',
  STUDY_GROUP_CURRENT_WEEK: '/api/study-groups/current-week',
  STUDY_GROUP_YEAR: '/api/study-groups/weekly/:year',

  //submission
  SUBMISSIONS: '/api/study-group/submissions',
  SUBMISSION: '/api/study-group/submissions/:id',
  SUBMISSION_CURRENT_WEEK: '/api/submissions/current-week',
  SUBMISSION_STATS: '/api/submissions/stats',
  SUBMISSION_RECENT_ASSIGNMENTS: '/api/submissions/assignments/recent',

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
};
