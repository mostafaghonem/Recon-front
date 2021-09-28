export default function({ store, redirect, beforeNuxtRender }) {
  if (process.server) {
    beforeNuxtRender(({ nuxtState }) => {
      console.log("checking permissions", nuxtState.permissions);
      if (
        !nuxtState.permissions ||
        (nuxtState.permissions &&
          !nuxtState.permissions.find(o => o === "admin"))
      ) {
        return redirect("/error");
      }
    });
  }
}
