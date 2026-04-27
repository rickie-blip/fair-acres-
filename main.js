import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { 
  ClipboardCheck, 
  AlertCircle, 
  LayoutDashboard, 
  UserCircle, 
  Camera, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';

// --- Configuration & Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'fair-acres-hotel';

// --- Components ---

// 1. Loading Overlay
const Loading = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-blue-900 font-medium animate-pulse">Fair Acres Securing Session...</p>
  </div>
);

// 2. Guest Form Page (QR Access Only)
const GuestComplaintForm = () => {
  const [formData, setFormData] = useState({
    room_number: new URLSearchParams(window.location.search).get('room') || '',
    category: 'cleaning',
    description: '',
    urgency: 'normal'
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), {
        ...formData,
        status: 'new',
        images: images, // Mock image URLs
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Message Received</h2>
          <p className="text-slate-600 mb-6">Your issue has been received. Our team is working on it.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 bg-slate-900 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-transform"
          >
            Submit Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-blue-600 text-white p-6 rounded-b-[2.5rem] shadow-lg">
        <h1 className="text-2xl font-bold">Fair Acres</h1>
        <p className="text-blue-100 text-sm">Guest Services Portal</p>
      </header>

      <div className="px-6 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="e.g. 402"
              value={formData.room_number}
              onChange={e => setFormData({...formData, room_number: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="cleaning">Cleaning</option>
              <option value="bathroom">Bathroom</option>
              <option value="smell">Smell</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea 
              required
              rows="4"
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Urgency</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, urgency: 'normal'})}
                className={`py-3 rounded-xl font-medium transition-all ${formData.urgency === 'normal' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600' : 'bg-slate-50 text-slate-600'}`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, urgency: 'urgent'})}
                className={`py-3 rounded-xl font-medium transition-all ${formData.urgency === 'urgent' ? 'bg-red-100 text-red-700 ring-2 ring-red-600' : 'bg-slate-50 text-slate-600'}`}
              >
                Urgent
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Sending...' : <><Send size={20} /> <span>Submit Complaint</span></>}
          </button>
        </form>
      </div>
    </div>
  );
};

