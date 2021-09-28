export default function({ store, redirect, beforeNuxtRender }) {
  if (process.server) {
    beforeNuxtRender(({ nuxtState }) => {
      if (!nuxtState.user) {
        return redirect('/login')
      }
    })
  }

  // Client-side

  if (process.client) {
    console.log('in client')
  }
}
