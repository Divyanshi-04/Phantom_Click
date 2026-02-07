import { useContext } from "react"
import { Stage1Context } from "./urlContext"

export const useStage1 = () => {
  const ctx = useContext(Stage1Context)

  if (!ctx) {
    throw new Error("useStage1 must be used inside Stage1Provider")
  }

  return ctx
}
