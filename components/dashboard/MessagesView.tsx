"use client";

import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { MessageSquare, Search, Send, User } from "lucide-react";

export default function MessagesView({ role, sidebarLinks }: { role: string, sidebarLinks: any[] }) {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");

  const conversations = [
    { id: 1, name: "Rahul (Agent)", lastMessage: "Yes, the property is still available.", time: "10:30 AM", unread: 2 },
    { id: 2, name: "Sneha (Buyer)", lastMessage: "Can we schedule a visit tomorrow?", time: "Yesterday", unread: 0 },
    { id: 3, name: "System Admin", lastMessage: "Your property has been approved.", time: "2 days ago", unread: 0 },
  ];

  return (
    <DashboardLayout role={role} links={sidebarLinks}>
      <div style={{ display: "flex", height: "calc(100vh - 120px)", background: "white", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden" }}>
        
        {/* Chat List */}
        <div style={{ width: "320px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Messages</h2>
            <div style={{ position: "relative" }}>
              <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 12 }} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.875rem" }}
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                style={{ 
                  padding: "1rem 1.5rem", 
                  borderBottom: "1px solid var(--border)", 
                  cursor: "pointer",
                  background: activeChat === chat.id ? "#f8fafc" : "transparent",
                  display: "flex",
                  gap: "1rem"
                }}
                className="hover-bg-light"
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.875rem" }}>{chat.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{chat.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div style={{ background: "#3b82f6", color: "white", fontSize: "0.75rem", fontWeight: "bold", padding: "0.125rem 0.5rem", borderRadius: "999px", height: "fit-content" }}>
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f8fafc" }}>
          {activeChat ? (
            <>
              <div style={{ padding: "1.5rem", background: "white", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{conversations.find(c => c.id === activeChat)?.name}</h3>
                  <span style={{ fontSize: "0.75rem", color: "#16a34a", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }}></div> Online
                  </span>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ alignSelf: "center", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1rem" }}>Today</div>
                
                <div style={{ display: "flex", gap: "1rem", maxWidth: "80%" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
                    <User size={16} />
                  </div>
                  <div style={{ background: "white", padding: "1rem", borderRadius: "12px", borderTopLeftRadius: 0, border: "1px solid var(--border)" }}>
                    <p style={{ margin: 0, fontSize: "0.875rem" }}>Hello! Is the property at Jubilee Hills still available?</p>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", display: "block", marginTop: "0.5rem", textAlign: "right" }}>10:28 AM</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", maxWidth: "80%", alignSelf: "flex-end", flexDirection: "row-reverse" }}>
                  <div style={{ background: "var(--primary)", color: "white", padding: "1rem", borderRadius: "12px", borderTopRightRadius: 0 }}>
                    <p style={{ margin: 0, fontSize: "0.875rem" }}>Yes, it is! Would you like to schedule a site visit?</p>
                    <span style={{ fontSize: "0.65rem", color: "#e0f2fe", display: "block", marginTop: "0.5rem", textAlign: "right" }}>10:30 AM</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "1rem", background: "white", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                  <button className="btn btn-primary" style={{ padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              <MessageSquare size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
