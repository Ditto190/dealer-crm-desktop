import { useMemo, useState } from "react";
import {
  Activity, ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen,
  Building2, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp,
  Clock3, Command, FileText, Filter, LayoutDashboard, LifeBuoy, ListTodo,
  MoreHorizontal, Plus, Search, Settings2, Sparkles, Users, X,
} from "lucide-react";

type Account = {
  name: string; initials: string; color: string; location: string; owner: string;
  ownerInitials: string; volume: string; status: "Active" | "Onboarding" | "At risk";
  lastContact: string; email: string; phone: string;
};

type Doc = { title: string; category: string; summary: string; body: string[] };

const initialAccounts: Account[] = [
  { name: "Northstar Motors", initials: "NM", color: "coral", location: "Portland, OR", owner: "Jordan Lee", ownerInitials: "JL", volume: "$284k", status: "Active", lastContact: "Today", email: "jordan@northstarmotors.example", phone: "(503) 555-0182" },
  { name: "Cedar & Co. Auto", initials: "CC", color: "blue", location: "Seattle, WA", owner: "Morgan Chen", ownerInitials: "MC", volume: "$196k", status: "Active", lastContact: "Yesterday", email: "morgan@cedarauto.example", phone: "(206) 555-0147" },
  { name: "Westline Automotive", initials: "WA", color: "purple", location: "San Diego, CA", owner: "Taylor Brooks", ownerInitials: "TB", volume: "$128k", status: "Onboarding", lastContact: "2 days ago", email: "taylor@westline.example", phone: "(619) 555-0119" },
  { name: "Juniper Auto Group", initials: "JA", color: "green", location: "Sacramento, CA", owner: "Jordan Lee", ownerInitials: "JL", volume: "$92k", status: "Active", lastContact: "3 days ago", email: "jordan@juniperauto.example", phone: "(916) 555-0171" },
  { name: "Summit Ridge Dealers", initials: "SR", color: "gold", location: "Boise, ID", owner: "Morgan Chen", ownerInitials: "MC", volume: "$74k", status: "At risk", lastContact: "1 week ago", email: "morgan@summitridge.example", phone: "(208) 555-0198" },
];

const docs: Doc[] = [
  { title: "Getting started with Dealerflow", category: "Workspace guide", summary: "A quick tour of accounts, pipeline, and local demo data.", body: ["Dealerflow is a local-first starter workspace for dealer relationship teams. The sample records in this template are held in app memory and reset when you reload.", "Use the left navigation to switch between the dashboard, dealer list, pipeline, tasks, activity, and this reference library. Select a dealer row to see contact details.", "Create dealer adds a sample record to the current session. No data is sent to a server or saved between launches."] },
  { title: "Working with dealer accounts", category: "CRM basics", summary: "Keep partner details and relationship status easy to scan.", body: ["An account represents a dealership or dealer group. Each account has a relationship status, a primary contact owner, a location, and a sample volume figure.", "Use the search field to narrow accounts by dealer name, owner, or location. Status labels are visual examples that can be adapted to your team's sales process.", "This starter intentionally has no authentication, database, or network sync. Add a secure persistence layer before using real customer information."] },
  { title: "Tauri desktop packaging", category: "Developer notes", summary: "Build and run this React interface as a Windows desktop app.", body: ["The interface is a Vite + React frontend wrapped by Tauri v2. The Rust shell opens a local webview; it does not expose CRM data through native commands.", "Install the Rust stable MSVC toolchain, Node.js LTS, Visual Studio Build Tools with the C++ workload, and the WebView2 Runtime before building on Windows.", "Run npm install, then npm run tauri dev for development or npm run tauri build for a Windows package. The initial scaffold should be validated on a Windows machine before distribution."] },
  { title: "Privacy and demo data", category: "Safety notes", summary: "Understand what is and is not stored by this template.", body: ["All records are fictional examples. Do not enter real customer information into the starter until you have designed and tested appropriate storage, access controls, retention, and backup.", "The built-in reference notes are original starter guidance bundled with the app. This is not the DevDocs app or a bundled copy of the DevDocs documentation corpus.", "This project is a UI and desktop-shell starting point, not a compliance or security certification."] },
];

const tasks = [
  { title: "Review Northstar Q4 inventory plan", account: "Northstar Motors", due: "Today", urgent: true },
  { title: "Send onboarding checklist", account: "Westline Automotive", due: "Today", urgent: true },
  { title: "Schedule quarterly business review", account: "Cedar & Co. Auto", due: "Tomorrow", urgent: false },
];

