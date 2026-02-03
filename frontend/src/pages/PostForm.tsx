import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { apiClient } from '@/api/client';
import { Post } from '@/types';

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isEditing = !!id;
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(isEditing);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isEditing && id) {
      const fetchPost = async () => {
        try {
          const data = await apiClient.get(`/posts/${id}`);

          setPost(data);
          setTitle(data?.title || '');
          setContent(data?.content || '');

          const authorId = data?.user?.id || data?.userId || data?.user_id;
        } catch (error) {
          setError(
            error?.response?.data?.message ||
            "Publicación no encontrada o error de conexión"
          );
        } finally {
          setIsLoadingPost(false);
        }
      };

      fetchPost();
    }
  }, [id, isEditing, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Título y contenido son requeridos');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && id) {
        await apiClient.put(`/posts/${id}`, {
          title: title.trim(),
          content: content.trim(),
        });
        navigate(`/posts/${id}`);
      } else {
        const response = await apiClient.post('/posts', {
          title: title.trim(),
          content: content.trim(),
        });

        const newPostId = response.id;
        if (newPostId) {
          navigate(`/posts/${newPostId}`);
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la publicación');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mt-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Escribe un título atractivo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                placeholder="Escribe el contenido de tu publicación..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isLoading}
                rows={8}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Guardar Cambios' : 'Publicar'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default PostForm;