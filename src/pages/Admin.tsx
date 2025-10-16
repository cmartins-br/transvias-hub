import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LinkForm } from "@/components/admin/LinkForm";
import { LogOut, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [deletingLink, setDeletingLink] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Verify user has admin role
      const { data: role, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error || !role) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem privilégios de administrador",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setUser(session.user);
      loadLinks();
    };

    verifyAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        verifyAdmin();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('highlighted_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar links",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleToggleActive = async (link: any) => {
    try {
      const { error } = await supabase
        .from('highlighted_links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);

      if (error) throw error;
      
      toast({
        title: link.is_active ? "Link desativado" : "Link ativado",
      });
      loadLinks();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingLink) return;

    try {
      const { error } = await supabase
        .from('highlighted_links')
        .delete()
        .eq('id', deletingLink.id);

      if (error) throw error;
      
      toast({
        title: "Link excluído",
      });
      setDeletingLink(null);
      loadLinks();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin - Links Destacados</h1>
            <p className="text-sm text-muted-foreground">
              Gerenciar links temporários do topo
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/")}>
              Ver Site
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Links Destacados</CardTitle>
              <Button onClick={() => { setEditingLink(null); setShowForm(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : links.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Nenhum link cadastrado ainda
              </p>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      {link.thumbnail_url && (
                        <img
                          src={link.thumbnail_url}
                          alt={link.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{link.title}</h3>
                        {link.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {link.subtitle}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Ordem: {link.display_order}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleActive(link)}
                      >
                        {link.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditingLink(link); setShowForm(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingLink(link)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Editar Link" : "Novo Link"}
            </DialogTitle>
          </DialogHeader>
          <LinkForm
            link={editingLink}
            onSuccess={() => {
              setShowForm(false);
              setEditingLink(null);
              loadLinks();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingLink(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingLink} onOpenChange={() => setDeletingLink(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o link "{deletingLink?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
