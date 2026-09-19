import { ref } from 'vue';
const clone = (value) => JSON.parse(JSON.stringify(value));
/** Hosts own persistence, dialogs and styling; IDs remain stable across edits and reorder. */
export const useSurveyDesigner = (initial) => {
    const definition = ref(clone(initial));
    const replace = (value) => {
        definition.value = clone(value);
    };
    const add = (question) => {
        if (definition.value.questions.length >= 50 ||
            definition.value.questions.some((item) => item.id === question.id))
            return false;
        definition.value.questions.push(clone(question));
        return true;
    };
    const update = (question) => {
        const index = definition.value.questions.findIndex((item) => item.id === question.id);
        if (index < 0)
            return false;
        definition.value.questions[index] = clone(question);
        return true;
    };
    const remove = (id) => {
        definition.value.questions = definition.value.questions.filter((item) => item.id !== id);
    };
    const move = (id, direction) => {
        const items = definition.value.questions, index = items.findIndex((item) => item.id === id), target = index + direction;
        if (index < 0 || target < 0 || target >= items.length)
            return;
        [items[index], items[target]] = [items[target], items[index]];
    };
    return { definition, replace, add, update, remove, move };
};