const events = [
  { initials: "JL", color: "coral", text: "Jordan Lee logged a call with", account: "Northstar Motors", time: "10:42 AM", type: "Call" },
  { initials: "MC", color: "blue", text: "Morgan Chen updated the forecast for", account: "Cedar & Co. Auto", time: "9:18 AM", type: "Update" },
  { initials: "TB", color: "purple", text: "Taylor Brooks added a note to", account: "Westline Automotive", time: "Yesterday", type: "Note" },
];

const navItems = [
  { id: "Overview", icon: LayoutDashboard }, { id: "Dealers", icon: Building2 },
  { id: "Pipeline", icon: ArrowDownRight }, { id: "Tasks", icon: ListTodo },
  { id: "Activity", icon: Activity }, { id: "Reference library", icon: BookOpen },
];

function Avatar({ initials, color = "blue", small = false }: { initials: string; color?: string; small?: boolean }) {
  return <span className={`avatar avatar-${color}${small ? " avatar-small" : ""}`}>{initials}</span>;
}

function App() {
  const [section, setSection] = useState("Overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selected, setSelected] = useState<Account | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [docQuery, setDocQuery] = useState("");
  const [activeDoc, setActiveDoc] = useState<Doc>(docs[0]);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

  const filteredAccounts = useMemo(() => accounts.filter((account) => {
    const text = `${account.name} ${account.location} ${account.owner}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (statusFilter === "All status" || account.status === statusFilter);
  }), [accounts, query, statusFilter]);
  const filteredDocs = docs.filter((doc) => `${doc.title} ${doc.category} ${doc.summary}`.toLowerCase().includes(docQuery.toLowerCase()));

  function addAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const account: Account = { name, initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), color: "green", location: newLocation.trim() || "Location not set", owner: "You", ownerInitials: "YO", volume: "$0", status: "Onboarding", lastContact: "Just added", email: "Add contact email", phone: "Add phone" };
    setAccounts((current) => [account, ...current]);
    setSelected(account);
    setNewName(""); setNewLocation(""); setShowForm(false);
  }

  const pageTitle = section === "Overview" ? "Good morning, Jordan" : section;
  const pageSubtitle = section === "Overview" ? "Here's what's happening with your dealer network." : section === "Reference library" ? "A small offline guide for your team and this starter project." : `Keep your ${section.toLowerCase()} relationships moving forward.`;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><span /></span><span>dealerflow</span><span className="brand-beta">DESK</span></div>
        <button className="workspace-switch"><span className="workspace-icon">A</span><span className="workspace-label"><strong>Atlas Automotive</strong><small>Partner workspace</small></span><ChevronDown size={15} /></button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ id, icon: Icon }) => <button key={id} className={`nav-item${section === id ? " active" : ""}`} onClick={() => setSection(id)}><Icon size={17} strokeWidth={1.8} /><span>{id}</span>{id === "Tasks" && <span className="nav-count">3</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={16} /></div><strong>Need a hand?</strong><p>Find tips in the reference library.</p><button onClick={() => setSection("Reference library")}>Open guide <ArrowRight size={13} /></button></div>
          <button className="nav-item settings" onClick={() => setSection("Settings")}><Settings2 size={17} /><span>Settings</span></button>
          <button className="profile"><Avatar initials="JL" color="coral" /><span className="profile-label"><strong>Jordan Lee</strong><small>Sales manager</small></span><MoreHorizontal size={18} /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{section}</strong></div><div className="top-actions"><div className="search-box"><Search size={15} /><input aria-label="Search dealers" placeholder="Search dealers..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd><Command size={10} /> K</kbd></div><button className="icon-button" aria-label="Help" onClick={() => setSection("Reference library")}><LifeBuoy size={17} /></button><button className="icon-button notification" aria-label="Notifications"><span /><Activity size={17} /></button><Avatar initials="JL" color="coral" small /></div></header>
        <div className="page-content">
          <section className="page-heading"><div><div className="eyebrow"><Sparkles size={13} /> FRIDAY, OCTOBER 23, 2026</div><h1>{pageTitle}{section === "Overview" && <span className="wave">✳</span>}</h1><p>{pageSubtitle}</p></div>{section !== "Reference library" && <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={16} /> Add dealer</button>}</section>

          {section === "Reference library" ? <section className="docs-layout"><div className="docs-sidebar"><div className="docs-search"><Search size={15} /><input placeholder="Search this guide..." value={docQuery} onChange={(event) => setDocQuery(event.target.value)} /></div><div className="docs-list-label">OFFLINE GUIDE</div>{filteredDocs.map((doc) => <button className={`doc-item${activeDoc.title === doc.title ? " selected" : ""}`} key={doc.title} onClick={() => setActiveDoc(doc)}><FileText size={16} /><span><strong>{doc.title}</strong><small>{doc.category}</small></span></button>)}{filteredDocs.length === 0 && <p className="empty-docs">No guides match that search.</p>}<div className="docs-offline"><span className="offline-dot" /> Available offline <span>·</span> bundled notes</div></div><article className="doc-content"><div className="doc-kicker"><BookOpen size={14} /> {activeDoc.category}</div><h2>{activeDoc.title}</h2><p className="doc-summary">{activeDoc.summary}</p><div className="doc-divider" />{activeDoc.body.map((paragraph, index) => <p className="doc-paragraph" key={index}>{paragraph}</p>)}<div className="doc-callout"><CircleHelp size={17} /><div><strong>About this reference library</strong><p>These original quick-start notes are bundled with the app. This is not the DevDocs application and does not include DevDocs' documentation datasets.</p><a href="https://devdocs.io/" target="_blank" rel="noreferrer">Visit DevDocs online <ArrowUpRight size={13} /></a></div></div><div className="doc-footnote">Dealerflow starter guide <span>·</span> Included with this app</div></article></section> : <>
            {section === "Overview" && <section className="metrics-grid"><article className="metric-card"><div className="metric-top"><span>Total dealers</span><span className="metric-icon blue-soft"><Building2 size={16} /></span></div><div className="metric-value">{accounts.length}<span className="metric-change positive"><ArrowUpRight size={13} /> 2</span></div><div className="metric-foot">vs. last month</div><div className="sparkline spark-blue"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article><article className="metric-card"><div className="metric-top"><span>Active pipeline</span><span className="metric-icon violet-soft"><ArrowDownRight size={16} /></span></div><div className="metric-value">$1.24m<span className="metric-change positive"><ArrowUpRight size={13} /> 12.8%</span></div><div className="metric-foot">vs. last month</div><div className="sparkline spark-violet"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article><article className="metric-card"><div className="metric-top"><span>Tasks due</span><span className="metric-icon amber-soft"><ListTodo size={16} /></span></div><div className="metric-value">{tasks.length - checkedTasks.length}<span className="metric-change neutral"><ArrowDown size={13} /> 1</span></div><div className="metric-foot">2 due today</div><div className="sparkline spark-amber"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article><article className="metric-card"><div className="metric-top"><span>At-risk accounts</span><span className="metric-icon rose-soft"><Activity size={16} /></span></div><div className="metric-value">{accounts.filter((account) => account.status === "At risk").length}<span className="metric-change positive"><ArrowDown size={13} /> 1</span></div><div className="metric-foot">needs your attention</div><div className="sparkline spark-rose"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article></section>}

            <section className="content-grid"><div className="panel accounts-panel"><div className="panel-heading"><div><h2>{section === "Pipeline" ? "Pipeline accounts" : section === "Tasks" ? "Dealer accounts" : section === "Activity" ? "Recent accounts" : "Dealer accounts"}</h2><p>{section === "Overview" ? "Your partner network at a glance" : "Accounts in your partner network"}</p></div><button className="text-button" onClick={() => setSection("Dealers")}>View all <ArrowRight size={14} /></button></div><div className="table-toolbar"><span className="result-count">{filteredAccounts.length} accounts</span><label className="filter-select"><Filter size={14} /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All status</option><option>Active</option><option>Onboarding</option><option>At risk</option></select><ChevronDown size={13} /></label><button className="filter-button" onClick={() => setQuery("")}><span>Reset</span><X size={13} /></button></div><div className="table-scroll"><table><thead><tr><th>DEALER</th><th>OWNER</th><th>VOLUME</th><th>STATUS</th><th>LAST CONTACT</th><th /></tr></thead><tbody>{filteredAccounts.map((account) => <tr key={account.name} onClick={() => setSelected(account)}><td><div className="dealer-cell"><Avatar initials={account.initials} color={account.color} /><span><strong>{account.name}</strong><small>{account.location}</small></span></div></td><td><div className="owner-cell"><Avatar initials={account.ownerInitials} color={account.ownerInitials === "JL" ? "coral" : "blue"} small />{account.owner}</div></td><td className="volume-cell">{account.volume}</td><td><span className={`status status-${account.status.toLowerCase().replace(" ", "-")}`}><i />{account.status}</span></td><td className="last-contact">{account.lastContact}</td><td><button className="row-more" aria-label={`More about ${account.name}`} onClick={(event) => { event.stopPropagation(); setSelected(account); }}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{filteredAccounts.length === 0 && <div className="empty-state">No dealers match your search. Try another name or clear the filters.</div>}</div><div className="panel-footer"><span>Showing <strong>{filteredAccounts.length}</strong> of <strong>{accounts.length}</strong> dealers</span><button onClick={() => setSection("Dealers")}>All dealers <ArrowRight size={13} /></button></div></div>

              <div className="right-column"><div className="panel tasks-panel"><div className="panel-heading"><div><h2>Up next</h2><p>Your priorities for today</p></div><button className="more-button" aria-label="More task options"><MoreHorizontal size={18} /></button></div><div className="task-list">{tasks.map((task) => { const checked = checkedTasks.includes(task.title); return <button className={`task-row${checked ? " task-done" : ""}`} key={task.title} onClick={() => setCheckedTasks((current) => checked ? current.filter((title) => title !== task.title) : [...current, task.title])}><span className={`task-check${checked ? " checked" : ""}`}>{checked && <Check size={12} />}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.account}</small></span><span className={`task-due${task.urgent && !checked ? " due-today" : ""}`}><Clock3 size={12} />{checked ? "Done" : task.due}</span></button>; })}</div><button className="panel-bottom-link" onClick={() => setSection("Tasks")}>View all tasks <ArrowRight size={13} /></button></div>
                <div className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><button className="more-button" aria-label="More activity options"><MoreHorizontal size={18} /></button></div><div className="activity-list">{events.map((event) => <div className="activity-row" key={event.account}><Avatar initials={event.initials} color={event.color} small /><div className="activity-copy"><p>{event.text} <strong>{event.account}</strong></p><span>{event.time} <i>·</i> {event.type}</span></div></div>)}</div><button className="panel-bottom-link" onClick={() => setSection("Activity")}>View activity <ArrowRight size={13} /></button></div></div>
            </section>
            <div className="bottom-note"><span><CheckCheck size={14} /> You're all caught up on critical updates</span><button onClick={() => setSection("Reference library")}><BookOpen size={13} /> Explore the offline guide</button><span className="data-note">Demo data · stored in memory only</span></div>
          </>}
        </div>
      </main>

      {selected && <div className="drawer-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><aside className="detail-drawer"><div className="drawer-top"><span>DEALER PROFILE</span><button className="icon-button" aria-label="Close profile" onClick={() => setSelected(null)}><X size={18} /></button></div><div className="drawer-profile"><Avatar initials={selected.initials} color={selected.color} /><h2>{selected.name}</h2><p><Building2 size={14} /> {selected.location}</p><span className={`status status-${selected.status.toLowerCase().replace(" ", "-")}`}><i />{selected.status}</span></div><div className="drawer-stats"><div><small>MONTHLY VOLUME</small><strong>{selected.volume}</strong></div><div><small>LAST CONTACT</small><strong>{selected.lastContact}</strong></div></div><div className="drawer-section"><h3>Primary contact</h3><div className="contact-row"><Avatar initials={selected.ownerInitials} color="blue" small /><span><strong>{selected.owner}</strong><small>Account owner</small></span></div><div className="contact-detail"><span>Email</span><strong>{selected.email}</strong></div><div className="contact-detail"><span>Phone</span><strong>{selected.phone}</strong></div></div><div className="drawer-section"><h3>Recent activity</h3><div className="drawer-activity"><span className="activity-dot" /><span><strong>Relationship updated</strong><small>{selected.lastContact} · by {selected.owner}</small></span></div></div><div className="drawer-bottom"><button className="secondary-button" onClick={() => setSelected(null)}>Close</button><button className="primary-button" onClick={() => setSelected(null)}>Open account <ArrowRight size={14} /></button></div></aside></div>}

      {showForm && <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}><form className="add-modal" onSubmit={addAccount}><div className="modal-heading"><div><span className="modal-icon"><Plus size={18} /></span><h2>Add a dealer</h2><p>Create a sample account in this session.</p></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={() => setShowForm(false)}><X size={18} /></button></div><label>Dealer name<input autoFocus required value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="e.g. Evergreen Auto Group" /></label><label>Location <span className="optional">Optional</span><input value={newLocation} onChange={(event) => setNewLocation(event.target.value)} placeholder="City, state" /></label><div className="modal-note">This demo record is temporary and will not be saved after the app closes.</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={15} /> Create dealer</button></div></form></div>}
      <div className="keyboard-hint"><Command size={11} /> Tip: use search to find a dealer quickly</div>
    </div>
  );
}

export default App;
