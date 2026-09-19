import { describe, expect, it } from 'vitest'
import { effectScope, ref } from 'vue'
import {
  surveySchema,
  surveyV2Schema,
  resolveSurvey,
  pruneAnswers,
  validateAnswers,
  upgradeSurvey,
  type StructuredSurvey,
  type SurveyCondition,
  type SurveyAnswers
} from '../src/index.js'
import { useSurveyFlow } from '../src/vue.js'
const title = { en: 'Application', fr: 'Demande' }
const when = (questionId: string, value = 'yes'): SurveyCondition => ({
  match: 'all',
  conditions: [{ questionId, operator: 'equals', value }]
})
const fixture = (): StructuredSurvey => ({
  schemaVersion: 2,
  title,
  description: { en: 'Tell us about your project.', fr: 'Décrivez votre projet.' },
  questions: [
    {
      id: 'eligible',
      type: 'select',
      label: title,
      required: true,
      options: [
        { value: 'yes', label: { en: 'Yes', fr: 'Oui' } },
        { value: 'no', label: { en: 'No', fr: 'Non' } }
      ]
    },
    { id: 'detail', type: 'text', label: title, required: true, maxLength: 500 },
    { id: 'extra', type: 'text', label: title, required: true, maxLength: 500 },
    { id: 'contact', type: 'email', label: title, required: true }
  ],
  pages: [
    {
      id: 'intro',
      title,
      questionIds: ['eligible'],
      sections: [],
      branches: [{ when: when('eligible', 'no'), destination: { kind: 'page', pageId: 'finish' } }]
    },
    {
      id: 'details',
      title,
      questionIds: [],
      sections: [
        {
          id: 'project',
          title,
          visibleWhen: when('eligible'),
          questionIds: ['detail'],
          subsections: [
            {
              id: 'more',
              title,
              visibleWhen: {
                match: 'all',
                conditions: [{ questionId: 'detail', operator: 'contains', value: 'extra' }]
              },
              questionIds: ['extra']
            }
          ]
        }
      ],
      branches: []
    },
    { id: 'finish', title, questionIds: ['contact'], sections: [], branches: [] }
  ]
})
describe('versioned bilingual structure', () => {
  it('round trips v2 and keeps v1 unchanged until explicitly upgraded', () => {
    const current = fixture()
    expect(surveySchema.parse(current)).toEqual(current)
    const old = {
      schemaVersion: 1 as const,
      title,
      questions: [{ ...current.questions[1]!, hint: { en: 'Old English only', fr: '' } }]
    }
    expect(surveySchema.parse(old)).toEqual(old)
    const upgraded = upgradeSurvey(old)
    expect(upgraded).toEqual(upgradeSurvey(old))
    expect(old.schemaVersion).toBe(1)
    expect(upgraded.pages[0]?.questionIds).toEqual(['detail'])
    expect(surveySchema.safeParse(upgraded).success).toBe(false) // author must complete old translation
  })
  it('requires both languages for every supplied description and hint', () => {
    const locations = [
      (s: StructuredSurvey) => s,
      (s: StructuredSurvey) => s.pages[1]!,
      (s: StructuredSurvey) => s.pages[1]!.sections[0]!,
      (s: StructuredSurvey) => s.pages[1]!.sections[0]!.subsections[0]!
    ]
    for (const target of locations)
      for (const missing of ['en', 'fr'] as const) {
        const s = fixture()
        target(s).description = { en: 'English', fr: 'Français', [missing]: ' ' }
        expect(surveySchema.safeParse(s).success).toBe(false)
      }
    const s = fixture()
    s.questions[1]!.hint = { en: 'English', fr: '' }
    expect(surveySchema.safeParse(s).success).toBe(false)
    s.questions[1]!.hint.fr = 'Français'
    expect(surveySchema.safeParse(s).success).toBe(true)
  })
  it.each([
    [
      'orphan',
      (s: StructuredSurvey) => {
        s.pages[2]!.questionIds = []
      }
    ],
    [
      'duplicate placement',
      (s: StructuredSurvey) => {
        s.pages[2]!.questionIds.push('eligible')
      }
    ],
    [
      'unknown placement',
      (s: StructuredSurvey) => {
        s.pages[2]!.questionIds.push('missing')
      }
    ],
    [
      'duplicate group ID',
      (s: StructuredSurvey) => {
        s.pages[2]!.id = 'intro'
      }
    ],
    [
      'self visibility',
      (s: StructuredSurvey) => {
        s.questions[1]!.visibleWhen = when('detail')
      }
    ],
    [
      'later visibility',
      (s: StructuredSurvey) => {
        s.questions[1]!.visibleWhen = when('contact')
      }
    ],
    [
      'descendant visibility',
      (s: StructuredSurvey) => {
        s.pages[1]!.sections[0]!.visibleWhen = when('extra')
      }
    ],
    [
      'future branch source',
      (s: StructuredSurvey) => {
        s.pages[0]!.branches[0]!.when = when('contact')
      }
    ],
    [
      'backward branch',
      (s: StructuredSurvey) => {
        s.pages[0]!.branches[0]!.destination = { kind: 'page', pageId: 'intro' }
      }
    ],
    [
      'missing target',
      (s: StructuredSurvey) => {
        s.pages[0]!.next = { kind: 'page', pageId: 'missing' }
      }
    ],
    [
      'invalid choice',
      (s: StructuredSurvey) => {
        s.pages[0]!.branches[0]!.when = when('eligible', 'invalid')
      }
    ],
    [
      'wrong numeric source',
      (s: StructuredSurvey) => {
        s.pages[0]!.branches[0]!.when.conditions = [
          { questionId: 'eligible', operator: 'greaterThan', value: '4' }
        ]
      }
    ],
    [
      'unbounded conditions',
      (s: StructuredSurvey) => {
        s.pages[0]!.branches[0]!.when.conditions = Array(21).fill({
          questionId: 'eligible',
          operator: 'answered'
        })
      }
    ]
  ])('rejects %s', (_name, mutate) => {
    const s = fixture()
    mutate(s)
    expect(surveyV2Schema.safeParse(s).success).toBe(false)
  })
})
describe('shared route and answer rules', () => {
  it('skips pages, prunes stale answers and only requires reachable questions', () => {
    const s = fixture(),
      answers = { eligible: 'no', detail: 'extra info', extra: 'stale', contact: 'a@example.test' }
    expect(resolveSurvey(s, answers).pages.map((page) => page.id)).toEqual(['intro', 'finish'])
    expect(pruneAnswers(s, answers)).toEqual({ eligible: 'no', contact: 'a@example.test' })
    expect(validateAnswers(s, answers)).toEqual({})
    expect(validateAnswers(s, { eligible: 'no' })).toEqual({ contact: 'required' })
  })
  it('evaluates nested visibility in order and ignores hidden negative predicates', () => {
    const s = fixture()
    s.pages[2]!.branches = [
      {
        when: { match: 'all', conditions: [{ questionId: 'extra', operator: 'notAnswered' }] },
        destination: { kind: 'end' }
      }
    ]
    const resolved = resolveSurvey(s, { eligible: 'yes', detail: 'basic', extra: 'stale' })
    expect(resolved.questionIds).toEqual(['eligible', 'detail', 'contact'])
    expect(resolved.pages[1]!.sections[0]!.subsections).toEqual([])
    expect(pruneAnswers(s, { eligible: 'yes', detail: 'extra', extra: 'keep' })).toEqual({
      eligible: 'yes',
      detail: 'extra',
      extra: 'keep'
    })
  })
  it('uses first matching branch, supports finish and default jumps, keeps empty pages', () => {
    const s = fixture()
    s.pages[0]!.branches.unshift({ when: when('eligible', 'no'), destination: { kind: 'end' } })
    expect(resolveSurvey(s, { eligible: 'no' }).pages.map((page) => page.id)).toEqual(['intro'])
    s.pages[0]!.branches = []
    s.pages[0]!.next = { kind: 'page', pageId: 'finish' }
    expect(resolveSurvey(s, {}).pages.map((page) => page.id)).toEqual(['intro', 'finish'])
    delete s.pages[0]!.next
    expect(resolveSurvey(s, {}).pages.map((page) => page.id)).toEqual([
      'intro',
      'details',
      'finish'
    ])
  })
  it('does not let stale answers on skipped pages activate later branches', () => {
    const s = fixture()
    s.pages.splice(2, 0, {
      id: 'decision',
      title,
      questionIds: [],
      sections: [],
      branches: [{ when: when('detail', 'stop'), destination: { kind: 'end' } }]
    })
    s.pages[0]!.branches[0]!.destination = { kind: 'page', pageId: 'decision' }
    expect(
      resolveSurvey(s, { eligible: 'no', detail: 'stop' }).pages.map((page) => page.id)
    ).toEqual(['intro', 'decision', 'finish'])
  })
  it('navigates only visited route pages, validates before next and prunes when going back', () => {
    const scope = effectScope()
    scope.run(() => {
      const answers = ref<SurveyAnswers>({})
      const flow = useSurveyFlow({
        definition: fixture(),
        answers,
        onChange: (value) => {
          answers.value = value
        }
      })
      expect(flow.next()).toBe(false)
      flow.setAnswer('eligible', 'yes')
      expect(flow.next()).toBe(true)
      expect(flow.page.value?.id).toBe('details')
      flow.setAnswer('detail', 'extra')
      flow.setAnswer('extra', 'old')
      flow.next()
      expect(flow.page.value?.id).toBe('finish')
      flow.back()
      flow.back()
      flow.setAnswer('eligible', 'no')
      expect(answers.value).toEqual({ eligible: 'no' })
      flow.next()
      expect(flow.page.value?.id).toBe('finish')
      flow.setAnswer('contact', 'bad')
      expect(flow.next()).toBe(false)
      flow.setAnswer('contact', 'a@example.test')
      expect(flow.next()).toBe(true)
      expect(flow.complete.value).toBe(true)
      flow.back()
      expect(flow.complete.value).toBe(false)
      flow.back()
      expect(flow.page.value?.id).toBe('intro')
    })
    scope.stop()
  })
})

