import { z } from 'zod'
export const questionTypes = ['text', 'email', 'number', 'date', 'select'] as const
export const identifier = z
  .string()
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/)
  .refine((value) => !['__proto__', 'constructor', 'prototype'].includes(value))
export const bilingualText = z
  .object({
    en: z.string().trim().min(1).max(200),
    fr: z.string().trim().min(1).max(200)
  })
  .strict()
const hint = z.object({ en: z.string().trim().max(500), fr: z.string().trim().max(500) }).strict()
const base = z
  .object({
    id: identifier,
    label: bilingualText,
    hint: hint.optional(),
    required: z.boolean()
  })
  .strict()
const option = z.object({ value: identifier, label: bilingualText }).strict()
const legacyQuestionSchema = z.discriminatedUnion('type', [
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
      .refine(
        (values) => new Set(values.map((item) => item.value)).size === values.length,
        'Option values must be unique'
      )
  })
])
export const attachmentPolicySchema = z.object({ enabled: z.boolean() }).strict()
export type AttachmentPolicy = z.infer<typeof attachmentPolicySchema>
export const legacySurveySchema = z
  .object({
    schemaVersion: z.literal(1),
    attachments: attachmentPolicySchema.optional(),
    title: bilingualText,
    questions: z.array(legacyQuestionSchema).min(1).max(50)
  })
  .strict()
  .superRefine((value, context) => {
    if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 240 * 1024)
      context.addIssue({ code: 'custom', message: 'Survey exceeds 240 KiB' })
    const ids = new Set<string>()
    value.questions.forEach((question, index) => {
      if (ids.has(question.id))
        context.addIssue({
          code: 'custom',
          path: ['questions', index, 'id'],
          message: 'Question IDs must be unique'
        })
      ids.add(question.id)
    })
  })

export const bilingualDescription = z
  .object({
    en: z.string().trim().min(1).max(2000),
    fr: z.string().trim().min(1).max(2000)
  })
  .strict()
export const conditionOperators = [
  'equals',
  'notEquals',
  'contains',
  'greaterThan',
  'lessThan',
  'answered',
  'notAnswered'
] as const
const predicateSchema = z.discriminatedUnion('operator', [
  z
    .object({
      questionId: identifier,
      operator: z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']),
      value: z.string().min(1).max(5000)
    })
    .strict(),
  z.object({ questionId: identifier, operator: z.enum(['answered', 'notAnswered']) }).strict()
])
export const conditionSchema = z
  .object({ match: z.enum(['all', 'any']), conditions: z.array(predicateSchema).min(1).max(20) })
  .strict()
export type SurveyCondition = z.infer<typeof conditionSchema>
const questionExtensions = {
  hint: z
    .object({ en: z.string().trim().min(1).max(500), fr: z.string().trim().min(1).max(500) })
    .strict()
    .optional(),
  visibleWhen: conditionSchema.optional()
}
export const questionV2Schema = z.discriminatedUnion('type', [
  legacyQuestionSchema.options[0].extend(questionExtensions),
  legacyQuestionSchema.options[1].extend(questionExtensions),
  legacyQuestionSchema.options[2].extend(questionExtensions),
  legacyQuestionSchema.options[3].extend(questionExtensions),
  legacyQuestionSchema.options[4].extend(questionExtensions)
])
const groupBase = z
  .object({
    id: identifier,
    title: bilingualText,
    description: bilingualDescription.optional(),
    visibleWhen: conditionSchema.optional(),
    questionIds: z.array(identifier).max(50)
  })
  .strict()
export const subsectionSchema = groupBase
export const sectionSchema = groupBase.extend({ subsections: z.array(subsectionSchema).max(20) })
export const destinationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('page'), pageId: identifier }).strict(),
  z.object({ kind: z.literal('end') }).strict()
])
export const pageSchema = z
  .object({
    id: identifier,
    title: bilingualText,
    description: bilingualDescription.optional(),
    questionIds: z.array(identifier).max(50),
    sections: z.array(sectionSchema).max(20),
    branches: z
      .array(z.object({ when: conditionSchema, destination: destinationSchema }).strict())
      .max(20),
    next: destinationSchema.optional()
  })
  .strict()
