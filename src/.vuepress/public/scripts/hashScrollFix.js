// Hack that fixes Vuepress' inability to scroll through hash links
// https://github.com/passwordless/docs/issues/47
// Taken from https://github.com/vuejs/vuepress/issues/1499#issuecomment-663807385
window.onload = function () {
  requestAnimationFrame(function () {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));

      if (element) {
        element.scrollIntoView();
      }
    }
  });
};
