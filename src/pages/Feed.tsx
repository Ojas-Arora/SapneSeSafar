import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ExternalLink,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  Link as LinkIcon,
  MessageSquare,
  Send
} from 'lucide-react';
import { useSharkTankTheme } from '../hooks/useSharkTankTheme';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface Article {
  id: string;
  title: string;
  description: string | null;
  link: string;
  author_name: string;
  author_id: string;
  created_at: string;
}

export const Feed: React.FC = () => {
  const { isDarkMode } = useSharkTankTheme();
  const { user } = useAuthStore();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articleMode, setArticleMode] = useState<'link' | 'write'>('link');
  const [submitting, setSubmitting] = useState(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    link: '',
    content: ''
  });

  useEffect(() => {
    fetchTopics();
    fetchArticles();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('feed_topics')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetArticleForm = () => {
    setNewArticle({ title: '', description: '', link: '', content: '' });
  };

  const isInternalArticle = (link: string) => link.startsWith('internal://');

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to add articles');
      return;
    }

    if (articleMode === 'link') {
      if (!newArticle.title.trim() || !newArticle.link.trim()) {
        alert('Title and Link are required');
        return;
      }
    } else {
      if (!newArticle.title.trim() || !newArticle.content.trim()) {
        alert('Title and content are required');
        return;
      }
    }

    try {
      setSubmitting(true);
      const descriptionValue =
        articleMode === 'write'
          ? (newArticle.description?.trim() || newArticle.content.trim())
          : newArticle.description.trim();

      const linkValue =
        articleMode === 'write'
          ? `internal://article/${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`
          : newArticle.link.trim();

      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            title: newArticle.title.trim(),
            description: descriptionValue,
            link: linkValue,
            author_id: user.id,
            author_name: user.user_metadata?.full_name || user.email
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        setArticles([data[0] as Article, ...articles]);
        resetArticleForm();
        setShowAddArticle(false);
        alert('Article added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding article:', error);
      alert(`Failed to add article: ${error?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArticleClick = (article: Article) => {
    // Internal articles (written content) - expand to show content
    if (isInternalArticle(article.link)) {
      if (!user) {
        alert('Please login to read this article');
        return;
      }
      setExpandedArticleId(expandedArticleId === article.id ? null : article.id);
      return;
    }
    
    // External articles - open link
    if (!user) {
      alert('Please login to read this article');
      return;
    }
    window.open(article.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to Sapne Se Safar
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Your hub for Shark Tank India insights, articles, and discussions
        </p>
      </motion.div>

      {/* Curate Your Feed - Topics */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Curate Your Feed
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedTopic === topic.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                  : isDarkMode
                  ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
            >
              <div className="text-4xl mb-3">{topic.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
              <p className={`text-sm ${selectedTopic === topic.id ? 'text-white/80' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {topic.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Articles and Chat Layout */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Articles & Insights
          </h2>
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddArticle(!showAddArticle)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                showAddArticle
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }`}
            >
              <Plus className="h-5 w-5" />
              {showAddArticle ? 'Cancel' : 'Add Article'}
            </motion.button>
          )}
        </div>

        {/* Add Article Form */}
        <AnimatePresence>
          {showAddArticle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-6 rounded-2xl ${
                isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'
              }`}
            >
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setArticleMode('link');
                      resetArticleForm();
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${
                      articleMode === 'link'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isDarkMode
                        ? 'bg-slate-900/50 border-slate-700 text-gray-300'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    Import from link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setArticleMode('write');
                      resetArticleForm();
                    }}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${
                      articleMode === 'write'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : isDarkMode
                        ? 'bg-slate-900/50 border-slate-700 text-gray-300'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    Start writing
                  </button>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter article title"
                  />
                </div>

                {articleMode === 'link' ? (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description
                      </label>
                      <textarea
                        value={newArticle.description}
                        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Brief description of the article"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Article Link *
                      </label>
                      <input
                        type="url"
                        required
                        value={newArticle.link}
                        onChange={(e) => setNewArticle({ ...newArticle, link: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="https://example.com/article"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Summary (optional)
                      </label>
                      <textarea
                        value={newArticle.description}
                        onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Add a short summary for your article"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Write your article *
                      </label>
                      <textarea
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                        rows={6}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Start drafting your article here..."
                      />
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        We will publish this as an internal article. You can still add a link later.
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Articles & Sidebar Layout */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No articles yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => (user ? handleArticleClick(article) : alert('Please login to read this article'))}
                  className={`flex gap-6 p-6 rounded-2xl transition-all duration-300 ${
                    isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } shadow-lg hover:shadow-xl group ${user ? 'cursor-pointer' : 'cursor-not-allowed opacity-95'}`}
                >
                  <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gradient-to-br from-blue-200 to-purple-200'} w-32 h-32 flex-shrink-0 rounded-xl flex items-center justify-center`}>
                    <BookOpen className="h-12 w-12 text-opacity-30" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {article.description}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-5 w-5 text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className={`flex flex-wrap items-center gap-4 text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" /> {article.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Expanded view for written articles */}
                    <AnimatePresence>
                      {expandedArticleId === article.id && isInternalArticle(article.link) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
                        >
                          <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} whitespace-pre-wrap text-sm leading-relaxed`}>
                            {article.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Sidebar Chat (basic) */}
            <div className="hidden lg:block sticky top-24 h-full lg:ml-4">
              <div className={`rounded-2xl overflow-hidden flex flex-col h-[32rem] ${isDarkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-gray-200'} shadow-lg ml-auto w-full max-w-[380px]`}>
                <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
                  <h3 className="font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Online Chat
                  </h3>
                  <p className="text-xs text-white/80 mt-1">{user ? 'Connected' : 'Login to chat'}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {!user ? (
                    <div className="space-y-3 text-sm">
                      <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'} p-3 rounded-lg`}>
                        <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-700'} text-xs font-semibold`}>Live chat preview</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          Sign in to join the conversation. You can still read messages here.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-slate-900/50 border border-slate-700' : 'bg-white border border-gray-200'} p-3 rounded-lg flex items-start gap-3`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>System</p>
                          <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>Chat history is saved for 30 days.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'} p-2 rounded-lg`}>
                        <p className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-semibold`}>System</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Chat history is saved for 30 days.</p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-slate-900/40 border border-slate-700/70' : 'bg-gray-50 border border-gray-200'} p-3 rounded-lg`}>
                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>Say hello 👋 — this chat updates live.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={user ? 'Type message...' : 'Sign in to chat'}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                        isDarkMode ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-gray-100 border border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      disabled={!user}
                    />
                    <button
                      type="button"
                      className={`p-2 rounded-lg text-white ${
                        user
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!user}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {user ? 'Chat is read-only preview right now. Use the floating chat icon to send.' : 'Login required to post messages.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};
