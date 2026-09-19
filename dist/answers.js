import { z } from 'zod';
import { identifier } from './model.js';
import { resolveSurvey } from './flow.js';
export const answersSchema = z.record(identifier, z.string().max(5000));
export const isCalendarDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-'))
        return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
/** Same validator runs in any host renderer and at the API boundary. No coercion of blanks to zero. */
export const validateAnswers = (definition, answers, mode = 'submit') => {
    const errors = Object.create(null);
    const ids = new Set(definition.questions.map((question) => question.id));
    for (const key of Object.keys(answers))
        if (!ids.has(key))
            errors[key] = 'unknown';
    const active = new Set(resolveSurvey(definition, answers).questionIds);
    for (const question of definition.questions) {
        if (!active.has(question.id))
            continue;
        const value = Object.hasOwn(answers, question.id) ? answers[question.id] : '';
        if (!value.trim()) {
            if (mode === 'submit' && question.required)
                errors[question.id] = 'required';
            continue;
        }
        if (question.type === 'text' && value.length > question.maxLength)
            errors[question.id] = 'length';
        if (question.type === 'email' && !z.email().safeParse(value).success)
            errors[question.id] = 'email';
        if (question.type === 'number' &&
            (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) || !Number.isFinite(Number(value))))
            errors[question.id] = 'number';
        if (question.type === 'date' && !isCalendarDate(value))
            errors[question.id] = 'date';
        if (question.type === 'select' && !question.options.some((option) => option.value === value))
            errors[question.id] = 'choice';
    }
    return errors;
};
/** Use this result at persistence boundaries: answers excludes all hidden/skipped/unknown keys. */
export const validateSurveyAnswers = (definition, answers, mode = 'submit') => ({
    answers: resolveSurvey(definition, answers).answers,
    errors: validateAnswers(definition, answers, mode)
});
