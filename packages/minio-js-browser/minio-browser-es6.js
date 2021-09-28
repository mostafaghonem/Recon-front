/**
 * Simple ES6 wrapper around minio-browser.js
 *
 * minio-browser.js is the output of the gulp task 'browserify' in the
 * original minio-js repository.
 *
 * This wrapper cleans up the global window object after importing.
 */
import "./minio-browser.js"; // step 1: side effect populates window object
let Minio;
if (process.browser) {
  Minio = window.Minio; // step 2: capture window.Minio
  delete window.Minio;
}
export { Minio };
