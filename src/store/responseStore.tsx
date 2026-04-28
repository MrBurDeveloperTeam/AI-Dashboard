import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AIResponse, SimulatorConfig, MeowDialogueConfig, PetState } from '../types';
import { supabase } from '../lib/supabase';
import { MODULES, DEFAULT_MEOW_CONFIG, DEFAULT_SIMULATOR_CONFIG, seedUserDefaults } from '../lib/seedDefaults';
import { CurrencyCode, Currency, ALL_AVAILABLE_CURRENCIES, CURRENCIES as DEFAULT_CURRENCIES, Item, INITIAL_ITEMS, CategoryId } from './pricingData';

export { MODULES };

// ─── Context Types ─────────────────────────────────────────────────────────────

interface StoreContextType {
  responses: AIResponse[];
  addResponse: (response: Omit<AIResponse, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateResponse: (id: string, updates: Partial<Omit<AIResponse, 'id'>>) => Promise<void>;
  deleteResponse: (id: string) => Promise<void>;
  simulatorConfig: SimulatorConfig;
  updateSimulatorConfig: (updates: Partial<SimulatorConfig>) => Promise<void>;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  modules: string[];
  meowConfig: MeowDialogueConfig;
  updateMeowConfig: (updates: Partial<MeowDialogueConfig>) => Promise<void>;
  pricingCurrencies: Record<CurrencyCode, Currency>;
  updatePricingCurrencies: (currencies: Record<CurrencyCode, Currency>) => Promise<void>;
  pricingItems: Item[];
  updatePricingItems: (items: Item[]) => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─── Row → Domain mappers ──────────────────────────────────────────────────────

function rowToCurrency(row: any): Currency {
  const code = row.currency_code;
  const match = ALL_AVAILABLE_CURRENCIES.find(c => c.code === code);
  return {
    code,
    name: match ? match.name : code,
    symbol: match ? match.symbol : '',
    flag: match ? match.flag : '',
    rate: Number(row.rate)
  };
}

function rowToPricingItem(row: any): Item {
  return {
    id: row.item_id,
    name: row.name,
    emoji: row.emoji,
    categoryId: row.category_id as CategoryId,
    basePriceUSD: Number(row.base_price_usd),
    hunger: row.hunger,
    happiness: row.happiness,
    unlockLevel: row.unlock_level,
    color: row.color,
  };
}

function rowToAIResponse(row: any): AIResponse {
  return {
    id:        row.id,
    intent:    row.intent,
    keywords:  row.aiboard_response_keywords ? row.aiboard_response_keywords.map((k: any) => k.keyword) : [],
    response:  row.response,
    status:    row.status,
    targetApp: row.aiboard_response_target_apps ? row.aiboard_response_target_apps.map((a: any) => a.app_name) : ['All'],
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

function rowToSimulatorConfig(row: any): SimulatorConfig {
  const prompts = row.aiboard_simulator_prompts ? row.aiboard_simulator_prompts.sort((a: any, b: any) => a.sort_order - b.sort_order).map((p: any) => ({ text: p.text, iconName: p.icon_name })) : [];
  const steps = row.aiboard_simulator_dialog_steps ? row.aiboard_simulator_dialog_steps.sort((a: any, b: any) => a.sort_order - b.sort_order) : [];
  
  return {
    title:                row.title,
    subtitle:             row.subtitle ?? '',
    prompts:              prompts,
    dialogSteps:          steps.filter((s: any) => !s.is_post_login).map((s: any) => s.step_text),
    postLoginDialogSteps: steps.filter((s: any) => s.is_post_login).map((s: any) => s.step_text),
  };
}

function rowToMeowConfig(row: any): MeowDialogueConfig {
  const msgs = row.aiboard_meow_messages ? row.aiboard_meow_messages.sort((a: any, b: any) => a.sort_order - b.sort_order) : [];
  const timings = row.aiboard_meow_timing || [];

  const getMsgs = (state: string) => msgs.filter((m: any) => m.state === state).map((m: any) => m.is_audio ? JSON.stringify({ name: m.audio_name, url: m.message }) : m.message);
  const getTiming = (state: string) => {
    const t = timings.find((tm: any) => tm.state === state);
    if (!t) return DEFAULT_MEOW_CONFIG.timingConfigs?.[state as PetState] || { messageDurationMinutes: 0.1, messageIntervalMinutes: 0.25 };
    return {
      messageDurationMinutes: Number(t.message_duration_minutes),
      messageIntervalMinutes: Number(t.message_interval_minutes),
      disabled: t.disabled
    };
  };

  return {
    Normal:       getMsgs('Normal').length ? getMsgs('Normal') : DEFAULT_MEOW_CONFIG.Normal,
    Hungry:       getMsgs('Hungry').length ? getMsgs('Hungry') : DEFAULT_MEOW_CONFIG.Hungry,
    Unhappy:      getMsgs('Unhappy').length ? getMsgs('Unhappy') : DEFAULT_MEOW_CONFIG.Unhappy,
    Dirty:        getMsgs('Dirty').length ? getMsgs('Dirty') : DEFAULT_MEOW_CONFIG.Dirty,
    'Low Energy': getMsgs('Low Energy').length ? getMsgs('Low Energy') : DEFAULT_MEOW_CONFIG['Low Energy'],
    Audio:        getMsgs('Audio').length ? getMsgs('Audio') : [],
    timingConfigs: {
      Normal: getTiming('Normal'),
      Hungry: getTiming('Hungry'),
      Unhappy: getTiming('Unhappy'),
      Dirty: getTiming('Dirty'),
      'Low Energy': getTiming('Low Energy'),
      Audio: getTiming('Audio'),
    }
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [simulatorConfigs, setSimulatorConfigs] = useState<Record<string, SimulatorConfig>>({});
  const [meowConfig, setMeowConfig] = useState<MeowDialogueConfig>(DEFAULT_MEOW_CONFIG);
  const [pricingCurrencies, setPricingCurrencies] = useState<Record<CurrencyCode, Currency>>(DEFAULT_CURRENCIES);
  const [pricingItems, setPricingItems] = useState<Item[]>(INITIAL_ITEMS);
  const [activeModule, setActiveModuleState] = useState<string>(MODULES[0]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Auth: get current session ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // ── Load data once we have a userId ───────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);

      // Seed defaults if first time
      await seedUserDefaults(userId);

      // Parallel fetches
      const [respResult, simResult, meowResult, pricingResult, pricingItemsResult] = await Promise.all([
        supabase
          .from('aiboard_responses')
          .select('*, aiboard_response_keywords(keyword), aiboard_response_target_apps(app_name)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('aiboard_simulator_configs')
          .select('*, aiboard_simulator_prompts(*), aiboard_simulator_dialog_steps(*)')
          .eq('user_id', userId),
        supabase
          .from('aiboard_meow_configs')
          .select('*, aiboard_meow_messages(*), aiboard_meow_timing(*)')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('aiboard_pricing_currencies')
          .select('*')
          .eq('user_id', userId),
        supabase
          .from('aiboard_pricing_items')
          .select('*')
          .eq('user_id', userId),
      ]);

      if (respResult.data) setResponses(respResult.data.map(rowToAIResponse));

      if (simResult.data) {
        const configs: Record<string, SimulatorConfig> = {};
        simResult.data.forEach((row: any) => {
          configs[row.module_name] = rowToSimulatorConfig(row);
        });
        setSimulatorConfigs(configs);
      }

      if (meowResult.data) setMeowConfig(rowToMeowConfig(meowResult.data));

      if (pricingResult && pricingResult.data && pricingResult.data.length > 0) {
        const curMap: Record<CurrencyCode, Currency> = {};
        pricingResult.data.forEach((row: any) => {
          curMap[row.currency_code] = rowToCurrency(row);
        });
        setPricingCurrencies(curMap);
      }

      if (pricingItemsResult && pricingItemsResult.data && pricingItemsResult.data.length > 0) {
        setPricingItems(pricingItemsResult.data.map(rowToPricingItem));
      }

      setIsLoading(false);
    })();
  }, [userId]);

  // ── Computed simulator config for the active module ────────────────────────
  const simulatorConfig: SimulatorConfig =
    simulatorConfigs[activeModule] ??
    rowToSimulatorConfig(DEFAULT_SIMULATOR_CONFIG(activeModule));

  const setActiveModule = useCallback((mod: string) => setActiveModuleState(mod), []);

  // ── Response CRUD ─────────────────────────────────────────────────────────
  const addResponse = useCallback(async (
    response: Omit<AIResponse, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('aiboard_responses')
      .insert({
        user_id:    userId,
        intent:     response.intent,
        response:   response.response,
        status:     response.status,
      })
      .select()
      .single();
    if (!error && data) {
      if (response.keywords && response.keywords.length > 0) {
        await supabase.from('aiboard_response_keywords').insert(
          response.keywords.map(kw => ({ response_id: data.id, keyword: kw }))
        );
      }
      if (response.targetApp && response.targetApp.length > 0) {
        await supabase.from('aiboard_response_target_apps').insert(
          response.targetApp.map(app => ({ response_id: data.id, app_name: app }))
        );
      }
      // Re-fetch to get nested data
      const { data: fullData } = await supabase.from('aiboard_responses').select('*, aiboard_response_keywords(keyword), aiboard_response_target_apps(app_name)').eq('id', data.id).single();
      if (fullData) {
        setResponses(prev => [rowToAIResponse(fullData), ...prev]);
      }
    }
  }, [userId]);

  const updateResponse = useCallback(async (
    id: string,
    updates: Partial<Omit<AIResponse, 'id'>>
  ) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.intent    !== undefined) dbUpdates.intent     = updates.intent;
    if (updates.response  !== undefined) dbUpdates.response   = updates.response;
    if (updates.status    !== undefined) dbUpdates.status     = updates.status;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase
        .from('aiboard_responses')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', userId!);
    }

    if (updates.keywords !== undefined) {
      await supabase.from('aiboard_response_keywords').delete().eq('response_id', id);
      if (updates.keywords.length > 0) {
        await supabase.from('aiboard_response_keywords').insert(updates.keywords.map(kw => ({ response_id: id, keyword: kw })));
      }
    }

    if (updates.targetApp !== undefined) {
      await supabase.from('aiboard_response_target_apps').delete().eq('response_id', id);
      if (updates.targetApp.length > 0) {
        await supabase.from('aiboard_response_target_apps').insert(updates.targetApp.map(app => ({ response_id: id, app_name: app })));
      }
    }

    const { data } = await supabase.from('aiboard_responses').select('*, aiboard_response_keywords(keyword), aiboard_response_target_apps(app_name)').eq('id', id).single();
    if (data) {
      setResponses(prev => prev.map(r => r.id === id ? rowToAIResponse(data) : r));
    }
  }, [userId]);

