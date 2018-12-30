const maxRetries = 5

function delay(call, delay) {
  return setTimeout(call, delay)
}

export const APIRequest = async () => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const resp = await fetch('google.com')
      return resp
    } catch (err) {
      if (i < maxRetries - 1) {
        await delay(() => fetch('google.com'), 100)
      } else {
        throw err
      }
    }
  }
}
