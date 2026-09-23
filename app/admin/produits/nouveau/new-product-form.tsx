"use client";

import { useState } from "react";
import { Check, ImagePlus, LoaderCircle, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Boutique = { id: string; nom: string };
type Preview = { file: File; url: string };
type Errors = Partial<Record<"nom" | "description" | "prix" | "stock" | "boutiqueId" | "images" | "form", string>>;

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { name: "Noir", value: "#161616" },
  { name: "Ivoire", value: "#f3eee5" },
  { name: "Sauge", value: "#829b83" },
  { name: "Terracotta", value: "#ba6c50" },
  { name: "Bleu nuit", value: "#253650" },
];

export function NewProductForm({ boutiques }: { boutiques: Boutique[] }) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [mainImage, setMainImage] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ nom: "", description: "", categorie: "", marque: "", prix: "", prixPromo: "", stock: "", sku: "", boutiqueId: "", statut: "brouillon" });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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
    setMainImage((current) => current > index ? current - 1 : Math.min(current, Math.max(0, previews.length - 2)));
  }

  function validate() {
    const next: Errors = {};
    if (values.nom.trim().length < 2) next.nom = "Le nom doit contenir au moins 2 caractères.";
    if (values.description.trim().length < 10) next.description = "Ajoutez une description d’au moins 10 caractères.";
    if (!Number.isFinite(Number(values.prix)) || Number(values.prix) <= 0) next.prix = "Saisissez un prix supérieur à 0.";
    if (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0) next.stock = "Le stock doit être un entier positif ou nul.";
    if (!values.boutiqueId) next.boutiqueId = "Sélectionnez une boutique.";
    if (!previews.length) next.images = "Ajoutez au moins une photo du produit.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      const productResponse = await fetch("/api/produits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom: values.nom.trim(), slug: `${values.nom.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, description: values.description.trim(), prix: Number(values.prix), prixPromo: values.prixPromo ? Number(values.prixPromo) : null, stock: Number(values.stock), boutiqueId: values.boutiqueId, categorie: values.categorie || null, marque: values.marque || null, sku: values.sku || null, tailles: selectedSizes, couleurs: selectedColors, statut: values.statut }) });
      const productData = await productResponse.json();
      if (!productResponse.ok) throw new Error(productData.error || "Le produit n’a pas pu être créé.");
      for (const [index, preview] of previews.entries()) {
        const upload = new FormData(); upload.append("file", preview.file);
        const uploadResponse = await fetch("/api/uploads", { method: "POST", body: upload });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.error || "L’image n’a pas pu être téléversée.");
        const imageResponse = await fetch(`/api/produits/${productData.id}/images`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: uploadData.url, ordre: index === mainImage ? 0 : index + 1 }) });
        if (!imageResponse.ok) throw new Error("L’image n’a pas pu être associée au produit.");
      }
      setSuccess(values.statut === "publie" ? "Produit publié avec succès." : "Produit enregistré comme brouillon.");
      setValues({ nom: "", description: "", categorie: "", marque: "", prix: "", prixPromo: "", stock: "", sku: "", boutiqueId: "", statut: "brouillon" });
      setPreviews([]); setMainImage(0);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Une erreur inattendue est survenue." });
    } finally { setLoading(false); }
  }

  const field = (name: keyof typeof values, value: string) => update(name, value);
  function submitWithStatus(status: "brouillon" | "publie") {
    setValues((current) => ({ ...current, statut: status }));
    window.setTimeout(() => (document.getElementById("new-product-form") as HTMLFormElement | null)?.requestSubmit(), 0);
  }

  return <form id="new-product-form" onSubmit={submit} noValidate className="mt-8 pb-28">
    {errors.form && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}
    {success && <p role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800"><Check className="h-4 w-4" />{success}</p>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-6">
        <section className="admin-card">
          <SectionTitle title="Informations générales" subtitle="Présentez votre article avec précision." />
          <Field label="Nom du produit" error={errors.nom}><input value={values.nom} onChange={(e) => field("nom", e.target.value)} className={inputClass(!!errors.nom)} placeholder="Ex. Veste oversize en laine" /></Field>
          <Field label="Description" error={errors.description}><textarea value={values.description} onChange={(e) => field("description", e.target.value)} className={`${inputClass(!!errors.description)} min-h-32 resize-y rounded-xl`} placeholder="Décrivez la coupe, la matière et les détails qui rendent cette pièce unique." /></Field>
          <div className="grid gap-5 md:grid-cols-2"><Field label="Catégorie"><select value={values.categorie} onChange={(e) => field("categorie", e.target.value)} className={inputClass(false)}><option value="">Sélectionner une catégorie</option><option>Vestes</option><option>Robes</option><option>Hauts</option><option>Pantalons</option><option>Accessoires</option></select></Field><Field label="Marque"><input value={values.marque} onChange={(e) => field("marque", e.target.value)} className={inputClass(false)} placeholder="Nom de la marque" /></Field></div>
        </section>
        <section className="admin-card"><SectionTitle title="Tarification et inventaire" subtitle="Définissez le prix de vente en francs CFA et la disponibilité." /><div className="grid gap-5 md:grid-cols-3"><Field label="Prix de vente" error={errors.prix}><div className="relative"><input type="number" min="1" step="1" value={values.prix} onChange={(e) => field("prix", e.target.value)} className={`${inputClass(!!errors.prix)} pr-16`} placeholder="25 000" /><span className="input-suffix">FCFA</span></div></Field><Field label="Prix promotionnel"><div className="relative"><input type="number" min="1" step="1" value={values.prixPromo} onChange={(e) => field("prixPromo", e.target.value)} className={`${inputClass(false)} pr-16`} placeholder="Optionnel" /><span className="input-suffix">FCFA</span></div></Field><Field label="Quantité en stock" error={errors.stock}><input type="number" min="0" step="1" value={values.stock} onChange={(e) => field("stock", e.target.value)} className={inputClass(!!errors.stock)} placeholder="0" /></Field></div><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Référence / SKU"><input value={values.sku} onChange={(e) => field("sku", e.target.value)} className={inputClass(false)} placeholder="VST-2026-001" /></Field><Field label="Boutique associée" error={errors.boutiqueId}><select value={values.boutiqueId} onChange={(e) => field("boutiqueId", e.target.value)} className={inputClass(!!errors.boutiqueId)}><option value="">Choisir une boutique</option>{boutiques.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}</select></Field></div></section>
        <section className="admin-card"><SectionTitle title="Variantes" subtitle="Aidez vos clients à choisir la bonne combinaison." /><div><label className="admin-label">Tailles disponibles</label><div className="mt-3 flex flex-wrap gap-2">{sizes.map((size) => <button type="button" key={size} onClick={() => setSelectedSizes((current) => current.includes(size) ? current.filter((item) => item !== size) : [...current, size])} className={`size-chip ${selectedSizes.includes(size) ? "size-chip-active" : ""}`}>{size}</button>)}</div></div><div className="mt-7"><label className="admin-label">Couleurs disponibles</label><div className="mt-3 flex flex-wrap gap-4">{colors.map((color) => <button type="button" key={color.name} onClick={() => setSelectedColors((current) => current.includes(color.name) ? current.filter((item) => item !== color.name) : [...current, color.name])} className="flex items-center gap-2 text-xs text-slate-600"><span className={`color-dot ${selectedColors.includes(color.name) ? "color-dot-active" : ""}`} style={{ backgroundColor: color.value }} />{color.name}</button>)}</div></div></section>
      </div>
      <div className="space-y-6"><section className="admin-card"><SectionTitle title="Photos du produit" subtitle="La première photo sera utilisée comme couverture." /><label className="upload-zone"><ImagePlus className="h-7 w-7 text-slate-400" /><span className="mt-3 text-sm font-medium text-slate-700">Glissez-déposez vos photos ici</span><span className="mt-1 text-xs text-slate-400">PNG, JPG ou WEBP · 5 Mo maximum</span><span className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">Ajouter des photos</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(e) => selectImages(e.target.files)} /></label>{errors.images && <p className="mt-3 text-xs text-red-600">{errors.images}</p>}<div className="mt-5 grid grid-cols-2 gap-3">{previews.map((preview, index) => <div key={`${preview.file.name}-${index}`} className={`group relative aspect-square overflow-hidden rounded-xl border ${index === mainImage ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200"}`}><img src={preview.url} alt={`Aperçu ${index + 1}`} className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/75 px-2 py-2 opacity-0 transition group-hover:opacity-100"><button type="button" onClick={() => setMainImage(index)} className="flex items-center gap-1 text-[10px] text-white">{index === mainImage ? <Star className="h-3 w-3 fill-gold-400 text-gold-400" /> : <Star className="h-3 w-3" />} Principale</button><button type="button" onClick={() => removeImage(index)} aria-label="Supprimer la photo" className="text-white"><X className="h-3.5 w-3.5" /></button></div>{index === mainImage && <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-700">Principale</span>}</div>)}</div></section><section className="admin-card"><SectionTitle title="Publication" subtitle="Choisissez la visibilité de cet article." /><div className="grid gap-2"><label className={`status-option ${values.statut === "brouillon" ? "status-option-active" : ""}`}><input type="radio" name="statut" value="brouillon" checked={values.statut === "brouillon"} onChange={(e) => field("statut", e.target.value)} /><span><strong>Brouillon</strong><small>Visible uniquement par l’équipe</small></span></label><label className={`status-option ${values.statut === "publie" ? "status-option-active" : ""}`}><input type="radio" name="statut" value="publie" checked={values.statut === "publie"} onChange={(e) => field("statut", e.target.value)} /><span><strong>Publié</strong><small>Visible dans la boutique</small></span></label></div></section></div>
    </div>
    <div className="admin-actions"><span className="text-xs text-slate-400">Les champs marqués sont nécessaires pour publier.</span><div className="flex gap-3"><Button type="button" variant="outline" disabled={loading} onClick={() => submitWithStatus("brouillon")}>Enregistrer comme brouillon</Button><Button type="button" disabled={loading} onClick={() => submitWithStatus("publie")}>{loading ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : "Publier le produit"}</Button></div></div>
  </form>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-5 border-b border-slate-100 pb-4"><h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>; }
function inputClass(error: boolean) { return `mt-2 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 ${error ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"}`; }
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="mt-4 block text-sm font-medium text-slate-700"><span className="admin-label">{label}</span>{children}{error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}</label>; }
