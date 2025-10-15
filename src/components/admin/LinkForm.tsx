import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, Upload } from "lucide-react";
import * as Icons from "lucide-react";

interface LinkFormProps {
  link?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LinkForm({ link, onSuccess, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState(link?.title || "");
  const [subtitle, setSubtitle] = useState(link?.subtitle || "");
  const [url, setUrl] = useState(link?.url || "");
  const [icon, setIcon] = useState(link?.icon || "Link");
  const [thumbnailUrl, setThumbnailUrl] = useState(link?.thumbnail_url || "");
  const [isActive, setIsActive] = useState(link?.is_active || false);
  const [displayOrder, setDisplayOrder] = useState(link?.display_order || 0);
  const [loading, setLoading] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const fetchMetadata = async () => {
    if (!url) return;
    
    setFetchingMetadata(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-url-metadata', {
        body: { url },
      });

      if (error) throw error;

      if (data.title && !title) setTitle(data.title);
      if (data.description && !subtitle) setSubtitle(data.description);
      if (data.image && !thumbnailUrl) setThumbnailUrl(data.image);

      toast({
        title: "Metadados carregados!",
        description: "Os dados foram extraídos do link.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao buscar metadados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetchingMetadata(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('link-thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('link-thumbnails')
        .getPublicUrl(filePath);

      setThumbnailUrl(publicUrl);
      
      toast({
        title: "Imagem enviada!",
        description: "O thumbnail foi atualizado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const linkData = {
        title,
        subtitle,
        url,
        icon,
        thumbnail_url: thumbnailUrl,
        is_active: isActive,
        display_order: displayOrder,
      };

      if (link) {
        const { error } = await supabase
          .from('highlighted_links')
          .update(linkData)
          .eq('id', link.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('highlighted_links')
          .insert([linkData]);

        if (error) throw error;
      }

      toast({
        title: link ? "Link atualizado!" : "Link criado!",
        description: "As alterações foram salvas.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL do Link *</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="url"
            placeholder="https://exemplo.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={fetchMetadata}
            disabled={fetchingMetadata || !url}
          >
            {fetchingMetadata ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          placeholder="Nome do botão"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Textarea
          id="subtitle"
          placeholder="Descrição breve"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Ícone (Lucide)</Label>
        <Input
          id="icon"
          placeholder="Link"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ex: Link, Star, Heart, etc.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <div className="flex gap-2">
          <Input
            id="thumbnail"
            type="url"
            placeholder="URL da imagem"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Preview"
            className="mt-2 h-20 w-20 rounded object-cover"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Ordem de Exibição</Label>
        <Input
          id="order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="active">Ativo</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {link ? "Atualizar" : "Criar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
