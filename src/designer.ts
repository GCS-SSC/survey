import { ref } from 'vue'
import type { SurveyDefinition, SurveyQuestion } from './index.js'
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
/** Hosts own persistence, dialogs and styling; IDs remain stable across edits and reorder. */
export const useSurveyDesigner = (initial: SurveyDefinition) => {
  const definition = ref<SurveyDefinition>(clone(initial))
  const replace = (value: SurveyDefinition) => {
    definition.value = clone(value)
  }
  const add = (question: SurveyQuestion) => {
    if (
      definition.value.questions.length >= 50 ||
      definition.value.questions.some((item) => item.id === question.id)
    )
      return false
    definition.value.questions.push(clone(question))
    return true
  }
  const update = (question: SurveyQuestion) => {
    const index = definition.value.questions.findIndex((item) => item.id === question.id)
    if (index < 0) return false
    definition.value.questions[index] = clone(question)
    return true
  }
  const remove = (id: string) => {
    definition.value.questions = definition.value.questions.filter((item) => item.id !== id)
  }
  const move = (id: string, direction: -1 | 1) => {
    const items = definition.value.questions,
      index = items.findIndex((item) => item.id === id),
      target = index + direction
    if (index < 0 || target < 0 || target >= items.length) return
    ;[items[index], items[target]] = [items[target]!, items[index]!]
  }
  return { definition, replace, add, update, remove, move }
}
