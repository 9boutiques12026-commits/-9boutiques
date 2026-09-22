"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Boutique = { id: string; nom: string };
type Preview = { file: File; url: string };

type Errors = Partial<Record<"nom" | "description" | "prix" | "stock" | "boutiqueId" | "images" | "form", string>>;

export function NewProductForm({ boutiques }: { boutiques: Boutique[] }) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ nom: "", description: "", prix: "", stock: "", boutiqueId: "" });

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  }

  function selectImages(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).filter((file) => file.type.startsWith("image/")).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((current) => [...current, ...next].slice(0, 8));
    setErrors((current) => ({ ...current, images: undefined }));
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index].url);
    setPreviews((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function validate() {
    const next: Errors = {};
    if (values.nom.trim().length < 2) next.nom = "Le nom doit contenir au moins 2 caractères.";
    if (values.description.trim().length < 10) next.description = "La description doit contenir au moins 10 caractères.";
    if (!Number.isFinite(Number(values.prix)) || Number(values.prix) <= 0) next.prix = "Saisissez un prix supérieur à 0.";
    if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) next.stock = "Le stock doit être un entier positif ou nul.";
    if (!values.boutiqueId) next.boutiqueId = "Sélectionnez une boutique.";
    if (!previews.length) next.images = "Ajoutez au moins une image.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);

    try {
      const productResponse = await fetch("/api/produits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom: values.nom.trim(), slug: `${values.nom.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, description: values.description.trim(), prix: Number(values.prix), stock: Number(values.stock), boutiqueId: values.boutiqueId }) });
      const productData = await productResponse.json();
      if (!productResponse.ok) throw new Error(productData.error || "Le produit n’a pas pu être créé.");

      for (const [index, preview] of previews.entries()) {
        const upload = new FormData();
        upload.append("file", preview.file);
        const uploadResponse = await fetch("/api/uploads", { method: "POST", body: upload });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.error || "L’image n’a pas pu être téléversée.");
        const imageResponse = await fetch(`/api/produits/${productData.id}/images`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: uploadData.url, ordre: index }) });
        if (!imageResponse.ok) throw new Error("L’image n’a pas pu être associée au produit.");
      }

      setValues({ nom: "", description: "", prix: "", stock: "", boutiqueId: "" });
      setPreviews([]);
      setSuccess("Produit créé et image(s) enregistrée(s) avec succès.");
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Une erreur inattendue est survenue." });
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={submit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
    <section className="rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-7 shadow-luxe">
      {errors.form && <p role="alert" className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
      {success && <p role="status" className="mb-6 rounded-2xl bg-forest-50 px-4 py-3 text-sm text-forest-800">{success}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nom" error={errors.nom}><input value={values.nom} onChange={(event) => update("nom", event.target.value)} className={inputClass(Boolean(errors.nom))} placeholder="Manteau Alba" /></Field>
        <Field label="Boutique associée" error={errors.boutiqueId}><select value={values.boutiqueId} onChange={(event) => update("boutiqueId", event.target.value)} className={inputClass(Boolean(errors.boutiqueId))}><option value="">Choisir une boutique</option>{boutiques.map((boutique) => <option key={boutique.id} value={boutique.id}>{boutique.nom}</option>)}</select></Field>
        <Field label="Prix (€)" error={errors.prix}><input type="number" min="0.01" step="0.01" value={values.prix} onChange={(event) => update("prix", event.target.value)} className={inputClass(Boolean(errors.prix))} placeholder="189.00" /></Field>
        <Field label="Stock" error={errors.stock}><input type="number" min="0" step="1" value={values.stock} onChange={(event) => update("stock", event.target.value)} className={inputClass(Boolean(errors.stock))} placeholder="12" /></Field>
      </div>
      <Field label="Description" error={errors.description}><textarea value={values.description} onChange={(event) => update("description", event.target.value)} className={`${inputClass(Boolean(errors.description))} min-h-36 rounded-3xl`} placeholder="Décrivez la matière, la coupe et l'intention de la pièce." /></Field>
      <Button type="submit" disabled={loading} className="mt-6">{loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : "Créer le produit"}</Button>
    </section>
    <section className="h-fit rounded-[2rem] border border-forest-700/10 bg-ivory-50 p-7"><div className="flex items-center justify-between"><div><p className="badge">Visuels</p><p className="mt-3 text-sm text-forest-800/65">JPG, PNG, WEBP ou GIF · 5 Mo max.</p></div><label className="cursor-pointer rounded-full border border-forest-700/15 p-3 text-forest-800 hover:bg-forest-50"><ImagePlus className="h-5 w-5" /><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(event) => selectImages(event.target.files)} /></label></div>{errors.images && <p className="mt-4 text-sm text-red-700">{errors.images}</p>}<div className="mt-6 grid grid-cols-2 gap-3">{previews.map((preview, index) => <div key={`${preview.file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl bg-ivory-200"><img src={preview.url} alt={`Aperçu ${index + 1}`} className="h-full w-full object-cover" /><button type="button" aria-label="Retirer l’image" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-full bg-forest-900/80 p-1.5 text-white"><X className="h-3.5 w-3.5" /></button></div>)}</div></section>
  </form>;
}

function inputClass(error: boolean) { return `mt-2 w-full border bg-white px-4 py-3 text-sm text-forest-900 outline-none ${error ? "border-red-500 ring-2 ring-red-100" : "border-forest-700/10 focus:border-forest-500"} rounded-full`; }
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="mt-5 block text-sm font-medium text-forest-800">{label}{children}{error && <span className="mt-1 block text-xs font-normal text-red-700">{error}</span>}</label>; }
