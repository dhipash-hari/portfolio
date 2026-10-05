import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactMessage } from '../types/portfolio';

const LOCAL_STORAGE_KEY_MESSAGES = 'dhipash_portfolio_contact_messages';

const getLocalMessages = (): ContactMessage[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_MESSAGES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return [
    {
      id: 'msg-sample',
      name: 'Welcome Inquirer',
      email: 'collaborator@example.com',
      message: 'Hello Dhipash, thoroughly impressed by the Red Lenz and Mark Analysis implementations. Looking forward to discussing AI and Frontend ideas with you!',
      is_read: false,
      created_at: new Date().toISOString(),
    }
  ];
};

const saveLocalMessages = (messages: ContactMessage[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_MESSAGES, JSON.stringify(messages));
};

export const sendContactMessage = async (name: string, email: string, message: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);
    if (error) throw error;
    return true;
  }

  const list = getLocalMessages();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  saveLocalMessages([newMessage, ...list]);
  return true;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (err) {
      console.warn('Error fetching messages from Supabase:', err);
    }
  }
  return getLocalMessages();
};

export const markMessageAsRead = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    return;
  }

  const list = getLocalMessages();
  saveLocalMessages(list.map(m => (m.id === id ? { ...m, is_read: true } : m)));
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from('contact_messages').delete().eq('id', id);
    return;
  }

  const list = getLocalMessages();
  saveLocalMessages(list.filter(m => m.id !== id));
};
