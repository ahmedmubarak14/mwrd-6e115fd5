
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageSquare, Search, Plus, User, Circle } from "lucide-react";
import { useState } from "react";

export const Messages = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations] = useState([]); // This will be populated from useRealTimeChat or similar hook
  const [loading] = useState(false);

  if (loading) {
    return (
      <CleanDashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('messages.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('messages.subtitle')}
          </p>
        </div>

        {/* Search and New Chat */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('messages.searchMessages')}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('messages.startNewChat')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('messages.noConversations')}</h3>
              <p className="text-muted-foreground">{t('messages.noConversationsDesc')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation: any) => (
              <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Circle className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 fill-current" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold truncate">{conversation.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {t('messages.online')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CleanDashboardLayout>
  );
};

export default Messages;
