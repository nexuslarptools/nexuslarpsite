export function interpAuthLevel (authword) {
  switch (authword) {
    case 'Wizard':
      return 6
    case 'HeadGM':
      return 5
    case 'SecondGM':
      return 4
    case 'Approver':
      return 3
    case 'Writer':
      return 2
    case 'Reader':
      return 1
    default:
      return 0
  }
}

  export default interpAuthLevel