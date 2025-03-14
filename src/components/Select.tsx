"use client"

import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select"

const Select = ({options=frameworks, label="Select framework"}) => {
  return (
    <SelectRoot collection={frameworks} size="sm" width="320px">
      <SelectLabel>{label}</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select movie" />
      </SelectTrigger>
      <SelectContent>
        {options.items.map((movie) => (
          <SelectItem item={movie} key={movie.value}>
            {movie.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

const frameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
})

export default Select;