import { supabase } from "@/integrations/supabase/client";

export type AdvisorMode =
  | "planting-advisor"
  | "earth-application"
  | "crop-hub"
  | "controlled-environment";

export async function askAdvisor(
  mode: AdvisorMode,
  payload: Record<string, unknown>
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("agri-advisor", {
    body: { mode, payload },
  });

  if (error) {
    throw new Error(
      "The advisor could not answer right now. Please try again in a moment."
    );
  }
  if (data?.error) throw new Error(data.error as string);

  return (data?.text as string) || "No guidance was returned. Please try again.";
}
