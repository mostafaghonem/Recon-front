<script>
import axios from "~/plugins/axiosbase";
export default {
  middleware({ route, redirect }) {
    // If the user is not authenticated
    const path = route.path;
    const baseUrl = axios.defaults.baseURL;

    const base = baseUrl.replace("/api/", "");
    const target = base + path;
    return redirect(encodeURI(target));
  }
};
</script>