describe('host and designer safety', () => {
  it('returns sanitized answers for persistence and reports unknown keys', async () => {
    const { validateSurveyAnswers } = await import('../src/index.js')
    expect(
      validateSurveyAnswers(fixture(), {
        eligible: 'no',
        detail: 'hidden',
        contact: 'a@example.test',
        injected: 'x'
      })
    ).toEqual({
      answers: { eligible: 'no', contact: 'a@example.test' },
      errors: { injected: 'unknown' }
    })
  })
  it('does not throw when controlled input contains an unknown answer', () => {
    const scope = effectScope()
    scope.run(() => {
      const flow = useSurveyFlow({
        definition: fixture(),
        answers: { eligible: 'no', contact: 'a@example.test', injected: 'x' },
        onChange: () => {}
      })
      expect(flow.next()).toBe(true)
      expect(flow.next()).toBe(false)
      expect(flow.errors.value).toEqual({ injected: 'unknown' })
      expect(flow.complete.value).toBe(false)
    })
    scope.stop()
  })
  it('preserves referenced questions and uses placement order in renderless fields', async () => {
    const { useSurveyDesigner, HeadlessSurvey } = await import('../src/vue.js')
    const { createSSRApp, h } = await import('vue')
    const { renderToString } = await import('vue/server-renderer')
    const definition = fixture(),
      designer = useSurveyDesigner(definition)
    expect(designer.remove('eligible')).toBe(false)
    expect(designer.definition.value.questions.some((question) => question.id === 'eligible')).toBe(
      true
    )
    definition.pages[0]!.questionIds = ['contact', 'eligible']
    definition.pages[2]!.questionIds = []
    expect(surveySchema.safeParse(definition).success).toBe(true)
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            HeadlessSurvey,
            { definition, modelValue: {} },
            {
              default: ({ fields }: import('../src/vue.js').SurveySlot) =>
                fields.map((field) => h('span', field.id))
            }
          )
      })
    )
    expect(html.indexOf('contact')).toBeLessThan(html.indexOf('eligible'))
  })
  it('evaluates visibility from earlier sibling sections and subsections', () => {
    const s = fixture()
    s.pages[1]!.sections[0]!.subsections = []
    s.pages[1]!.sections.push({
      id: 'sibling',
      title,
      visibleWhen: { match: 'all', conditions: [{ questionId: 'detail', operator: 'answered' }] },
      questionIds: ['extra'],
      subsections: []
    })
    expect(surveySchema.safeParse(s).success).toBe(true)
    expect(
      resolveSurvey(s, { eligible: 'yes', detail: 'ready' }).pages[1]!.sections.map(
        (section) => section.id
      )
    ).toEqual(['project', 'sibling'])
  })
})

