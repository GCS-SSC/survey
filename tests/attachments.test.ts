import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { HeadlessSurvey, type SurveySlot } from '../src/vue.js'
import { expect, it } from 'vitest'
import { surveySchema, upgradeSurvey } from '../src/index.js'
it('preserves optional attachment policy across versions without adding files to answers', () => {
  const original = { schemaVersion: 1, title: { en: 'Report', fr: 'Rapport' }, questions: [{ id: 'q', type: 'text', label: { en: 'Details', fr: 'Détails' }, required: false, maxLength: 200 }] }
  const legacy = surveySchema.parse(original)
  expect(legacy.attachments).toBeUndefined()
  const enabled = surveySchema.parse({ ...original, attachments: { enabled: true } })
  expect(surveySchema.parse(upgradeSurvey(enabled)).attachments).toEqual({ enabled: true })
  expect(surveySchema.safeParse({ ...original, attachments: { enabled: 'yes' } }).success).toBe(false)
  expect(surveySchema.safeParse({ ...original, attachments: { enabled: true, path: '/tmp' } }).success).toBe(false)
})

it('exposes attachment capability without rendering or adding file answers', async () => {
  for (const enabled of [undefined, false, true]) {
    const definition = surveySchema.parse({ schemaVersion: 1, title: { en: 'Form', fr: 'Formulaire' }, questions: [{ id: 'q', type: 'text', label: { en: 'Details', fr: 'Détails' }, required: false, maxLength: 200 }], ...(enabled === undefined ? {} : { attachments: { enabled } }) })
    const output = await renderToString(createSSRApp({ render: () => h(HeadlessSurvey, { definition, modelValue: {} }, { default: (slot: SurveySlot) => h('span', String(slot.attachmentsAllowed)) }) }))
    expect(output).toContain(String(enabled === true))
  }
})
