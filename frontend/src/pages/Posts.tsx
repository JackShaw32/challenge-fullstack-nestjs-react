import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Calendar, User, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const POSTS_PER_PAGE = 6;

const Posts: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMsg(location.state.successMessage);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const fetchPosts = async (pageNum: number) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const data = await apiClient.get(`/posts?page=${pageNum}&limit=${POSTS_PER_PAGE}`);

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      if (pageNum === 1) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error al cargar posts:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader><div className="h-6 bg-muted rounded w-3/4"></div></CardHeader>
              <CardContent><div className="h-20 bg-muted rounded"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {successMsg && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>¡Éxito!</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Publicaciones</h1>
          <p className="text-muted-foreground mt-1">
            Explora las últimas publicaciones de la comunidad
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/posts/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Publicación
            </Button>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No hay publicaciones aún.</p>
            {isAuthenticated && (
              <Link to="/posts/new">
                <Button className="mt-4">Crear la primera publicación</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {post.created_at &&
                    !isNaN(new Date(post.created_at).getTime())
                      ? new Date(post.created_at).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Fecha desconocida"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 break-words">
                    {post.content}
                  </p>
                </CardContent>

                <CardFooter>
                  <div
                    className="flex items-center gap-2 hover:underline z-10 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/users/${post.user?.id}`);
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={post.user?.avatarUrl}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs">
                        {post.user ? (
                          getInitials(post.user.name)
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {post.user?.name || "Usuario"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center pb-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[200px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más publicaciones"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;