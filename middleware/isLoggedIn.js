export default function({ store, redirect, beforeNuxtRender }) {
  if (process.server) {
    beforeNuxtRender(({ nuxtState }) => {
      console.log("SHOULD REDIRECT A LOGGED IN USER");
      if (nuxtState.user) {
        return redirect("/dashboard");
      }
    });
  }

  // Client-side

  if (process.client) {
    console.log("in client");
  }
}
