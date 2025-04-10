import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useSetAtom } from "jotai"
import { interfaceCardAtom } from "@renderer/atom"

export const InterfaceSelector = (): React.ReactElement => {
  const [options, setOptions] = useState<string[]>([])
  const setInterfaceCard = useSetAtom(interfaceCardAtom)
  useEffect(() => {
    async function getInterfaceId(): Promise<void> {
      setOptions(await window.api.getInterfaceCard())
    }
    getInterfaceId()
  }, [])

  function handleClick(val: string): void {
    const trimmedValue = val.trim()
    const id = Number(trimmedValue.charAt(0))
    setInterfaceCard(id)
  }

  return <Select onValueChange={handleClick}>
    <SelectTrigger>
      <SelectValue placeholder="Select the interface card to netrack"></SelectValue>
    </SelectTrigger>
    <SelectContent>
      {options && options.map((val, index) => {
        return <SelectItem key={index} value={val}>{val}</SelectItem>
      })
      }
    </SelectContent>
  </Select >
}
