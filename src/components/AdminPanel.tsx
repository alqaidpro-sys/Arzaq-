import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

interface Job {
  id: number;
  type: string;
  title: string;
  catId: string;
  sub?: string;
  loc: string;
  price: number;
  unit: string;
  urgent: boolean;
  age: string;
  views: number;
  apps: number;
  poster: string;
  pName: string;
  verified: boolean;
  stars: number;
  desc: string;
  status?: "active" | "pending" | "completed" | "rejected";
  images?: string[];
}

interface AdBanner {
  id: string;
  title: string;
  desc: string;
  imgUrl: string;
  linkText: string;
  tag: string;
}

interface UserProfile {
  uid: string;
  name: string;
  city: string;
  locationDetail: string;
  phone: string;
  verified: boolean;
  rating: number;
  since: string;
  walletBalance: number;
  bio: string;
  skills: string[];
  experience: string;
  avatarColor: string;
  role?: string;
  email?: string;
}

interface AdminPanelProps {
  t: any;
  dark: boolean;
  jobsList: Job[];
  usersList: UserProfile[];
  adsConfig: Record<string, AdBanner>;
  currentUserEmail: string;
  currentUserId: string;
  onSaveAd: (adId: string, updatedAd: AdBanner) => void;
  onBack: () => void;
}

