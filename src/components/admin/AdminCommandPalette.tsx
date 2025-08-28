import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Tag, Rocket, UserPlus, Search, BarChart3, CreditCard } from "lucide-react";

interface SearchUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
}

interface SearchRequest {
  id: string;
  title: string;
  description: string;
  admin_approval_status: string | null;
}

interface SearchOffer {
  id: string;
  title: string;
  description: string;
  client_approval_status: string | null;
}

export const AdminCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [requests, setRequests] = useState<SearchRequest[]>([]);
  const [offers, setOffers] = useState<SearchOffer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setUsers([]);
      setRequests([]);
      setOffers([]);
    }
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setUsers([]);
      setRequests([]);
      setOffers([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const [usersRes, reqsRes, offersRes] = await Promise.all([
          supabase
            .from("user_profiles")
            .select("id,email,full_name,company_name,role")
            .or(`email.ilike.%${q}%,full_name.ilike.%${q}%,company_name.ilike.%${q}%`)
            .limit(5),
          supabase
            .from("requests")
            .select("id,title,description,admin_approval_status")
            .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
            .limit(5),
          supabase
            .from("offers")
            .select("id,title,description,client_approval_status")
            .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
            .limit(5),
        ]);

        setUsers((usersRes.data as any) || []);
        setRequests((reqsRes.data as any) || []);
        setOffers((offersRes.data as any) || []);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const quickActions = useMemo(
    () => [
      {
        icon: <Users className="h-4 w-4" />,
        label: "Go to Users",
        action: () => navigate("/admin/users"),
      },
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: "Create new user",
        action: () => navigate("/admin/users?action=create"),
      },
      {
        icon: <FileText className="h-4 w-4" />,
        label: "Review Requests",
        action: () => navigate("/admin/requests"),
      },
      {
        icon: <Tag className="h-4 w-4" />,
        label: "Manage Offers",
        action: () => navigate("/admin/offers"),
      },
      {
        icon: <BarChart3 className="h-4 w-4" />,
        label: "View Analytics",
        action: () => navigate("/admin/analytics"),
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "Financial Transactions",
        action: () => navigate("/admin/financial-transactions"),
      },
    ], [navigate]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search users, requests, offers… (⌘/Ctrl K)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{loading ? "Searching…" : "No results found."}</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {quickActions.map((a) => (
            <CommandItem
              key={a.label}
              onSelect={() => {
                a.action();
                setOpen(false);
              }}
            >
              {a.icon}
              <span className="ml-2">{a.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {users.length > 0 && (
          <CommandGroup heading="Users">
            {users.map((u) => (
              <CommandItem
                key={u.id}
                onSelect={() => {
                  navigate("/admin/users");
                  setOpen(false);
                }}
              >
                <Users className="h-4 w-4" />
                <span className="ml-2">{u.full_name || u.email}</span>
                <span className="ml-auto text-xs text-foreground opacity-75">{u.role}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {requests.length > 0 && (
          <CommandGroup heading="Requests">
            {requests.map((r) => (
              <CommandItem
                key={r.id}
                onSelect={() => {
                  navigate("/admin/requests");
                  setOpen(false);
                }}
              >
                <FileText className="h-4 w-4" />
                <span className="ml-2 truncate">{r.title}</span>
                <span className="ml-auto text-xs text-foreground opacity-75">{r.admin_approval_status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {offers.length > 0 && (
          <CommandGroup heading="Offers">
            {offers.map((o) => (
              <CommandItem
                key={o.id}
                onSelect={() => {
                  navigate("/admin/offers");
                  setOpen(false);
                }}
              >
                <Tag className="h-4 w-4" />
                <span className="ml-2 truncate">{o.title}</span>
                <span className="ml-auto text-xs text-foreground opacity-75">{o.client_approval_status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
