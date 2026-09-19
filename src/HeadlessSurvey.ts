import { computed, defineComponent, type PropType, type SlotsType } from 'vue'
import {
  validateAnswers,
  type SurveyDefinition,
  type SurveyAnswers,
  type SurveyError,
  type SurveyQuestion
} from './index.js'
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
    const fields = computed<SurveyField[]>(() =>
      props.definition.questions.map((question) => ({
        question,
        id: question.id,
        label: question.label[props.locale],
        hint: question.hint?.[props.locale] ?? '',
        required: question.required,
        disabled: props.disabled,
        value: Object.hasOwn(props.modelValue, question.id) ? props.modelValue[question.id]! : '',
        error: Object.hasOwn(props.errors, question.id) ? props.errors[question.id] : undefined,
        options:
          question.type === 'select'
            ? question.options.map((option) => ({
                value: option.value,
                label: option.label[props.locale]
              }))
            : [],
        setValue: (value: string) => {
          if (!props.disabled)
            emit('update:modelValue', {
              ...props.modelValue,
              [question.id]: value
            })
        }
      }))
    )
    const validate = () => validateAnswers(props.definition, props.modelValue)
    expose({ validate })
    return () =>
      slots.default?.({
        fields: fields.value,
        title: props.definition.title[props.locale],
        validate
      })
  }
})
