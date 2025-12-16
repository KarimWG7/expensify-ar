"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPaymentMethods() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("paymentMethods") // check table name casing, it was paymentMethods in file
    .select("*")
    .or(`user_id.eq.${user.id},type.eq.admin_defined`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
