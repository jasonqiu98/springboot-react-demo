/**
 * https://juejin.cn/post/6844904135091814407
 * (content in Chinese)
 */

import { useCallback, useEffect, useRef } from "react"


const useDebounce = (fn, delay) => {
  const { current } = useRef({ fn, timer: null })
  useEffect(() => {
    current.fn = fn
  }, [fn, current])

  return useCallback((...args) => {
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = setTimeout(() => {
      current.fn(...args)
    }, delay)
  }, [current, delay])
}

export default useDebounce