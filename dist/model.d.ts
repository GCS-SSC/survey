import { z } from 'zod';
export declare const questionTypes: readonly ["text", "email", "number", "date", "select"];
export declare const identifier: z.ZodString;
export declare const bilingualText: z.ZodObject<{
    en: z.ZodString;
    fr: z.ZodString;
}, z.core.$strict>;
export declare const attachmentPolicySchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export type AttachmentPolicy = z.infer<typeof attachmentPolicySchema>;
export declare const legacySurveySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
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
export declare const bilingualDescription: z.ZodObject<{
    en: z.ZodString;
    fr: z.ZodString;
}, z.core.$strict>;
export declare const conditionOperators: readonly ["equals", "notEquals", "contains", "greaterThan", "lessThan", "answered", "notAnswered"];
export declare const conditionSchema: z.ZodObject<{
    match: z.ZodEnum<{
        any: "any";
        all: "all";
    }>;
    conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        questionId: z.ZodString;
        operator: z.ZodEnum<{
            equals: "equals";
            notEquals: "notEquals";
            contains: "contains";
            greaterThan: "greaterThan";
            lessThan: "lessThan";
        }>;
        value: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        questionId: z.ZodString;
        operator: z.ZodEnum<{
            answered: "answered";
            notAnswered: "notAnswered";
        }>;
    }, z.core.$strict>], "operator">>;
}, z.core.$strict>;
export type SurveyCondition = z.infer<typeof conditionSchema>;
export declare const questionV2Schema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"text">;
    maxLength: z.ZodDefault<z.ZodNumber>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"email">;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"number">;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"date">;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    required: z.ZodBoolean;
    type: z.ZodLiteral<"select">;
    options: z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    hint: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
}, z.core.$strict>], "type">;
export declare const subsectionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
    questionIds: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const sectionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    visibleWhen: z.ZodOptional<z.ZodObject<{
        match: z.ZodEnum<{
            any: "any";
            all: "all";
        }>;
        conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                equals: "equals";
                notEquals: "notEquals";
                contains: "contains";
                greaterThan: "greaterThan";
                lessThan: "lessThan";
            }>;
            value: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            questionId: z.ZodString;
            operator: z.ZodEnum<{
                answered: "answered";
                notAnswered: "notAnswered";
            }>;
        }, z.core.$strict>], "operator">>;
    }, z.core.$strict>>;
    questionIds: z.ZodArray<z.ZodString>;
    subsections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        description: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
        questionIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const destinationSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"page">;
    pageId: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    kind: z.ZodLiteral<"end">;
}, z.core.$strict>], "kind">;
export declare const pageSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    questionIds: z.ZodArray<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        description: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
        questionIds: z.ZodArray<z.ZodString>;
        subsections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
            description: z.ZodOptional<z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>>;
            visibleWhen: z.ZodOptional<z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>>;
            questionIds: z.ZodArray<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    branches: z.ZodArray<z.ZodObject<{
        when: z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>;
        destination: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"page">;
            pageId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"end">;
        }, z.core.$strict>], "kind">;
    }, z.core.$strict>>;
    next: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"page">;
        pageId: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        kind: z.ZodLiteral<"end">;
    }, z.core.$strict>], "kind">>;
}, z.core.$strict>;
declare const structuredSurveySchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    questions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"text">;
        maxLength: z.ZodDefault<z.ZodNumber>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"email">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"number">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"date">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"select">;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>], "type">>;
    pages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        description: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        questionIds: z.ZodArray<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
            description: z.ZodOptional<z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>>;
            visibleWhen: z.ZodOptional<z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>>;
            questionIds: z.ZodArray<z.ZodString>;
            subsections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>;
                description: z.ZodOptional<z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>>;
                visibleWhen: z.ZodOptional<z.ZodObject<{
                    match: z.ZodEnum<{
                        any: "any";
                        all: "all";
                    }>;
                    conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            equals: "equals";
                            notEquals: "notEquals";
                            contains: "contains";
                            greaterThan: "greaterThan";
                            lessThan: "lessThan";
                        }>;
                        value: z.ZodString;
                    }, z.core.$strict>, z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            answered: "answered";
                            notAnswered: "notAnswered";
                        }>;
                    }, z.core.$strict>], "operator">>;
                }, z.core.$strict>>;
                questionIds: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        branches: z.ZodArray<z.ZodObject<{
            when: z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>;
            destination: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"page">;
                pageId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"end">;
            }, z.core.$strict>], "kind">;
        }, z.core.$strict>>;
        next: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"page">;
            pageId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"end">;
        }, z.core.$strict>], "kind">>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type SurveyQuestion = z.infer<typeof questionV2Schema>;
