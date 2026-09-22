import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession, hasAdminAccess } from "@/lib/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session?.user || !hasAdminAccess(session.user.role)) {
      return NextResponse.json({ error: "Accès interdit." }, { status: 403 });
    }
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier image requis." }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Format accepté : JPG, PNG, WEBP ou GIF." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "L’image doit faire moins de 5 Mo." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
    const parsed = z.string().url().safeParse(dataUrl);

    if (!parsed.success) {
      return NextResponse.json({ error: "Image invalide." }, { status: 400 });
    }

    return NextResponse.json({ url: dataUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "L’image n’a pas pu être téléversée." }, { status: 500 });
  }
}