export const AdminPanel = ({
  t,
  dark,
  jobsList,
  usersList,
  adsConfig,
  currentUserEmail,
  currentUserId,
  onSaveAd,
  onBack
}: AdminPanelProps) => {
  const [activeSubTab, setActiveSubTab] = useState<"users" | "jobs" | "banners">("users");
  const [jobFilter, setJobFilter] = useState<"all" | "pending" | "active" | "rejected">("pending");
  const [editingAdKey, setEditingAdKey] = useState<string | null>(null);

  // Ad banner state helpers
  const [editedAdTitle, setEditedAdTitle] = useState("");
  const [editedAdDesc, setEditedAdDesc] = useState("");
  const [editedAdImg, setEditedAdImg] = useState("");
  const [editedAdLink, setEditedAdLink] = useState("");
  const [editedAdTag, setEditedAdTag] = useState("");

  const isMasterAdmin = currentUserEmail.toLowerCase() === "alqaidpro@gmail.com";

  // Actions
  const handleToggleVerifyUser = async (user: UserProfile) => {
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, { verified: !user.verified }, { merge: true });
    } catch (err) {
      console.error("Error setting verification status:", err);
    }
  };

  const handleToggleManagerRole = async (user: UserProfile) => {
    if (!isMasterAdmin) {
      alert("عذراً، يحق للأدمن الرئيسي فقط (alQaidPro@gmail.com) تعيين أو إلغاء رتبة مدير الموقع المدير!");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const newRole = user.role === "manager" ? "user" : "manager";
    try {
      await setDoc(userRef, { role: newRole }, { merge: true });
    } catch (err) {
      console.error("Error toggling manager role:", err);
    }
  };

  const handleApproveJob = async (jobId: number) => {
    const jobRef = doc(db, "jobs", String(jobId));
    try {
      await setDoc(jobRef, { status: "active", verified: true }, { merge: true });
    } catch (err) {
      console.error("Error approving advertisement:", err);
    }
  };

  const handleRejectJob = async (jobId: number) => {
    const jobRef = doc(db, "jobs", String(jobId));
    try {
      await setDoc(jobRef, { status: "rejected" }, { merge: true });
    } catch (err) {
      console.error("Error rejecting advertisement:", err);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً من قاعدة البيانات؟")) return;
    const jobRef = doc(db, "jobs", String(jobId));
    try {
      await deleteDoc(jobRef);
    } catch (err) {
      console.error("Error deleting advertisement:", err);
    }
  };

  const handleStartEditAd = (key: string, ad: AdBanner) => {
    setEditingAdKey(key);
    setEditedAdTitle(ad.title || "");
    setEditedAdDesc(ad.desc || "");
    setEditedAdImg(ad.imgUrl || "");
    setEditedAdLink(ad.linkText || "");
    setEditedAdTag(ad.tag || "");
  };

  const handleSaveAdBlock = () => {
    if (!editingAdKey) return;
    const updated = {
      id: editingAdKey,
      title: editedAdTitle,
      desc: editedAdDesc,
      imgUrl: editedAdImg,
      linkText: editedAdLink,
      tag: editedAdTag
    };
    onSaveAd(editingAdKey, updated);
    setEditingAdKey(null);
  };

  // Filter ads config logic
  const filteredJobs = jobsList.filter(j => {
    if (jobFilter === "all") return true;
    if (jobFilter === "pending") return j.status === "pending";
    if (jobFilter === "active") return j.status === "active" || j.status === undefined;
    return j.status === "rejected";
  });

  return (
    <div style={{ padding: "16px", minHeight: "100%", background: t.background, direction: "rtl" }}>
      {/* Admin Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: t.text, fontSize: 18, fontWeight: 900, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <span>لوحة الإدارة والميزان المهني</span>
            <span style={{ fontSize: 13, background: "rgba(14, 165, 233, 0.15)", color: "#0EA5E9", padding: "2px 8px", borderRadius: 8, fontWeight: 800 }}>
              {isMasterAdmin ? "المدير العام 👑" : "مدير الموقع 🛡️"}
            </span>
          </h2>
          <p style={{ color: t.textMuted, fontSize: 11, margin: "4px 0 0" }}>المشرف الفعلي: {currentUserEmail || "تسجيل هاتف/مجهول"}</p>
        </div>
        <button onClick={onBack} style={{
          background: t.card, border: `1px solid ${t.border}`, borderRadius: 10,
          color: t.text, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.1s"
        }}>
          الرجوع للرئيسية ↩
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: "flex", background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 4, marginBottom: 18 }}>
        <button onClick={() => setActiveSubTab("users")} style={{
          flex: 1, padding: "11px 0", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
          background: activeSubTab === "users" ? "#0EA5E9" : "none",
          color: activeSubTab === "users" ? "white" : t.textMuted,
          transition: "all 0.15s ease"
        }}>
          👥 إدارة المستخدمين والتوثيق ({usersList.length})
        </button>
        <button onClick={() => setActiveSubTab("jobs")} style={{
          flex: 1, padding: "11px 0", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
          background: activeSubTab === "jobs" ? "#0EA5E9" : "none",
          color: activeSubTab === "jobs" ? "white" : t.textMuted,
          transition: "all 0.15s ease"
        }}>
          📢 تحكيم الإعلانات الواردة ({jobsList.length})
        </button>
        <button onClick={() => setActiveSubTab("banners")} style={{
          flex: 1, padding: "11px 0", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
          background: activeSubTab === "banners" ? "#0EA5E9" : "none",
          color: activeSubTab === "banners" ? "white" : t.textMuted,
          transition: "all 0.15s ease"
        }}>
          🖼️ المساحات الإعلانية المروجة
        </button>
      </div>

      {/* ── SubTab 1: Users moderation ── */}
      {activeSubTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: t.textSec, fontWeight: 600 }}>💡 دليل تحكم المدير:</span>
            <ul style={{ margin: "5px 12px 0 0", padding: 0, fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>
              <li>يمكنك **توثيق** أي مستخدم لربط حسابهم المهني بـ **العلامة الزرقاء الموثقة ⚡** في جميع أدلة المنصة والبحث.</li>
              <li>يحق للمدير العام (`alqaidpro@gmail.com`) تعيين مستخدمين آخرين بصفة **مدير الموقع** بكافة صلوحيات المشرفين.</li>
            </ul>
          </div>

          {usersList.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: t.textMuted, fontSize: 12 }}>
              لا يوجد مستخدمين مسجلين حالياً في قاعدة البيانات.
            </div>
          ) : (
            usersList.map(user => {
              const userEmailOrPhone = user.email || user.phone || "بدون عنوان اتصال";
              const isUserMasterAdmin = user.email?.toLowerCase() === "alqaidpro@gmail.com";
              return (
                <div key={user.uid} style={{
                  background: t.card, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: 14,
                  display: "flex", flexDirection: "column", gap: 10, boxShadow: t.shadowCard
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{user.name}</span>
                        {user.verified && (
                          <span style={{
                            background: "#0EA5E9", color: "white", borderRadius: "50%",
                            width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 900
                          }}>✓</span>
                        )}
                        {user.role === "manager" && (
                          <span style={{ fontSize: 9, background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                            مدير الموقع
                          </span>
                        )}
                        {isUserMasterAdmin && (
                          <span style={{ fontSize: 9, background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                            المدير العام
                          </span>
                        )}
                      </h4>
                      <div style={{ color: t.textMuted, fontSize: 11, marginTop: 4, fontStyle: "normal" }}>
                        📞 {user.phone} · 🏙️ {user.city}
                      </div>
                      {user.email && (
                        <div style={{ color: t.textMuted, fontSize: 10, marginTop: 2, fontFamily: "monospace" }}>
                          ✉️ {user.email}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {/* Toggle Verification Badge */}
                      <button onClick={() => handleToggleVerifyUser(user)} style={{
                        background: user.verified ? "rgba(239, 68, 68, 0.1)" : "rgba(14, 165, 233, 0.1)",
                        border: `1px solid ${user.verified ? "rgba(239, 68, 68, 0.2)" : "rgba(14, 165, 233, 0.2)"}`,
                        borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700,
                        color: user.verified ? "#EF4444" : "#0EA5E9", cursor: "pointer"
                      }}>
                        {user.verified ? "🚫 إلغاء التوثيق والتاج" : "🎖️ توثيق (شارة زرقاء)"}
                      </button>

                      {/* Promote to Site Manager (Only allowed for master admin) */}
                      {!isUserMasterAdmin && (
                        <button onClick={() => handleToggleManagerRole(user)} style={{
                          background: user.role === "manager" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          border: `1px solid ${user.role === "manager" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                          borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700,
                          color: user.role === "manager" ? "#F59E0B" : "#10B981", cursor: "pointer",
                          opacity: isMasterAdmin ? 1 : 0.6
                        }}>
                          {user.role === "manager" ? "🔻 تنزيل لـ مستخدم عادي" : "⚡ ترقية كـ مدير موقع"}
                        </button>
                      )}
                    </div>
                  </div>

                  {user.bio && (
                    <div style={{
                      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8,
                      padding: "8px 10px", fontSize: 11, color: t.textSec, fontStyle: "normal"
                    }}>
                      📝 {user.bio}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── SubTab 2: Job arbitration ── */}
      {activeSubTab === "jobs" && (
        <div>
          {/* Arbitration filters */}
          <div style={{ display: "flex", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3, marginBottom: 14 }}>
            {(["pending", "active", "rejected", "all"] as const).map(f => {
              const labels = {
                pending: "⏳ معلّق وبانتظار الموافقة",
                active: "✅ نشط ومعروض للجمهور",
                rejected: "❌ مرفوض ومحجوب",
                all: "📁 الكل"
              };
              return (
                <button key={f} onClick={() => setJobFilter(f)} style={{
                  flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: jobFilter === f ? t.card : "none",
                  color: jobFilter === f ? t.text : t.textMuted
                }}>
                  {labels[f]}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: t.textMuted, fontSize: 12 }}>
                لا يوجد أي طلبات إعلانات تحت طائلة هذا الفرز حالياً.
              </div>
            ) : (
              filteredJobs.map(job => {
                const isPending = job.status === "pending";
                const isRejected = job.status === "rejected";
                return (
                  <div key={job.id} style={{
                    background: t.card, border: `1.5px solid ${t.border}`, borderRadius: 12, padding: 14,
                    display: "flex", flexDirection: "column", gap: 8, boxShadow: t.shadowCard
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        {/* Title and Badge */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                          <span style={{
                            background: job.type === "need-worker" ? "#0EA5E9" : "#10B981",
                            color: "white", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 5
                          }}>
                            {job.type === "need-worker" ? "طلب عامل" : "عرض عمل مهني"}
                          </span>
                          <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: 0 }}>{job.title}</h4>
                        </div>

                        <div style={{ color: t.textMuted, fontSize: 11 }}>
                          📍 {job.loc} · 💰 {job.price} ج.م / {job.unit}
                        </div>
                        <div style={{ color: t.textSec, fontSize: 11, marginTop: 4 }}>
                          👤 الناشر: <strong style={{ color: t.text }}>{job.pName}</strong> ({job.age})
                        </div>
                      </div>

                      {/* State badge info */}
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                        background: isPending ? "rgba(245,158,11,0.12)" : (isRejected ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)"),
                        color: isPending ? "#F59E0B" : (isRejected ? "#EF4444" : "#10B981")
                      }}>
                        {isPending ? "قيد التدقيق" : (isRejected ? "مرفوض" : "موافق عليه ونشط")}
                      </span>
                    </div>

                    <p style={{ color: t.textSec, fontSize: 11, margin: "5px 0", background: t.surface, padding: 8, borderRadius: 8, border: `1px solid ${t.border}`, lineHeight: 1.5 }}>
                      {job.desc}
                    </p>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, alignSelf: "flex-end", marginTop: 4 }}>
                      {isPending && (
                        <>
                          <button onClick={() => handleApproveJob(job.id)} style={{
                            background: "#10B981", color: "white", border: "none", borderRadius: 8,
                            padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                          }}>
                            ✅ موافقة وتعميم فوراً
                          </button>
                          <button onClick={() => handleRejectJob(job.id)} style={{
                            background: "#EF4444", color: "white", border: "none", borderRadius: 8,
                            padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                          }}>
                            ❌ رفض وحجب الإعلان
                          </button>
                        </>
                      )}

                      {!isPending && (
                        <>
                          {!isRejected && (
                            <button onClick={() => handleRejectJob(job.id)} style={{
                              background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
                              color: "#EF4444", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                            }}>
                              🚫 تغيير القرار لـ رفض
                            </button>
                          )}
                          {isRejected && (
                            <button onClick={() => handleApproveJob(job.id)} style={{
                              background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)",
                              color: "#10B981", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                            }}>
                              🟢 إعادة تفعيل وموافقة
                            </button>
                          )}
                        </>
                      )}

                      <button onClick={() => handleDeleteJob(job.id)} style={{
                        background: "none", border: "none", color: t.textMuted, fontSize: 11,
                        cursor: "pointer", textDecoration: "underline", padding: "6px 8px"
                      }}>
                        حذف كلي 🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── SubTab 3: Ad banners spaces ── */}
      {activeSubTab === "banners" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12 }}>
            <span style={{ fontSize: 11, color: t.textSec, fontWeight: 600 }}>🏷️ تخصيص البنرات الترويجية للممولين:</span>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>
              يمكنك تحرير النصوص، الصور، والشارات لكل المساحات الإعلانية المدفوعة بالموقع مباشرة. التعديلات تنعكس فورياً لجميع الزوار مع تخزين آمن.
            </p>
          </div>

          {editingAdKey ? (
            /* Editing space form */
            <div style={{ background: t.card, border: `1.5px solid #0EA5E9`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ color: t.text, fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>✏️ تعديل محتوى المساحة الإعلانية: ({editingAdKey})</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ display: "block", color: t.textSec, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>عنوان الإعلان:</label>
                  <input type="text" value={editedAdTitle} onChange={e => setEditedAdTitle(e.target.value)} style={{
                    width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, outline: "none"
                  }} />
                </div>

                <div>
                  <label style={{ display: "block", color: t.textSec, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>وصف الإعلان الممول:</label>
                  <textarea rows={3} value={editedAdDesc} onChange={e => setEditedAdDesc(e.target.value)} style={{
                    width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, outline: "none", resize: "none"
                  }} />
                </div>

                <div>
                  <label style={{ display: "block", color: t.textSec, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>رابط الصورة الترويجية (Unsplash):</label>
                  <input type="text" value={editedAdImg} onChange={e => setEditedAdImg(e.target.value)} style={{
                    width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, outline: "none", textAlign: "left", direction: "ltr"
                  }} />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", color: t.textSec, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>نص زر الإجراء (CTA):</label>
                    <input type="text" value={editedAdLink} onChange={e => setEditedAdLink(e.target.value)} style={{
                      width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, outline: "none"
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", color: t.textSec, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>شارة الترويج (مثال: شريك مميز):</label>
                    <input type="text" value={editedAdTag} onChange={e => setEditedAdTag(e.target.value)} style={{
                      width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, outline: "none"
                    }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button onClick={handleSaveAdBlock} style={{
                    flex: 1, background: "#0EA5E9", color: "white", border: "none", borderRadius: 8, padding: 11, fontSize: 12, fontWeight: 700, cursor: "pointer"
                  }}>
                    💾 حفظ التعديلات ونشر الإعلان
                  </button>
                  <button onClick={() => setEditingAdKey(null)} style={{
                    background: t.surface, border: `1px solid ${t.border}`, color: t.textSec, borderRadius: 8, padding: "11px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                  }}>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Ads spaces list */
            Object.entries(adsConfig).map(([key, ad]) => (
              <div key={key} style={{
                background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden"
              }}>
                <div style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}>
                  <img src={ad.imgUrl} alt={ad.title} style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover", background: t.surface }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, background: "rgba(14, 165, 233, 0.12)", color: "#0EA5E9", padding: "1px 6px", borderRadius: 4, fontWeight: 800 }}>
                        {key === "home_top" ? "كود: البنر الرئيسي الأول" : `كود: بنر فئة ${key}`}
                      </span>
                      <button onClick={() => handleStartEditAd(key, ad)} style={{
                        background: "none", border: "none", color: "#0EA5E9", fontSize: 11, fontWeight: 800, cursor: "pointer"
                      }}>
                        ✏️ تحرير المحتوى والصورة
                      </button>
                    </div>
                    <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: "6px 0 2px" }}>{ad.title}</h4>
                    <p style={{ color: t.textMuted, fontSize: 11, margin: 0, lineBreak: "anywhere" }}>{ad.desc}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
