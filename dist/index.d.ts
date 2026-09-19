import { z } from 'zod';
export declare const questionTypes: readonly ["text", "email", "number", "date", "select"];
export declare const bilingualText: z.ZodObject<{
    en: z.ZodString;
    fr: z.ZodString;
}, z.core.$strict>;
export declare const questionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"text">;
    maxLength: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"email">;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"number">;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"date">;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"select">;
    options: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>], "type">;
export declare const surveySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    questions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"text">;
        maxLength: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"email">;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"number">;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"date">;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"select">;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>;
    }, z.core.$strict>], "type">>;
}, z.core.$strict>;
export type SurveyDefinition = z.infer<typeof surveySchema>;
export type SurveyQuestion = z.infer<typeof questionSchema>;
export type SurveyAnswers = Record<string, string>;
export type SurveyError = 'required' | 'email' | 'number' | 'date' | 'choice' | 'length' | 'unknown';
export declare const answersSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export declare const isCalendarDate: (value: string) => boolean;
/** Same validator runs in any host renderer and at the API boundary. No coercion of blanks to zero. */
export declare const validateAnswers: (definition: SurveyDefinition, answers: SurveyAnswers, mode?: "draft" | "submit") => Record<string, SurveyError>;
