import { describe, expect, it } from "vitest";
import {
  applicationFormToObject,
  applicationIdSchema,
  applicationSchema,
  credentialsSchema,
  filtersSchema,
  firstParam,
  toFieldErrors,
} from "@/lib/validation";

const validApplication = {
  company: "  Acme  ",
  position: "Desarrollador Frontend",
  location: "Madrid",
  url: "https://acme.com/empleo/123",
  status: "applied",
  applied_at: "2026-03-05",
  salary: "35.000 €",
  notes: "Contacto: Ana",
};

describe("credentialsSchema", () => {
  it("acepta credenciales válidas y normaliza el correo", () => {
    const result = credentialsSchema.safeParse({ email: "  Ana@Ejemplo.COM ", password: "secreto1" });
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("ana@ejemplo.com");
  });

  it("rechaza un correo inválido con mensaje en español", () => {
    const result = credentialsSchema.safeParse({ email: "no-es-correo", password: "secreto1" });
    expect(result.success).toBe(false);
    expect(result.error && toFieldErrors(result.error).email).toEqual([
      "Introduce un correo electrónico válido",
    ]);
  });

  it("acepta una contraseña de exactamente 6 caracteres", () => {
    expect(credentialsSchema.safeParse({ email: "a@b.es", password: "123456" }).success).toBe(true);
  });

  it("rechaza una contraseña de 5 caracteres", () => {
    const result = credentialsSchema.safeParse({ email: "a@b.es", password: "12345" });
    expect(result.success).toBe(false);
    expect(result.error && toFieldErrors(result.error).password).toEqual([
      "La contraseña debe tener al menos 6 caracteres",
    ]);
  });

  it("rechaza campos ausentes", () => {
    expect(credentialsSchema.safeParse({}).success).toBe(false);
  });
});

describe("applicationSchema", () => {
  it("acepta una candidatura completa y recorta espacios", () => {
    const result = applicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
    expect(result.data?.company).toBe("Acme");
    expect(result.data?.applied_at).toBe("2026-03-05");
  });

  it("convierte los campos opcionales vacíos en null", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      location: "",
      url: "   ",
      applied_at: "",
      salary: "",
      notes: "",
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      location: null,
      url: null,
      applied_at: null,
      salary: null,
      notes: null,
    });
  });

  it("rechaza una URL inválida", () => {
    const result = applicationSchema.safeParse({ ...validApplication, url: "no es una url" });
    expect(result.success).toBe(false);
    expect(result.error && toFieldErrors(result.error).url?.[0]).toMatch(/URL válida/);
  });

  it("rechaza URLs que no son http/https", () => {
    expect(applicationSchema.safeParse({ ...validApplication, url: "javascript:alert(1)" }).success).toBe(
      false,
    );
    expect(applicationSchema.safeParse({ ...validApplication, url: "ftp://acme.com" }).success).toBe(false);
  });

  it("exige empresa y puesto (no basta con espacios)", () => {
    const result = applicationSchema.safeParse({ ...validApplication, company: "   ", position: "" });
    expect(result.success).toBe(false);
    const errors = result.error ? toFieldErrors(result.error) : {};
    expect(errors.company).toEqual(["Indica la empresa"]);
    expect(errors.position).toEqual(["Indica el puesto"]);
  });

  it("rechaza un estado desconocido", () => {
    const result = applicationSchema.safeParse({ ...validApplication, status: "hired" });
    expect(result.success).toBe(false);
    expect(result.error && toFieldErrors(result.error).status).toEqual(["Selecciona un estado válido"]);
  });

  it("rechaza fechas imposibles o mal formateadas", () => {
    expect(applicationSchema.safeParse({ ...validApplication, applied_at: "2026-02-30" }).success).toBe(false);
    expect(applicationSchema.safeParse({ ...validApplication, applied_at: "05/03/2026" }).success).toBe(false);
  });

  it("respeta el límite de longitud de la empresa", () => {
    expect(applicationSchema.safeParse({ ...validApplication, company: "a".repeat(120) }).success).toBe(true);
    expect(applicationSchema.safeParse({ ...validApplication, company: "a".repeat(121) }).success).toBe(false);
  });
});

describe("applicationFormToObject", () => {
  it("solo extrae los campos conocidos e ignora user_id", () => {
    const formData = new FormData();
    formData.set("company", "Acme");
    formData.set("user_id", "otro-usuario");
    const object = applicationFormToObject(formData);
    expect(object.company).toBe("Acme");
    expect(object.notes).toBe("");
    expect("user_id" in object).toBe(false);
  });
});

describe("applicationIdSchema", () => {
  it("acepta un UUID y rechaza otros valores", () => {
    expect(applicationIdSchema.safeParse("3f2b8c1e-5d4a-4b6e-9f1a-2c3d4e5f6a7b").success).toBe(true);
    expect(applicationIdSchema.safeParse("123").success).toBe(false);
  });
});

describe("filtersSchema", () => {
  it("acepta un estado válido y recorta la búsqueda", () => {
    expect(filtersSchema.parse({ status: "offer", q: "  acme " })).toEqual({ status: "offer", q: "acme" });
  });

  it("ignora estados desconocidos y parámetros ausentes", () => {
    expect(filtersSchema.parse({ status: "todos" })).toEqual({ status: null, q: "" });
    expect(filtersSchema.parse({})).toEqual({ status: null, q: "" });
  });
});

describe("firstParam", () => {
  it("devuelve el primer valor de un array o el propio string", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam("x")).toBe("x");
    expect(firstParam(undefined)).toBeUndefined();
  });
});
