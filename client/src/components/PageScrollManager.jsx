import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PageScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, we might want to scroll to that element
    // but the user said "should move up", which implies starting from top.
    // For support pages, if we just want to show the tab, we should scroll to top.
    
    if (hash) {
      // Small delay to ensure the DOM has rendered the new tab content
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo(0, 0)
        }
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default PageScrollManager
