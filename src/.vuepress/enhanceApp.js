/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */
function getElementPosition(el) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top,
  }
}

function scrollToAnchor(to) {
  const targetAnchor = to.hash.slice(1)
  const targetElement = document.getElementById(targetAnchor) || document.querySelector(`[name='${targetAnchor}']`)

  if (targetElement) {
    return window.scrollTo({
      top: getElementPosition(targetElement).y,
      behavior: 'smooth',
    })
  } else {
    return false
  }
}


export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  router.addRoute(
    { path: "/guide/getting-started", redirect: "/guide/get-started"}
  );

  // if (typeof document === 'undefined') return
  // document.onreadystatechange = () => {
  //   if (document.readyState === 'complete') {
  //     const { hash } = location
  //     const decoded = decodeURIComponent(hash);

  //     console.log("decode", hash, decoded);
  //     if (hash !== decoded) {
  //       console.log("scroll");
  //       document.querySelector(decoded).scrollIntoView()
  //     }
  //   }
  // }

  router.options.scrollBehavior = (to, from, savedPosition) => {
    console.log(111);
    if (savedPosition) {
      return window.scrollTo({
        top: savedPosition.y,
        behavior: 'smooth',
      })
    } else if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }
      const scrollResult = scrollToAnchor(to)

      console.log("SCROL RESULT", scrollResult);
      if (scrollResult) {
        return scrollResult
      } else {
        console.log("SCROL", to);
        window.onload = () => {
          scrollToAnchor(to)
        }
      }
    } else {
      return window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }
}
