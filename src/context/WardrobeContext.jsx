// ============================================
// WARDROBE — Reactive Global Store
// Central state management with hybrid
// API Backend Sync + localStorage offline/demo
// ============================================

import { createContext, useContext, useReducer, useEffect } from 'react';
import { CLOSET_ITEMS, SHOPPING_RECOMMENDATIONS, DEMO_USERS } from '../data/mockData';
import { api } from '../services/api';
import { supabase, signInWithGoogle as startSupabaseGoogleOAuth } from '../services/supabase';

const WardrobeContext = createContext(null);

const STORAGE_KEY = 'wardrobe_app_state';

// ---- Initial State ----
const defaultState = {
  isAuthenticated: false,
  currentPage: 'landing',
  user: null,
  onboardingComplete: false,
  closetItems: [...CLOSET_ITEMS],
  shoppingList: [...SHOPPING_RECOMMENDATIONS],
  savedOutfits: [],
  trips: [],
  notifications: [],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return defaultState;
}

// ---- Reducer ----
function wardrobeReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        currentPage: action.payload.colorSeason ? 'closet' : 'onboarding',
        onboardingComplete: !!action.payload.colorSeason,
      };

    case 'LOGOUT':
      return { ...defaultState };

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        onboardingComplete: true,
        currentPage: 'closet',
      };

    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };

    case 'SET_CLOSET_ITEMS':
      return { ...state, closetItems: action.payload };

    case 'ADD_CLOSET_ITEM':
      return { ...state, closetItems: [action.payload, ...state.closetItems] };

    case 'REMOVE_CLOSET_ITEM':
      return { ...state, closetItems: state.closetItems.filter(i => i.id !== action.payload) };

    case 'SET_SAVED_OUTFITS':
      return { ...state, savedOutfits: action.payload };

    case 'SAVE_OUTFIT':
      return { ...state, savedOutfits: [action.payload, ...state.savedOutfits] };

    case 'REMOVE_OUTFIT':
      return { ...state, savedOutfits: state.savedOutfits.filter(o => o.id !== action.payload) };

    case 'SET_TRIPS':
      return { ...state, trips: action.payload };

    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };

    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t),
      };

    case 'REMOVE_TRIP':
      return { ...state, trips: state.trips.filter(t => t.id !== action.payload) };

    case 'TOGGLE_CHECKLIST_ITEM': {
      const { tripId, section, itemIndex } = action.payload;
      return {
        ...state,
        trips: state.trips.map(t => {
          if (t.id !== tripId) return t;
          const sectionItems = [...(t[section] || [])];
          if (sectionItems[itemIndex]) {
            sectionItems[itemIndex] = { ...sectionItems[itemIndex], checked: !sectionItems[itemIndex].checked };
          }
          return { ...t, [section]: sectionItems };
        }),
      };
    }

    case 'SET_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };

    case 'ADD_SHOPPING_ITEM':
      return { ...state, shoppingList: [action.payload, ...state.shoppingList] };

    case 'REMOVE_SHOPPING_ITEM':
      return { ...state, shoppingList: state.shoppingList.filter(i => i.id !== action.payload) };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 20) };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'RESET_STATE':
      return { ...defaultState };

    default:
      return state;
  }
}

