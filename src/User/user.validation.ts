import { InferType, object, string } from 'yup';

export const registerBodySchema = object({
    name: string().max(30).required(),
    email: string().email().required(),
    password: string().required(),
});

export const loginBodySchema = object({
    email: string().email().required(),
    password: string().required(),
});
export const testSchema = object({
    body: object({
        email: string().email().required(),
        password: string().required(),
    }),
    params: object({
        id: string().uuid().required(),
    }),
});

export type TestSchemaBody = InferType<typeof testSchema.fields.body>;

export type RegisterUserBody = InferType<typeof registerBodySchema>;
export type LoginUserBody = InferType<typeof loginBodySchema>;

export default { registerBodySchema, loginBodySchema };
