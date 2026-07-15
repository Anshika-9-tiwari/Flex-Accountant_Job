// src/Components/Dashboard/MessagesPage.tsx

"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Loader2,
  Mail,
  MessageCircle,
  Search,
  Send,
  User,
} from "lucide-react";

type UserRole = "JOBSEEKER" | "EMPLOYER" | "ADMIN";

type MessageContact = {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  subtitle: string;
  companyName: string | null;
  relatedJobTitle: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
  };
};

type MessagesPageProps = {
  userType: "jobseeker" | "employer" | "admin";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatContactTime(value: string | null) {
  if (!value) return "No messages";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function MessagesPage({ userType }: MessagesPageProps) {
  const [currentUserId, setCurrentUserId] = useState("");
  const [contacts, setContacts] = useState<MessageContact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch("/api/messages/contacts", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch contacts.");
          return;
        }

        setCurrentUserId(data.currentUser.id);
        setContacts(data.contacts || []);

        if (data.contacts?.length > 0) {
          setSelectedContactId(data.contacts[0].userId);
        }
      } catch {
        setError("Something went wrong while loading contacts.");
      } finally {
        setContactsLoading(false);
      }
    }

    fetchContacts();
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedContactId) return;

      setMessagesLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/messages/${selectedContactId}`, {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch conversation.");
          return;
        }

        setMessages(data.messages || []);

        setContacts((currentContacts) =>
          currentContacts.map((contact) =>
            contact.userId === selectedContactId
              ? {
                  ...contact,
                  unreadCount: 0,
                }
              : contact
          )
        );
      } catch {
        setError("Something went wrong while loading conversation.");
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();
  }, [selectedContactId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const keyword = search.toLowerCase();

      return (
        contact.name.toLowerCase().includes(keyword) ||
        contact.email.toLowerCase().includes(keyword) ||
        contact.subtitle.toLowerCase().includes(keyword) ||
        (contact.companyName || "").toLowerCase().includes(keyword) ||
        (contact.relatedJobTitle || "").toLowerCase().includes(keyword)
      );
    });
  }, [contacts, search]);

  const selectedContact = contacts.find(
    (contact) => contact.userId === selectedContactId
  );

  const title =
    userType === "employer"
      ? "Employer Messages"
      : userType === "admin"
      ? "Admin Messages"
      : "Jobseeker Messages";

  const description =
    userType === "employer"
      ? "Message jobseekers who applied to your jobs."
      : userType === "admin"
      ? "Message platform users from one place."
      : "Message employers after applying to their jobs.";

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedContactId || !newMessage.trim()) return;

    setError("");
    setSending(true);

    try {
      const response = await fetch(`/api/messages/${selectedContactId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          body: newMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send message.");
        return;
      }

      const sentMessage: ChatMessage = data.chatMessage;

      setMessages((currentMessages) => [...currentMessages, sentMessage]);

      setContacts((currentContacts) =>
        currentContacts
          .map((contact) =>
            contact.userId === selectedContactId
              ? {
                  ...contact,
                  lastMessage: sentMessage.body,
                  lastMessageAt: sentMessage.createdAt,
                }
              : contact
          )
          .sort((a, b) => {
            const aTime = a.lastMessageAt
              ? new Date(a.lastMessageAt).getTime()
              : 0;
            const bTime = b.lastMessageAt
              ? new Date(b.lastMessageAt).getTime()
              : 0;

            return bTime - aTime;
          })
      );

      setNewMessage("");
    } catch {
      setError("Something went wrong while sending message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            Messages
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
            {description}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid min-h-[680px] gap-6 xl:grid-cols-[360px_1fr]">
        {/* Contacts */}
        <aside className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-base-300 p-5">
            <h2 className="text-xl font-extrabold text-[#2c2935]">
              Conversations
            </h2>

            <div className="mt-4 flex items-center rounded-xl border border-base-300 bg-white px-4">
              <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search contacts..."
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {contactsLoading && (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Loading contacts...
                </p>
              </div>
            </div>
          )}

          {!contactsLoading && filteredContacts.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <MessageCircle className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
                No contacts found
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {userType === "employer"
                  ? "Jobseekers will appear here after they apply to your jobs."
                  : "Employers will appear here after you apply to their jobs."}
              </p>
            </div>
          )}

          {!contactsLoading && filteredContacts.length > 0 && (
            <div className="max-h-[590px] overflow-y-auto p-3">
              {filteredContacts.map((contact) => {
                const selected = selectedContactId === contact.userId;

                return (
                  <button
                    key={contact.userId}
                    type="button"
                    onClick={() => setSelectedContactId(contact.userId)}
                    className={`w-full rounded-2xl p-4 text-left transition ${
                      selected
                        ? "bg-[#0b5f68] text-white"
                        : "hover:bg-[#f5f7fb]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {contact.image ? (
                        <img
                          src={contact.image}
                          alt={contact.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-extrabold ${
                            selected
                              ? "bg-white/15 text-white"
                              : "bg-[#0b5f68] text-white"
                          }`}
                        >
                          {getInitials(contact.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className={`truncate font-extrabold ${
                              selected ? "text-white" : "text-[#2c2935]"
                            }`}
                          >
                            {contact.name}
                          </h3>

                          {contact.unreadCount > 0 && (
                            <span className="rounded-full bg-[#ff7900] px-2 py-0.5 text-xs font-bold text-white">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-1 truncate text-sm font-semibold ${
                            selected ? "text-white/75" : "text-slate-500"
                          }`}
                        >
                          {contact.subtitle}
                        </p>

                        <p
                          className={`mt-2 truncate text-sm ${
                            selected ? "text-white/70" : "text-slate-400"
                          }`}
                        >
                          {contact.lastMessage || "No messages yet"}
                        </p>

                        <p
                          className={`mt-2 text-xs font-semibold ${
                            selected ? "text-white/60" : "text-slate-400"
                          }`}
                        >
                          {formatContactTime(contact.lastMessageAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Conversation */}
        <main className="flex min-h-[680px] flex-col rounded-2xl bg-white shadow-sm">
          {!selectedContact ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                  <MessageCircle className="h-8 w-8" />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                  Select a conversation
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  Choose a contact from the left side to view and send messages.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b border-base-300 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    {selectedContact.image ? (
                      <img
                        src={selectedContact.image}
                        alt={selectedContact.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b5f68] text-lg font-extrabold text-white">
                        {getInitials(selectedContact.name)}
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-extrabold text-[#2c2935]">
                        {selectedContact.name}
                      </h2>

                      <p className="text-sm font-semibold text-slate-500">
                        {selectedContact.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    {selectedContact.companyName && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#0b5f68]/10 px-3 py-2 text-[#0b5f68]">
                        <Building2 className="h-4 w-4" />
                        {selectedContact.companyName}
                      </span>
                    )}

                    {selectedContact.relatedJobTitle && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#ff7900]/10 px-3 py-2 text-[#ff7900]">
                        <BriefcaseBusiness className="h-4 w-4" />
                        {selectedContact.relatedJobTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                  >
                    <Mail className="h-4 w-4" />
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-[#f5f7fb] p-5">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Loading messages...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#ff7900]">
                        <MessageCircle className="h-8 w-8" />
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
                        No messages yet
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Send the first message to start the conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const mine = message.senderId === currentUserId;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[82%] rounded-2xl px-5 py-4 shadow-sm sm:max-w-[70%] ${
                              mine
                                ? "rounded-br-sm bg-[#0b5f68] text-white"
                                : "rounded-bl-sm bg-white text-[#2c2935]"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {message.body}
                            </p>

                            <p
                              className={`mt-2 text-xs font-semibold ${
                                mine ? "text-white/60" : "text-slate-400"
                              }`}
                            >
                              {formatDateTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-base-300 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center rounded-xl border border-base-300 bg-white px-4">
                    <User className="mr-3 h-5 w-5 text-[#ff7900]" />
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(event) => setNewMessage(event.target.value)}
                      placeholder="Type your message..."
                      className="w-full bg-transparent py-3 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#e86e00]"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>
    </section>
  );
}