// 3. Staff Dashboard
const StaffDashboard = ({ user, logout }) => {
  const [tasks, setTasks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [view, setView] = useState('tasks'); // 'tasks' | 'complaints'

  useEffect(() => {
    if (!user) return;
    const qTasks = query(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qComplaints = query(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'));
    const unsubComplaints = onSnapshot(qComplaints, (snap) => {
      setComplaints(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubTasks(); unsubComplaints(); };
  }, [user]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', taskId), {
        status: newStatus,
        updated_at: serverTimestamp()
      });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-900 text-white px-6 pt-12 pb-24">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">Staff Portal</h1>
            <p className="text-slate-400 text-sm">{user.email || user.uid}</p>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-lg"><LogOut size={20} /></button>
        </div>
        
        <div className="flex bg-white/10 p-1 rounded-xl">
          <button 
            onClick={() => setView('tasks')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'tasks' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            My Tasks
          </button>
          <button 
            onClick={() => setView('complaints')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'complaints' ? 'bg-white text-slate-900' : 'text-white'}`}
          >
            Complaints
          </button>
        </div>
      </div>

      <div className="px-4 -mt-16 space-y-4 pb-20">
        {view === 'tasks' ? (
          tasks.length > 0 ? tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800">{task.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {task.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4 flex items-center"><Clock size={12} className="mr-1" /> Frequency: {task.frequency}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => updateTaskStatus(task.id, 'completed')}
                  disabled={task.status === 'completed'}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  Mark Complete
                </button>
                <button className="px-3 bg-slate-100 text-slate-600 rounded-lg"><Camera size={18} /></button>
              </div>
            </div>
          )) : <div className="text-center py-10 text-slate-400">No tasks assigned</div>
        ) : (
          complaints.map(comp => (
            <div key={comp.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{comp.category}</span>
                {comp.urgency === 'urgent' && <AlertCircle className="text-red-500" size={16} />}
              </div>
              <h4 className="font-bold text-slate-800">Room {comp.room_number}</h4>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{comp.description}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-[10px] text-slate-400">{comp.created_at?.toDate().toLocaleTimeString()}</span>
                <button className="text-blue-600 text-xs font-bold">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 4. Admin Dashboard
const AdminDashboard = ({ user, logout }) => {
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', department: 'Housekeeping', frequency: 'Daily' });

  useEffect(() => {
    if (!user) return;
    const qC = query(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), orderBy('created_at', 'desc'));
    const unsubC = onSnapshot(qC, (snap) => {
      setComplaints(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qT = query(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'));
    const unsubT = onSnapshot(qT, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubC(); unsubT(); };
  }, [user]);

  const updateComplaintStatus = async (id, status) => {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'complaints', id), {
      status, updated_at: serverTimestamp()
    });
  };

  const createNextTask = async () => {
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), {
      ...newTask, status: 'pending', created_at: serverTimestamp()
    });
    setShowTaskModal(false);
  };

  const stats = useMemo(() => {
    return {
      new: complaints.filter(c => c.status === 'new').length,
      urgent: complaints.filter(c => c.urgency === 'urgent').length,
      tasks_pending: tasks.filter(t => t.status === 'pending').length
    };
  }, [complaints, tasks]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop / Header - Mobile */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-6 md:min-h-screen">
        <div className="flex items-center space-x-2 mb-8">
          <ShieldCheck className="text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">Fair Acres Admin</h1>
        </div>
        
        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 bg-blue-600 p-3 rounded-xl font-medium"><LayoutDashboard size={20} /> <span>Dashboard</span></button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:bg-white/5"><AlertCircle size={20} /> <span>Complaints</span></button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:bg-white/5"><ClipboardCheck size={20} /> <span>Task Board</span></button>
        </div>

        <div className="mt-12 md:absolute md:bottom-8 md:left-6 md:right-6">
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 bg-red-900/30 text-red-400 p-3 rounded-xl border border-red-900/50 hover:bg-red-900/50 transition-colors">
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
            <p className="text-slate-500">Real-time status of Fair Acres operations</p>
          </div>
          <button 
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" /> Assign Task
          </button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">New Complaints</p>
            <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.new}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
            <p className="text-slate-500 text-sm font-medium">Urgent Issues</p>
            <h3 className="text-3xl font-black text-red-600 mt-1">{stats.urgent}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.tasks_pending}</h3>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complaint Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Live Complaint Feed</h3>
              <Filter size={18} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {complaints.length > 0 ? complaints.map((c) => (
                <div key={c.id} className={`p-6 border-b last:border-0 hover:bg-slate-50 transition-colors ${c.urgency === 'urgent' ? 'bg-red-50/30' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-800 text-white px-2 py-1 rounded text-[10px] font-bold">RM {c.room_number}</span>
                      <span className="text-slate-400 text-xs">{c.created_at?.toDate().toLocaleTimeString()}</span>
                    </div>
                    <select 
                      className="text-xs bg-white border border-slate-200 rounded px-2 py-1 font-bold outline-none"
                      value={c.status}
                      onChange={(e) => updateComplaintStatus(c.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <h4 className="font-bold text-slate-800 capitalize">{c.category} Issue</h4>
                  <p className="text-sm text-slate-600 mt-1">{c.description}</p>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400">All quiet. No complaints active.</div>
              )}
            </div>
          </div>

          {/* Task Tracker */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Staff Task Board</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {tasks.map(t => (
                <div key={t.id} className="p-6 border-b last:border-0 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">{t.title}</h4>
                    <p className="text-xs text-slate-500">{t.department} • {t.frequency}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Assign New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-100 rounded-xl"
                  placeholder="e.g. Pool Area Sanitization"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Department</label>
                  <select 
                    className="w-full p-3 bg-slate-100 rounded-xl"
                    value={newTask.department}
                    onChange={e => setNewTask({...newTask, department: e.target.value})}
                  >
                    <option>Housekeeping</option>
                    <option>Maintenance</option>
                    <option>Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Frequency</label>
                  <select 
                    className="w-full p-3 bg-slate-100 rounded-xl"
                    value={newTask.frequency}
                    onChange={e => setNewTask({...newTask, frequency: e.target.value})}
                  >
                    <option>Once</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button 
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={createNextTask}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Auth Controller
const AuthController = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' | 'guest'
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [role, setRole] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        // Fallback or explicit guest check
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // In a real app, we'd fetch the role from a users collection
        // For this demo, we simulate role based on email or anonymous status
        if (u.isAnonymous) setRole('customer');
        else if (u.email?.includes('admin')) setRole('admin');
        else setRole('staff');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate login for demo purposes
      // real: await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      if (credentials.email === 'admin@fairacres.com') {
         // Force simple identity for demo
         setUser({ email: credentials.email, uid: 'admin-123' });
         setRole('admin');
      } else if (credentials.email === 'staff@fairacres.com') {
         setUser({ email: credentials.email, uid: 'staff-123' });
         setRole('staff');
      } else {
        alert("Try: admin@fairacres.com or staff@fairacres.com");
      }
    } catch (err) {
      alert("Login Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startGuestSession = async () => {
    setLoading(true);
    await signInAnonymously(auth);
    setRole('customer');
    setLoading(false);
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
    setRole(null);
    setAuthView('login');
  };

  if (loading) return <Loading />;

  // Main Router
  if (user && role === 'customer') return <GuestComplaintForm />;
  if (user && role === 'staff') return <StaffDashboard user={user} logout={logout} />;
  if (user && role === 'admin') return <AdminDashboard user={user} logout={logout} />;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-xl">
            <ClipboardCheck className="text-white w-10 h-10 -rotate-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Fair Acres</h1>
          <p className="text-slate-500">Operation Management System</p>
        </div>

        {authView === 'login' ? (
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-white space-y-6">
            <h2 className="text-xl font-bold text-slate-800 text-center">Staff & Management</h2>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                placeholder="admin@fairacres.com"
                value={credentials.email}
                onChange={e => setCredentials({...credentials, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <input 
                type="password" 
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all"
                placeholder="••••••••"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all">
              Authorize Access
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-slate-400 font-medium">Guest Access</span></div>
            </div>
            <button 
              type="button"
              onClick={startGuestSession}
              className="w-full bg-blue-50 text-blue-700 py-4 rounded-2xl font-bold border border-blue-100"
            >
              Report Issue (Guest Mode)
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default function App() {
  return <AuthController />;
}