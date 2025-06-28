import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enrichResultsToHierarchy(results: any[]): any {
  const hierarchy = { domains: {} }
  results.forEach(item => {
    if (!item.domain) return
    if (!hierarchy.domains[item.domain]) {
      hierarchy.domains[item.domain] = { types: {} }
    }
    if (!item.type) return
    if (!hierarchy.domains[item.domain].types[item.type]) {
      hierarchy.domains[item.domain].types[item.type] = { categories: {} }
    }
    if (!item.category) return
    if (!hierarchy.domains[item.domain].types[item.type].categories[item.category]) {
      hierarchy.domains[item.domain].types[item.type].categories[item.category] = { subCategories: [] }
    }
    if (
      item.sub_category &&
      !hierarchy.domains[item.domain].types[item.type].categories[item.category].subCategories.includes(item.sub_category)
    ) {
      hierarchy.domains[item.domain].types[item.type].categories[item.category].subCategories.push(item.sub_category)
    }
  })
  return hierarchy
}