const structuredSurveySchema = z
  .object({
    schemaVersion: z.literal(2),
    attachments: attachmentPolicySchema.optional(),
    title: bilingualText,
    description: bilingualDescription.optional(),
    questions: z.array(questionV2Schema).min(1).max(50),
    pages: z.array(pageSchema).min(1).max(20)
  })
  .strict()
export type SurveyQuestion = z.infer<typeof questionV2Schema>
export type SurveyPage = z.infer<typeof pageSchema>
export type SurveySection = z.infer<typeof sectionSchema>
export type SurveySubsection = z.infer<typeof subsectionSchema>
export type SurveyDestination = z.infer<typeof destinationSchema>
export type StructuredSurvey = z.infer<typeof structuredSurveySchema>
export type LegacySurvey = z.infer<typeof legacySurveySchema>
export type SurveyDefinition = LegacySurvey | StructuredSurvey

export const questionSchema = legacyQuestionSchema
export const surveyV1Schema = legacySurveySchema
export const surveyV2Schema = structuredSurveySchema.superRefine((value, context) => {
  const fail = (message: string) => context.addIssue({ code: 'custom', message })
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 240 * 1024)
    fail('Survey exceeds 240 KiB')
  const ids = new Set<string>()
  const register = (id: string) => {
    if (ids.has(id)) fail(`Duplicate ID: ${id}`)
    ids.add(id)
  }
  const questions = new Map(value.questions.map((question) => [question.id, question]))
  value.questions.forEach((question) => register(question.id))
  const placed = new Set<string>()
  const checkCondition = (condition: SurveyCondition | undefined) => {
    for (const predicate of condition?.conditions ?? []) {
      const question = questions.get(predicate.questionId)
      if (!question || !placed.has(predicate.questionId)) {
        fail('Conditions must reference an earlier question')
        continue
      }
      if (predicate.operator === 'greaterThan' || predicate.operator === 'lessThan') {
        if (
          question.type !== 'number' ||
          !/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(predicate.value) ||
          !Number.isFinite(Number(predicate.value))
        )
          fail('Numeric comparisons require a number question and decimal value')
      }
      if (predicate.operator === 'contains' && question.type !== 'text')
        fail('Contains requires a text question')
      if (
        (predicate.operator === 'equals' || predicate.operator === 'notEquals') &&
        question.type === 'select' &&
        !question.options.some((option) => option.value === predicate.value)
      )
        fail('Condition references an unknown choice')
    }
  }
  const place = (questionIds: string[]) =>
    questionIds.forEach((id) => {
      const question = questions.get(id)
      if (!question || placed.has(id)) {
        fail('Every question must be placed exactly once')
        return
      }
      checkCondition(question.visibleWhen)
      placed.add(id)
    })
  value.pages.forEach((page, pageIndex) => {
    register(page.id)
    place(page.questionIds)
    for (const section of page.sections) {
      register(section.id)
      checkCondition(section.visibleWhen)
      place(section.questionIds)
      for (const subsection of section.subsections) {
        register(subsection.id)
        checkCondition(subsection.visibleWhen)
        place(subsection.questionIds)
      }
    }
    const destination = (target: SurveyDestination | undefined) => {
      if (
        target?.kind === 'page' &&
        value.pages.findIndex((item) => item.id === target.pageId) <= pageIndex
      )
        fail('Branches must target a later existing page')
    }
    page.branches.forEach((branch) => {
      checkCondition(branch.when)
      destination(branch.destination)
    })
    destination(page.next)
  })
  if (placed.size !== questions.size) fail('Every question must be placed exactly once')
})

export const surveySchema = z.union([surveyV1Schema, surveyV2Schema])

/** Explicit editing upgrade; never mutates the archived source definition. */
export const upgradeSurvey = (definition: SurveyDefinition): StructuredSurvey => {
  const copy = JSON.parse(JSON.stringify(definition)) as SurveyDefinition
  if (copy.schemaVersion === 2) return copy
  let pageId = 'page_1'
  while (copy.questions.some((question) => question.id === pageId)) pageId += '_'
  return {
    ...copy,
    schemaVersion: 2,
    pages: [
      {
        id: pageId,
        title: { en: 'Page 1', fr: 'Page 1' },
        questionIds: copy.questions.map((question) => question.id),
        sections: [],
        branches: []
      }
    ],
    questions: copy.questions.map((question) => ({
      ...question,
      ...(question.hint && !question.hint.en && !question.hint.fr ? { hint: undefined } : {})
    }))
  }
}
