import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Edit, Trash2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const authorId = post?.user?.id || post?.userId || post?.user_id;
  const isOwner = user && authorId === user.id;

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await apiClient.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError('Publicación no encontrada');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
        await apiClient.delete(`/posts/${id}`);
        navigate('/', { 
          state: { successMessage: "¡Publicación eliminada correctamente!" } 
        });
        
    } catch (err) {
        console.error("Error al eliminar", err);
        alert("No se pudo eliminar la publicación");
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4 mt-4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Publicación no encontrada'}</AlertDescription>
        </Alert>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a publicaciones
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <Link 
                  to={`/users/${post.user?.id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user?.avatarUrl} className="object-cover" />
                    <AvatarFallback>
                      {post.user ? getInitials(post.user.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.user?.name || 'Usuario'}</span>
                </Link>
                
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.created_at && !isNaN(new Date(post.created_at).getTime()) 
                    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })
                    : 'Recientemente'}
                </span>
              </div>
            </div>

            {(isOwner || user?.role === 'ADMIN') && (
              <div className="flex gap-2">
                <Link to={`/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;