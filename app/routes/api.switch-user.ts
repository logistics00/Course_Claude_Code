import { redirect } from "react-router";
import type { Route } from "./+types/api.switch-user";
import { setCurrentUserId } from "~/lib/session";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const userId = Number(formData.get("userId"));

  if (!userId || isNaN(userId)) {
    throw new Response("Invalid user ID", { status: 400 });
  }

  const cookie = await setCurrentUserId(request, userId);

  return redirect(new URL(request.url).searchParams.get("redirectTo") ?? "/", {
    headers: { "Set-Cookie": cookie },
  });
}