// ---- Provider Component ----
export function WardrobeProvider({ children }) {
  const [state, dispatch] = useReducer(wardrobeReducer, null, loadState);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [state]);

  // Listen for Supabase Google OAuth redirect authentication
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        const u = session.user;
        const userData = {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Google User',
          avatar: u.user_metadata?.avatar_url || '🇬',
          persona: 'Supabase Google',
          onboardingDone: true,
        };
        if (session.access_token) {
          localStorage.setItem('wardrobe_token', session.access_token);
        }
        dispatch({ type: 'LOGIN', payload: userData });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const hasApiToken = () => !!localStorage.getItem('wardrobe_token');

  const actions = {
    setPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),

    login: async (user, token) => {
      if (token) {
        localStorage.setItem('wardrobe_token', token);
      }
      dispatch({ type: 'LOGIN', payload: user });

      // Attempt to sync user's cloud inventory if token exists
      if (token) {
        try {
          const [closetRes, outfitsRes, tripsRes, shoppingRes] = await Promise.allSettled([
            api.closet.getAll(),
            api.outfits.getAll(),
            api.travel.getAll(),
            api.shopping.getAll(),
          ]);
          if (closetRes.status === 'fulfilled' && closetRes.value?.items?.length > 0) {
            dispatch({ type: 'SET_CLOSET_ITEMS', payload: closetRes.value.items });
          }
          if (outfitsRes.status === 'fulfilled' && outfitsRes.value?.outfits?.length > 0) {
            dispatch({ type: 'SET_SAVED_OUTFITS', payload: outfitsRes.value.outfits });
          }
          if (tripsRes.status === 'fulfilled' && tripsRes.value?.trips?.length > 0) {
            dispatch({ type: 'SET_TRIPS', payload: tripsRes.value.trips });
          }
          if (shoppingRes.status === 'fulfilled' && shoppingRes.value?.items?.length > 0) {
            dispatch({ type: 'SET_SHOPPING_LIST', payload: shoppingRes.value.items });
          }
        } catch (e) {
          console.warn('Cloud sync on login failed, using local fallback:', e);
        }
      }
    },

    loginAsDemo: (personaKey) => {
      const user = DEMO_USERS[personaKey];
      if (user) {
        localStorage.removeItem('wardrobe_token'); // Demo mode uses local mock state
        dispatch({ type: 'LOGIN', payload: user });
      }
    },

    loginWithGoogle: async (googleData) => {
      try {
        const res = await api.auth.google(googleData);
        if (res?.token) {
          localStorage.setItem('wardrobe_token', res.token);
        }
        dispatch({ type: 'LOGIN', payload: res.user || googleData });

        // Attempt to sync cloud data after Google sign in
        if (res?.token) {
          try {
            const [closetRes, outfitsRes, tripsRes, shoppingRes] = await Promise.allSettled([
              api.closet.getAll(),
              api.outfits.getAll(),
              api.travel.getAll(),
              api.shopping.getAll(),
            ]);
            if (closetRes.status === 'fulfilled' && closetRes.value?.items?.length > 0) {
              dispatch({ type: 'SET_CLOSET_ITEMS', payload: closetRes.value.items });
            }
            if (outfitsRes.status === 'fulfilled' && outfitsRes.value?.outfits?.length > 0) {
              dispatch({ type: 'SET_SAVED_OUTFITS', payload: outfitsRes.value.outfits });
            }
            if (tripsRes.status === 'fulfilled' && tripsRes.value?.trips?.length > 0) {
              dispatch({ type: 'SET_TRIPS', payload: tripsRes.value.trips });
            }
            if (shoppingRes.status === 'fulfilled' && shoppingRes.value?.items?.length > 0) {
              dispatch({ type: 'SET_SHOPPING_LIST', payload: shoppingRes.value.items });
            }
          } catch (e) {
            console.warn('Cloud sync after Google sign in failed:', e);
          }
        }
      } catch (err) {
        console.warn('API Google sign in fallback to offline/demo:', err);
        dispatch({ type: 'LOGIN', payload: {
          id: `google_${Date.now()}`,
          name: googleData.name || googleData.email.split('@')[0],
          email: googleData.email,
          persona: 'Google OAuth',
          avatar: googleData.avatar || '🇬',
          colorSeason: 'True Winter',
          onboardingDone: false,
        }});
      }
    },

    loginWithSupabaseGoogle: async () => {
      try {
        await startSupabaseGoogleOAuth();
      } catch (err) {
        console.error('Supabase Google OAuth initialization failed:', err);
        throw err;
      }
    },

    logout: async () => {
      localStorage.removeItem('wardrobe_token');
      try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
      dispatch({ type: 'LOGOUT' });
    },

    completeOnboarding: async (data) => {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: data });
      if (hasApiToken()) {
        try {
          await api.auth.updateProfile(data);
        } catch (e) {
          console.warn('Failed to sync profile onboarding to backend API:', e);
        }
      }
    },

    updateProfile: async (data) => {
      dispatch({ type: 'UPDATE_PROFILE', payload: data });
      if (hasApiToken()) {
        try {
          await api.auth.updateProfile(data);
        } catch (e) {
          console.warn('Failed to sync profile update to backend API:', e);
        }
      }
    },

    addClosetItem: async (item) => {
      dispatch({ type: 'ADD_CLOSET_ITEM', payload: item });
      if (hasApiToken()) {
        try {
          await api.closet.create(item);
        } catch (e) {
          console.warn('Failed to sync new closet item to backend API:', e);
        }
      }
    },

    removeClosetItem: async (id) => {
      dispatch({ type: 'REMOVE_CLOSET_ITEM', payload: id });
      if (hasApiToken()) {
        try {
          await api.closet.delete(id);
        } catch (e) {
          console.warn('Failed to sync closet item deletion to backend API:', e);
        }
      }
    },

    saveOutfit: async (outfit) => {
      dispatch({ type: 'SAVE_OUTFIT', payload: outfit });
      if (hasApiToken()) {
        try {
          await api.outfits.save(outfit);
        } catch (e) {
          console.warn('Failed to sync saved outfit to backend API:', e);
        }
      }
    },

    removeOutfit: async (id) => {
      dispatch({ type: 'REMOVE_OUTFIT', payload: id });
      if (hasApiToken()) {
        try {
          await api.outfits.delete(id);
        } catch (e) {
          console.warn('Failed to sync outfit deletion to backend API:', e);
        }
      }
    },

    addTrip: async (trip) => {
      dispatch({ type: 'ADD_TRIP', payload: trip });
      if (hasApiToken()) {
        try {
          await api.travel.planTrip(trip);
        } catch (e) {
          console.warn('Failed to sync new trip to backend API:', e);
        }
      }
    },

    updateTrip: async (trip) => {
      dispatch({ type: 'UPDATE_TRIP', payload: trip });
      if (hasApiToken()) {
        try {
          await api.travel.update(trip.id, trip);
        } catch (e) {
          console.warn('Failed to sync trip update to backend API:', e);
        }
      }
    },

    removeTrip: async (id) => {
      dispatch({ type: 'REMOVE_TRIP', payload: id });
      if (hasApiToken()) {
        try {
          await api.travel.delete(id);
        } catch (e) {
          console.warn('Failed to sync trip deletion to backend API:', e);
        }
      }
    },

    toggleChecklistItem: (tripId, section, itemIndex) =>
      dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: { tripId, section, itemIndex } }),

    addShoppingItem: async (item) => {
      dispatch({ type: 'ADD_SHOPPING_ITEM', payload: item });
      if (hasApiToken()) {
        try {
          await api.shopping.create(item);
        } catch (e) {
          console.warn('Failed to sync shopping item to backend API:', e);
        }
      }
    },

    removeShoppingItem: async (id) => {
      dispatch({ type: 'REMOVE_SHOPPING_ITEM', payload: id });
      if (hasApiToken()) {
        try {
          await api.shopping.delete(id);
        } catch (e) {
          console.warn('Failed to sync shopping item deletion to backend API:', e);
        }
      }
    },

    addNotification: (msg) =>
      dispatch({ type: 'ADD_NOTIFICATION', payload: { id: Date.now(), message: msg, time: new Date().toISOString() } }),

    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),

    resetState: () => dispatch({ type: 'RESET_STATE' }),
  };

  return (
    <WardrobeContext.Provider value={{ state, actions }}>
      {children}
    </WardrobeContext.Provider>
  );
}

// ---- Hook ----
export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error('useWardrobe must be used within WardrobeProvider');
  return ctx;
}

export default WardrobeContext;
