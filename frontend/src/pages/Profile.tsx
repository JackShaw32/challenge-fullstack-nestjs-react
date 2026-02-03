import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Edit, Loader2, Save, X, Camera } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  created_at?: string;
  createdAt?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  userId?: string;  
  user_id?: string;
  user?: { id: string };
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState<string>(''); 
  const [isSaving, setIsSaving] = useState(false);
  const isOwner = currentUser && profileUser && String(currentUser.id) === String(profileUser.id);

  useEffect(() => {
    const fetchProfileData = async () => {
      const targetId = id || currentUser?.id;
      if (!targetId) return;

      setIsLoading(true);
      try {
        const userData = await apiClient.get(`/users/${targetId}`);
        setProfileUser(userData);
        setEditName(userData.name);
        setEditAvatar(userData.avatarUrl || '');
        
        const postsData = await apiClient.get("/posts");
        const myPosts = postsData.filter((p: Post) => {
            const authorId = p.userId || p.user_id || p.user?.id;
            return String(authorId) === String(targetId);
        });
        
        setUserPosts(myPosts);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, currentUser?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es muy pesada. Máximo 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;

    setIsSaving(true);
    const targetId = id || currentUser?.id;

    try {
      const payload = { 
        name: editName.trim(),
        avatarUrl: editAvatar 
      };

      await apiClient.put(`/users/${targetId}`, payload);
      setProfileUser(prev => prev ? { ...prev, ...payload } : null);

      if (isOwner) {
         updateUser(payload);
      }

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : 'U';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error || !profileUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}><ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 text-2xl border-2 border-transparent group-hover:border-primary/20 transition-all">
                  <AvatarImage src={isEditing ? editAvatar : profileUser.avatarUrl} className="object-cover" />
                  <AvatarFallback>{getInitials(profileUser.name)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div 
                    onClick={triggerFileInput}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Cambiar foto"
                  >
                    <Camera className="text-white h-8 w-8" />
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  title="Cambiar foto de perfil"
                  aria-label="Cambiar foto de perfil"
                />
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Label>Editar Nombre</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        disabled={isSaving}
                        autoFocus
                      />
                      <Button size="icon" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Haz clic en la foto para cambiarla</p>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{profileUser.name}</CardTitle>
                    <CardDescription>{profileUser.email}</CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      Unido el{" "}
                      {(profileUser.created_at || profileUser.createdAt)
                        ? format(new Date(profileUser.created_at || profileUser.createdAt!), "PPP", { locale: es })
                        : "Fecha no disponible"}
                    </p>
                  </>
                )}
              </div>
            </div>

            {isOwner && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-8 bg-muted/20 rounded-md border border-dashed">
            <p className="text-muted-foreground">
              {isOwner ? "No has publicado nada aún." : "Este usuario no tiene publicaciones."}
            </p>
            {isOwner && (
                <Button variant="link" onClick={() => navigate('/posts/new')}>
                    Crear mi primera publicación
                </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {userPosts.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`} className="block">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {post.created_at
                        ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })
                        : "Reciente"}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;