export type SurveyPage = z.infer<typeof pageSchema>;
export type SurveySection = z.infer<typeof sectionSchema>;
export type SurveySubsection = z.infer<typeof subsectionSchema>;
export type SurveyDestination = z.infer<typeof destinationSchema>;
export type StructuredSurvey = z.infer<typeof structuredSurveySchema>;
export type LegacySurvey = z.infer<typeof legacySurveySchema>;
export type SurveyDefinition = LegacySurvey | StructuredSurvey;
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
export declare const surveyV1Schema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
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
export declare const surveyV2Schema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    questions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"text">;
        maxLength: z.ZodDefault<z.ZodNumber>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"email">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"number">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"date">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"select">;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>], "type">>;
    pages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        description: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        questionIds: z.ZodArray<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
            description: z.ZodOptional<z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>>;
            visibleWhen: z.ZodOptional<z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>>;
            questionIds: z.ZodArray<z.ZodString>;
            subsections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>;
                description: z.ZodOptional<z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>>;
                visibleWhen: z.ZodOptional<z.ZodObject<{
                    match: z.ZodEnum<{
                        any: "any";
                        all: "all";
                    }>;
                    conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            equals: "equals";
                            notEquals: "notEquals";
                            contains: "contains";
                            greaterThan: "greaterThan";
                            lessThan: "lessThan";
                        }>;
                        value: z.ZodString;
                    }, z.core.$strict>, z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            answered: "answered";
                            notAnswered: "notAnswered";
                        }>;
                    }, z.core.$strict>], "operator">>;
                }, z.core.$strict>>;
                questionIds: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        branches: z.ZodArray<z.ZodObject<{
            when: z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>;
            destination: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"page">;
                pageId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"end">;
            }, z.core.$strict>], "kind">;
        }, z.core.$strict>>;
        next: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"page">;
            pageId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"end">;
        }, z.core.$strict>], "kind">>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const surveySchema: z.ZodUnion<readonly [z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
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
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
    }, z.core.$strict>>;
    title: z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>;
    description: z.ZodOptional<z.ZodObject<{
        en: z.ZodString;
        fr: z.ZodString;
    }, z.core.$strict>>;
    questions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"text">;
        maxLength: z.ZodDefault<z.ZodNumber>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"email">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"number">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"date">;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        id: z.ZodString;
        label: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        required: z.ZodBoolean;
        type: z.ZodLiteral<"select">;
        options: z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        hint: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        visibleWhen: z.ZodOptional<z.ZodObject<{
            match: z.ZodEnum<{
                any: "any";
                all: "all";
            }>;
            conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    equals: "equals";
                    notEquals: "notEquals";
                    contains: "contains";
                    greaterThan: "greaterThan";
                    lessThan: "lessThan";
                }>;
                value: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                questionId: z.ZodString;
                operator: z.ZodEnum<{
                    answered: "answered";
                    notAnswered: "notAnswered";
                }>;
            }, z.core.$strict>], "operator">>;
        }, z.core.$strict>>;
    }, z.core.$strict>], "type">>;
    pages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>;
        description: z.ZodOptional<z.ZodObject<{
            en: z.ZodString;
            fr: z.ZodString;
        }, z.core.$strict>>;
        questionIds: z.ZodArray<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>;
            description: z.ZodOptional<z.ZodObject<{
                en: z.ZodString;
                fr: z.ZodString;
            }, z.core.$strict>>;
            visibleWhen: z.ZodOptional<z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>>;
            questionIds: z.ZodArray<z.ZodString>;
            subsections: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>;
                description: z.ZodOptional<z.ZodObject<{
                    en: z.ZodString;
                    fr: z.ZodString;
                }, z.core.$strict>>;
                visibleWhen: z.ZodOptional<z.ZodObject<{
                    match: z.ZodEnum<{
                        any: "any";
                        all: "all";
                    }>;
                    conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            equals: "equals";
                            notEquals: "notEquals";
                            contains: "contains";
                            greaterThan: "greaterThan";
                            lessThan: "lessThan";
                        }>;
                        value: z.ZodString;
                    }, z.core.$strict>, z.ZodObject<{
                        questionId: z.ZodString;
                        operator: z.ZodEnum<{
                            answered: "answered";
                            notAnswered: "notAnswered";
                        }>;
                    }, z.core.$strict>], "operator">>;
                }, z.core.$strict>>;
                questionIds: z.ZodArray<z.ZodString>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        branches: z.ZodArray<z.ZodObject<{
            when: z.ZodObject<{
                match: z.ZodEnum<{
                    any: "any";
                    all: "all";
                }>;
                conditions: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        equals: "equals";
                        notEquals: "notEquals";
                        contains: "contains";
                        greaterThan: "greaterThan";
                        lessThan: "lessThan";
                    }>;
                    value: z.ZodString;
                }, z.core.$strict>, z.ZodObject<{
                    questionId: z.ZodString;
                    operator: z.ZodEnum<{
                        answered: "answered";
                        notAnswered: "notAnswered";
                    }>;
                }, z.core.$strict>], "operator">>;
            }, z.core.$strict>;
            destination: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"page">;
                pageId: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
                kind: z.ZodLiteral<"end">;
            }, z.core.$strict>], "kind">;
        }, z.core.$strict>>;
        next: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"page">;
            pageId: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
            kind: z.ZodLiteral<"end">;
        }, z.core.$strict>], "kind">>;
    }, z.core.$strict>>;
}, z.core.$strict>]>;
/** Explicit editing upgrade; never mutates the archived source definition. */
export declare const upgradeSurvey: (definition: SurveyDefinition) => StructuredSurvey;
export {};
