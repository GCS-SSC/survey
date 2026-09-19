import { z } from 'zod';
export const questionTypes = ['text', 'email', 'number', 'date', 'select'];
const identifier = z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)
    .refine((value) => !['__proto__', 'constructor', 'prototype'].includes(value));
export const bilingualText = z
    .object({
    en: z.string().trim().min(1).max(200),
    fr: z.string().trim().min(1).max(200)
})
    .strict();
const hint = z.object({ en: z.string().trim().max(500), fr: z.string().trim().max(500) }).strict();
const base = z
    .object({
    id: identifier,
    label: bilingualText,
    hint: hint.optional(),
    required: z.boolean()
})
    .strict();
const option = z.object({ value: identifier, label: bilingualText }).strict();
export const questionSchema = z.discriminatedUnion('type', [
    base.extend({
        type: z.literal('text'),
        maxLength: z.number().int().min(1).max(5000).default(500)
    }),
    base.extend({ type: z.literal('email') }),
    base.extend({ type: z.literal('number') }),
    base.extend({ type: z.literal('date') }),
    base.extend({
        type: z.literal('select'),
        options: z
            .array(option)
            .min(2)
            .max(30)
            .refine((values) => new Set(values.map((item) => item.value)).size === values.length, 'Option values must be unique')
    })
]);
export const surveySchema = z
    .object({
    schemaVersion: z.literal(1),
    title: bilingualText,
    questions: z.array(questionSchema).min(1).max(50)
})
    .strict()
    .superRefine((value, context) => {
    if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 240 * 1024)
        context.addIssue({ code: 'custom', message: 'Survey exceeds 240 KiB' });
    const ids = new Set();
    value.questions.forEach((question, index) => {
        if (ids.has(question.id))
            context.addIssue({
                code: 'custom',
                path: ['questions', index, 'id'],
                message: 'Question IDs must be unique'
            });
        ids.add(question.id);
    });
});
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
    for (const question of definition.questions) {
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