it('resets completion when the host replaces controlled answers', () => {
  const scope = effectScope()
  scope.run(() => {
    const answers = ref<SurveyAnswers>({ eligible: 'no', contact: 'a@example.test' })
    const flow = useSurveyFlow({
      definition: fixture(),
      answers,
      onChange: (value) => {
        answers.value = value
      }
    })
    flow.next()
    flow.next()
    expect(flow.complete.value).toBe(true)
    answers.value = { eligible: 'no' }
    expect(flow.complete.value).toBe(false)
    expect(flow.next()).toBe(false)
  })
  scope.stop()
})

it('supports any-match and numeric comparisons without treating blanks or exponents as numbers', async () => {
  const { matchesCondition } = await import('../src/index.js')
  const condition: SurveyCondition = {
    match: 'any',
    conditions: [
      { questionId: 'n', operator: 'greaterThan', value: '-1' },
      { questionId: 'other', operator: 'equals', value: 'yes' }
    ]
  }
  const active = new Set(['n', 'other'])
  expect(matchesCondition(condition, { n: '0' }, active)).toBe(true)
  expect(matchesCondition(condition, { n: ' ', other: 'no' }, active)).toBe(false)
  expect(matchesCondition(condition, { n: '1e3' }, active)).toBe(false)
  expect(matchesCondition(condition, { n: '-2', other: 'yes' }, active)).toBe(true)
  expect(matchesCondition(condition, { other: 'yes' }, new Set())).toBe(false)
})
