export function validate(schema, payload) {
  const { value, error } = schema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details?.map((d) => d.message) ?? ["invalid"];
    return { ok: false, error: "validation_error", details };
  }
  return { ok: true, value };
}

