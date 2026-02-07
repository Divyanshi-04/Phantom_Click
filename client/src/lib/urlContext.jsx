
import { createContext, useState, useEffect } from "react"

export const Stage1Context = createContext(null)

export const Stage1Provider = ({ children }) => {
  const [firstUrl, setFirstUrl] = useState(() =>
    localStorage.getItem("firstUrl")
  )

  const [stage1Data, setStage1Data] = useState(() =>
    JSON.parse(localStorage.getItem("stage1Data") || "{}")
  )

  const [stage2Data, setStage2Data] = useState(() =>
    JSON.parse(localStorage.getItem("stage2Data") || "{}")
  )

  const [stage3Data, setStage3Data] = useState(() =>
    JSON.parse(localStorage.getItem("stage3Data") || "{}")
  )

  useEffect(() => {
    if (firstUrl) {
      localStorage.setItem("firstUrl", firstUrl)
    }
  }, [firstUrl])

  useEffect(() => {
    localStorage.setItem("stage1Data", JSON.stringify(stage1Data))
  }, [stage1Data])

  useEffect(() => {
    localStorage.setItem("stage2Data", JSON.stringify(stage2Data))
  }, [stage2Data])

  useEffect(() => {
    localStorage.setItem("stage3Data", JSON.stringify(stage3Data))
  }, [stage3Data])

  return (
    <Stage1Context.Provider value={{
      firstUrl,
      setFirstUrl,
      stage1Data,
      setStage1Data,
      stage2Data,
      setStage2Data,
      stage3Data,
      setStage3Data
    }}>
      {children}
    </Stage1Context.Provider>
  )
}
