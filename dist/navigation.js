import { computed, ref, toValue, watch } from 'vue';
import { pruneAnswers, resolveSurvey } from './flow.js';
import { validateAnswers } from './answers.js';
/** Controlled answer state; navigation follows the same pure evaluator used on the server. */
export const useSurveyFlow = (options) => {
    const route = computed(() => resolveSurvey(toValue(options.definition), toValue(options.answers)));
    const currentId = ref(route.value.pages[0]?.id ?? '');
    const complete = ref(false);
    const errors = ref({});
    const pageIndex = computed(() => Math.max(0, route.value.pages.findIndex((page) => page.id === currentId.value)));
    const page = computed(() => route.value.pages[pageIndex.value]);
    watch(() => toValue(options.definition), () => {
        currentId.value = route.value.pages[0]?.id ?? '';
        complete.value = false;
        errors.value = {};
    }, { deep: true, flush: 'sync' });
    watch(() => route.value.pages.map((item) => item.id), (ids, previous) => {
        if (!ids.includes(currentId.value)) {
            const oldIndex = previous.indexOf(currentId.value);
            currentId.value =
                previous
                    .slice(0, oldIndex)
                    .reverse()
                    .find((id) => ids.includes(id)) ??
                    ids[0] ??
                    '';
        }
    }, { flush: 'sync' });
    watch(() => toValue(options.answers), () => {
        complete.value = false;
        errors.value = {};
    }, { deep: true, flush: 'sync' });
    const setAnswer = (id, value) => {
        if (!page.value?.activeQuestionIds.includes(id))
            return;
        options.onChange(pruneAnswers(toValue(options.definition), { ...toValue(options.answers), [id]: value }));
        complete.value = false;
        errors.value = {};
    };
    const validate = () => validateAnswers(toValue(options.definition), toValue(options.answers));
    const next = () => {
        const allErrors = validate();
        errors.value = Object.fromEntries(Object.entries(allErrors).filter(([id]) => page.value?.activeQuestionIds.includes(id)));
        if (Object.keys(errors.value).length)
            return false;
        if (pageIndex.value + 1 < route.value.pages.length)
            currentId.value = route.value.pages[pageIndex.value + 1].id;
        else {
            errors.value = allErrors;
            if (Object.keys(allErrors).length) {
                const invalidPage = route.value.pages.find((item) => item.activeQuestionIds.some((id) => Object.hasOwn(allErrors, id)));
                if (invalidPage)
                    currentId.value = invalidPage.id;
                return false;
            }
            complete.value = true;
        }
        return true;
    };
    const back = () => {
        if (complete.value)
            complete.value = false;
        else if (pageIndex.value > 0)
            currentId.value = route.value.pages[pageIndex.value - 1].id;
        errors.value = {};
    };
    return {
        route,
        page,
        pageIndex,
        complete,
        errors,
        setAnswer,
        next,
        back,
        validate,
        canBack: computed(() => complete.value || pageIndex.value > 0),
        isLastPage: computed(() => pageIndex.value === route.value.pages.length - 1)
    };
};
