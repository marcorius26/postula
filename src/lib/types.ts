export const APPLICATION_STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Fila de la tabla `public.applications`. */
export type Application = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  location: string | null;
  url: string | null;
  status: ApplicationStatus;
  applied_at: string | null;
  salary: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationInsert = Omit<
  Application,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ApplicationUpdate = Partial<ApplicationInsert>;

/** Tipado de la base de datos para los clientes de Supabase. */
export type Database = {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: ApplicationInsert;
        Update: ApplicationUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { application_status: ApplicationStatus };
    CompositeTypes: { [_ in never]: never };
  };
};

/** Resultado que devuelven las server actions a los formularios. */
export type ActionResult = {
  ok: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
};

export type ApplicationStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  /** Porcentaje (0–100) de candidaturas enviadas que han obtenido respuesta. */
  responseRate: number;
};
