import { computed, defineComponent, type PropType, type SlotsType } from 'vue'
import {
  type SurveyDefinition,
  type SurveyAnswers,
  type SurveyError,
  type SurveyQuestion
} from './index.js'
import { useSurveyFlow } from './navigation.js'
import type { ResolvedPage } from './flow.js'
export interface SurveyField {
  question: SurveyQuestion
  id: string
  label: string
  hint: string
  required: boolean
  disabled: boolean
  value: string
  error: SurveyError | undefined
  options: { value: string; label: string }[]
  setValue: (value: string) => void
}
export interface SurveySlot {
  fields: SurveyField[]
  title: string
  description: string
  page: ResolvedPage | undefined
  pageIndex: number
  canBack: boolean
  isLastPage: boolean
  complete: boolean
  next: () => boolean
  back: () => void
  errors: Record<string, SurveyError>
  validate: () => Record<string, SurveyError>
}
/** No elements or styles: the host provides every rendered control through the default slot. */
export const HeadlessSurvey = defineComponent({
  name: 'HeadlessSurvey',
  inheritAttrs: false,
  props: {
    definition: { type: Object as PropType<SurveyDefinition>, required: true },
    modelValue: { type: Object as PropType<SurveyAnswers>, required: true },
    locale: { type: String as PropType<'en' | 'fr'>, default: 'en' },
    errors: {
      type: Object as PropType<Record<string, SurveyError>>,
      default: () => ({})
    },
    disabled: { type: Boolean, default: false }
  },
  emits: {
    'update:modelValue': (value: SurveyAnswers) => typeof value === 'object'
  },
  slots: Object as SlotsType<{ default: SurveySlot }>,
  setup(props, { emit, slots, expose }) {
    const flow = useSurveyFlow({
      definition: () => props.definition,
      answers: () => props.modelValue,
      onChange: (value) => emit('update:modelValue', value)
    })
    const fields = computed<SurveyField[]>(() =>
      (flow.page.value?.activeQuestionIds ?? [])
        .map((id) => props.definition.questions.find((question) => question.id === id)!)
        .map((question) => ({
          question,
          id: question.id,
          label: question.label[props.locale],
          hint: question.hint?.[props.locale] ?? '',
          required: question.required,
          disabled: props.disabled,
          value: Object.hasOwn(props.modelValue, question.id) ? props.modelValue[question.id]! : '',
          error: Object.hasOwn(props.errors, question.id)
            ? props.errors[question.id]
            : Object.hasOwn(flow.errors.value, question.id)
              ? flow.errors.value[question.id]
              : undefined,
          options:
            question.type === 'select'
              ? question.options.map((option) => ({
                  value: option.value,
                  label: option.label[props.locale]
                }))
              : [],
          setValue: (value: string) => {
            if (!props.disabled) flow.setAnswer(question.id, value)
          }
        }))
    )
    const validate = flow.validate
    const next = () => !props.disabled && flow.next()
    const back = () => {
      if (!props.disabled) flow.back()
    }
    expose({ validate, next, back })
    return () =>
      slots.default?.({
        fields: fields.value,
        title: props.definition.title[props.locale],
        validate,
        description:
          props.definition.schemaVersion === 2
            ? (props.definition.description?.[props.locale] ?? '')
            : '',
        page: flow.page.value,
        pageIndex: flow.pageIndex.value,
        canBack: flow.canBack.value,
        isLastPage: flow.isLastPage.value,
        complete: flow.complete.value,
        errors: flow.errors.value,
        next,
        back
      })
  }
})