  const deleteResponse = useCallback(async (id: string) => {
    await supabase
      .from('aiboard_responses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId!);
    setResponses(prev => prev.filter(r => r.id !== id));
  }, [userId]);

  // ── Simulator Config ──────────────────────────────────────────────────────
  const updateSimTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const updateSimulatorConfig = useCallback(async (updates: Partial<SimulatorConfig>) => {
    if (!userId) return;
    const current = simulatorConfigs[activeModule] ?? rowToSimulatorConfig(DEFAULT_SIMULATOR_CONFIG(activeModule));
    const merged = { ...current, ...updates };

    // Optimistic update
    setSimulatorConfigs(prev => ({
      ...prev,
      [activeModule]: merged,
    }));

    if (updateSimTimeout.current) clearTimeout(updateSimTimeout.current);

    updateSimTimeout.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from('aiboard_simulator_configs')
        .upsert({
          user_id:                 userId,
          module_name:             activeModule,
          title:                   merged.title,
          subtitle:                merged.subtitle,
        }, { onConflict: 'user_id,module_name' })
        .select()
        .single();

      if (!error && data) {
        // Prompts
        await supabase.from('aiboard_simulator_prompts').delete().eq('config_id', data.id);
        if (merged.prompts && merged.prompts.length > 0) {
          await supabase.from('aiboard_simulator_prompts').insert(
            merged.prompts.map((p, i) => ({ config_id: data.id, text: p.text, icon_name: p.iconName, sort_order: i }))
          );
        }

        // Dialog Steps
        await supabase.from('aiboard_simulator_dialog_steps').delete().eq('config_id', data.id);
        const steps = [];
        if (merged.dialogSteps) {
          steps.push(...merged.dialogSteps.map((s, i) => ({ config_id: data.id, step_text: s, is_post_login: false, sort_order: i })));
        }
        if (merged.postLoginDialogSteps) {
          steps.push(...merged.postLoginDialogSteps.map((s, i) => ({ config_id: data.id, step_text: s, is_post_login: true, sort_order: i })));
        }
        if (steps.length > 0) {
          await supabase.from('aiboard_simulator_dialog_steps').insert(steps);
        }
      }
    }, 500);
  }, [userId, activeModule, simulatorConfigs]);

  // ── Meow Config ───────────────────────────────────────────────────────────
  const updateMeowConfig = useCallback(async (updates: Partial<MeowDialogueConfig>) => {
    if (!userId) return;
    const merged = { ...meowConfig, ...updates };

    // Optimistic update
    setMeowConfig(merged);

    const { data: meowData } = await supabase
      .from('aiboard_meow_configs')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
      .select()
      .single();

    if (meowData) {
      await supabase.from('aiboard_meow_messages').delete().eq('config_id', meowData.id);
      await supabase.from('aiboard_meow_timing').delete().eq('config_id', meowData.id);

      const states = ['Normal', 'Hungry', 'Unhappy', 'Dirty', 'Low Energy', 'Audio'] as const;
      const messagesToInsert: any[] = [];
      const timingsToInsert: any[] = [];

      for (const state of states) {
        const msgs = merged[state] as string[];
        if (msgs) {
          msgs.forEach((msg, i) => {
            const isAudio = state === 'Audio';
            let msgText = msg;
            let audioName = null;
            if (isAudio) {
               try {
                 const parsed = JSON.parse(msg);
                 msgText = parsed.url;
                 audioName = parsed.name;
               } catch (e) { }
            }
            messagesToInsert.push({
              config_id: meowData.id,
              state: state,
              message: msgText,
              is_audio: isAudio,
              audio_name: audioName,
              sort_order: i
            });
          });
        }

        const timing = merged.timingConfigs[state];
        if (timing) {
          timingsToInsert.push({
            config_id: meowData.id,
            state: state,
            message_duration_minutes: timing.messageDurationMinutes,
            message_interval_minutes: timing.messageIntervalMinutes,
            disabled: timing.disabled || false
          });
        }
      }

      if (messagesToInsert.length > 0) {
        await supabase.from('aiboard_meow_messages').insert(messagesToInsert);
      }
      if (timingsToInsert.length > 0) {
        await supabase.from('aiboard_meow_timing').insert(timingsToInsert);
      }
    }
  }, [userId, meowConfig]);

  // ── Pricing Currencies ────────────────────────────────────────────────────
  const updatePricingCurrenciesTimeout = useRef<NodeJS.Timeout | null>(null);

  const updatePricingCurrencies = useCallback(async (currencies: Record<CurrencyCode, Currency>) => {
    if (!userId) return;
    
    // Optimistic update
    setPricingCurrencies(currencies);

    if (updatePricingCurrenciesTimeout.current) clearTimeout(updatePricingCurrenciesTimeout.current);

    updatePricingCurrenciesTimeout.current = setTimeout(async () => {
      // Wiping out existing currencies for user to insert new exact state.
      await supabase.from('aiboard_pricing_currencies').delete().eq('user_id', userId);
      
      const inserts = Object.values(currencies).map(c => ({
        user_id: userId,
        currency_code: c.code,
        rate: c.rate
      }));
      
      if (inserts.length > 0) {
        await supabase.from('aiboard_pricing_currencies').insert(inserts);
      }
    }, 500);
  }, [userId]);

  // ── Pricing Items ─────────────────────────────────────────────────────────
  const updatePricingItemsTimeout = useRef<NodeJS.Timeout | null>(null);

  const updatePricingItems = useCallback(async (items: Item[]) => {
    if (!userId) return;
    
    // Optimistic update
    setPricingItems(items);

    if (updatePricingItemsTimeout.current) clearTimeout(updatePricingItemsTimeout.current);

    updatePricingItemsTimeout.current = setTimeout(async () => {
      // Wiping out existing items for user to insert new exact state.
      await supabase.from('aiboard_pricing_items').delete().eq('user_id', userId);
      
      const inserts = items.map(item => ({
        user_id: userId,
        item_id: item.id,
        name: item.name,
        emoji: item.emoji,
        category_id: item.categoryId,
        base_price_usd: item.basePriceUSD,
        hunger: item.hunger,
        happiness: item.happiness,
        unlock_level: item.unlockLevel,
        color: item.color || null,
      }));
      
      if (inserts.length > 0) {
        await supabase.from('aiboard_pricing_items').insert(inserts);
      }
    }, 500);
  }, [userId]);

  return (
    <StoreContext.Provider value={{
      responses, addResponse, updateResponse, deleteResponse,
      simulatorConfig, updateSimulatorConfig,
      activeModule, setActiveModule, modules: MODULES,
      meowConfig, updateMeowConfig,
      pricingCurrencies, updatePricingCurrencies,
      pricingItems, updatePricingItems,
      isLoading,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
};

// Re-export so existing imports of defaultConfigs still compile
export const defaultConfigs: Record<string, SimulatorConfig> = Object.fromEntries(
  MODULES.map(m => [m, rowToSimulatorConfig(DEFAULT_SIMULATOR_CONFIG(m))])
);
