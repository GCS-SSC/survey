import { describe, expect, it } from 'vitest'
import { createSSRApp, h, reactive } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  surveySchema,
  validateAnswers,
  answersSchema,
  type SurveyDefinition
} from '../src/index.js'
import { HeadlessSurvey, useSurveyDesigner, type SurveySlot } from '../src/vue.js'
import { pushSurvey } from '../src/client.js'
const surveyId = '01999999-9999-7999-8999-999999999999',
  agencyId = '01999999-9999-7999-8999-999999999998'
const definition: SurveyDefinition = {
  schemaVersion: 1,
  title: { en: 'Application', fr: 'Demande' },
  questions: [
    {
      id: 'name',
      type: 'text',
      label: { en: 'Name', fr: 'Nom' },
      required: true,
      maxLength: 10
    },
    {
      id: 'email',
      type: 'email',
      label: { en: 'Email', fr: 'Courriel' },
      required: false
    },
    {
      id: 'amount',
      type: 'number',
      label: { en: 'Amount', fr: 'Montant' },
      required: true
    },
    {
      id: 'date',
      type: 'date',
      label: { en: 'Date', fr: 'Date' },
      required: true
    },
    {
      id: 'choice',
      type: 'select',
      label: { en: 'Choice', fr: 'Choix' },
      required: true,
      options: [
        { value: 'yes', label: { en: 'Yes', fr: 'Oui' } },
        { value: 'no', label: { en: 'No', fr: 'Non' } }
      ]
    }
  ]
}
describe('portable model', () => {
  it('round-trips bilingual definitions without host-specific fields', () => {
    expect(surveySchema.parse(JSON.parse(JSON.stringify(definition)))).toEqual(definition)
    expect(surveySchema.safeParse({ ...definition, theme: 'nuxtui' }).success).toBe(false)
    expect(surveySchema.safeParse({ ...definition, schemaVersion: 2 }).success).toBe(false)
    expect(
      surveySchema.safeParse({
        ...definition,
        questions: [definition.questions[0], definition.questions[0]]
      }).success
    ).toBe(false)
    expect(
      surveySchema.safeParse({
        ...definition,
        questions: [{ ...definition.questions[0], id: 'constructor' }]
      }).success
    ).toBe(false)
  })
  it('rejects invalid controls, malformed options and executable content fields', () => {
    for (const question of [
      { ...definition.questions[0], type: 'script' },
      { ...definition.questions[0], label: { en: '', fr: 'Nom' } },
      {
        ...definition.questions[4],
        options: [
          { value: 'x', label: { en: 'A', fr: 'A' } },
          { value: 'x', label: { en: 'B', fr: 'B' } }
        ]
      },
      { ...definition.questions[0], html: '<script>alert(1)</script>' }
    ])
      expect(surveySchema.safeParse({ ...definition, questions: [question] }).success).toBe(false)
  })
  it('keeps zero valid, rejects unknown answers and validates actual calendar dates', () => {
    const valid = {
      name: 'Team',
      amount: '0',
      date: '2028-02-29',
      choice: 'no'
    }
    expect(validateAnswers(definition, valid)).toEqual({})
    expect(
      validateAnswers(definition, {
        ...valid,
        email: 'bad',
        amount: ' ',
        date: '2027-02-29',
        choice: 'other',
        extra: 'x'
      })
    ).toEqual({
      email: 'email',
      amount: 'required',
      date: 'date',
      choice: 'choice',
      extra: 'unknown'
    })
    expect(
      validateAnswers(definition, {
        ...valid,
        amount: 'Infinity',
        name: 'A'.repeat(11),
        date: '0000-01-01'
      })
    ).toEqual({ amount: 'number', name: 'length', date: 'date' })
    expect(validateAnswers(definition, {}, 'draft')).toEqual({})
    expect(answersSchema.safeParse({ name: 42 }).success).toBe(false)
    const inherited = {
      ...definition,
      questions: [{ ...definition.questions[0]!, id: 'toString' }]
    }
    expect(validateAnswers(inherited, {})).toEqual({ toString: 'required' })
  })
})
describe('unstyled Vue provider', () => {
  it('lets two independent hosts render different elements from the exact same model', async () => {
    const render = (tag: string) =>
      renderToString(
        createSSRApp({
          render: () =>
            h(
              HeadlessSurvey,
              { definition, modelValue: { name: 'Example' }, locale: 'fr' },
              {
                default: ({ fields }: SurveySlot) =>
                  fields.map((field) => h(tag, { 'data-question': field.id }, field.label))
              }
            )
        })
      )
    expect(await render('label')).toContain('<label data-question="name">Nom</label>')
    expect(await render('p')).toContain('<p data-question="name">Nom</p>')
    expect(await render('p')).not.toMatch(/class=|style=|form>|input/)
  })
  it('exposes immutable answer updates and refuses updates while disabled', async () => {
    const answers = { name: 'Original' },
      updates: unknown[] = []
    for (const disabled of [false, true]) {
      await renderToString(
        createSSRApp({
          render: () =>
            h(
              HeadlessSurvey,
              {
                definition,
                modelValue: answers,
                disabled,
                'onUpdate:modelValue': (value) => updates.push(value)
              },
              {
                default: ({ fields }: SurveySlot) => {
                  fields[0]!.setValue('Edited')
                  return []
                }
              }
            )
        })
      )
    }
    expect(answers.name).toBe('Original')
    expect(updates).toEqual([{ name: 'Edited' }])
  })
  it('supports reactive inputs and stable IDs through editing, reorder and removal', () => {
    const input = reactive(structuredClone(definition)),
      editor = useSurveyDesigner(input)
    editor.move('choice', -1)
    expect(editor.definition.value.questions[3]!.id).toBe('choice')
    expect(input.questions[3]!.id).toBe('date')
    expect(editor.add(input.questions[0]!)).toBe(false)
    editor.update({
      ...input.questions[0]!,
      label: { en: 'Team name', fr: 'Nom de l’équipe' }
    })
    expect(editor.definition.value.questions[0]!.label.en).toBe('Team name')
    editor.remove('email')
    expect(editor.definition.value.questions.some((q) => q.id === 'email')).toBe(false)
  })
})
describe('extension transport', () => {
  it('rejects invalid protocol responses', async () => {
    await expect(
      pushSurvey({
        portalUrl: 'https://portal.example',
        token: 'test-token',
        agencyId,
        definition,
        fetch: async () => Response.json({ survey: { definition: { schemaVersion: 999 } } })
      })
    ).rejects.toThrow()
  })
  it('sends the shared validated contract with optimistic revision and rejects redirects', async () => {
    let request: RequestInit | undefined
    const fetcher: typeof fetch = async (_url, init) => {
      request = init
      return Response.json({
        survey: {
          id: surveyId,
          agencyId,
          revision: 3,
          definition,
          updatedAt: new Date().toISOString()
        }
      })
    }
    const result = await pushSurvey({
      portalUrl: 'https://portal.example',
      token: 'secret',
      agencyId,
      definition,
      existing: { id: surveyId, revision: 2 },
      fetch: fetcher
    })
    expect(result.survey.revision).toBe(3)
    expect(request?.redirect).toBe('error')
    expect(JSON.parse(String(request?.body))).toEqual({
      definition,
      expectedRevision: 2
    })
  })
})
