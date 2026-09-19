import { computed, defineComponent } from 'vue';
import { validateAnswers } from './index.js';
/** No elements or styles: the host provides every rendered control through the default slot. */
export const HeadlessSurvey = defineComponent({
    name: 'HeadlessSurvey',
    inheritAttrs: false,
    props: {
        definition: { type: Object, required: true },
        modelValue: { type: Object, required: true },
        locale: { type: String, default: 'en' },
        errors: {
            type: Object,
            default: () => ({})
        },
        disabled: { type: Boolean, default: false }
    },
    emits: {
        'update:modelValue': (value) => typeof value === 'object'
    },
    slots: Object,
    setup(props, { emit, slots, expose }) {
        const fields = computed(() => props.definition.questions.map((question) => ({
            question,
            id: question.id,
            label: question.label[props.locale],
            hint: question.hint?.[props.locale] ?? '',
            required: question.required,
            disabled: props.disabled,
            value: Object.hasOwn(props.modelValue, question.id) ? props.modelValue[question.id] : '',
            error: Object.hasOwn(props.errors, question.id) ? props.errors[question.id] : undefined,
            options: question.type === 'select'
                ? question.options.map((option) => ({
                    value: option.value,
                    label: option.label[props.locale]
                }))
                : [],
            setValue: (value) => {
                if (!props.disabled)
                    emit('update:modelValue', {
                        ...props.modelValue,
                        [question.id]: value
                    });
            }
        })));
        const validate = () => validateAnswers(props.definition, props.modelValue);
        expose({ validate });
        return () => slots.default?.({
            fields: fields.value,
            title: props.definition.title[props.locale],
            validate
        });
    }
});
