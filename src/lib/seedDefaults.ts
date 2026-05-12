import { supabase } from './supabase';
import { AIResponse, MeowDialogueConfig } from '../types';

export const MODULES = [
  'Snabbb.io',
  'Inventory',
  'Appointment',
  'Content Studio',
  'Profit Calculator',
  'To-Do Manager',
  'E-learning',
  'Expenses',
  'Insurance',
  'Lease',
];

// ─── Default data (was previously hardcoded in responseStore) ───────────────

export const DEFAULT_RESPONSES: Omit<AIResponse, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    intent: 'Greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: 'Hello! How can I assist you today?',
    status: 'active',
    targetApp: ['All'],
  },
  {
    intent: 'Pricing Inquiry',
    keywords: ['price', 'pricing', 'cost', 'how much'],
    response: 'Our basic plan starts at $9.99/month. You can find more details at our pricing page.',
    status: 'active',
    targetApp: ['All'],
  },
];


export const DEFAULT_MEOW_CONFIG: Omit<MeowDialogueConfig, 'timingConfigs'> & {
  timingConfigs: NonNullable<MeowDialogueConfig['timingConfigs']>;
} = {
  Normal: ['Meow.', 'Purr...', '*stretches*'],
  Hungry: ["Meow! I'm hungry!", 'Feed me right meow!', 'Where is my tuna?'],
  Unhappy: ['Hmph.', "Don't touch me.", 'I am displeased.'],
  Dirty: ['I need a bath...', "Yuck, I'm all dusty.", 'Time to groom myself.'],
  'Low Energy': ['*yawns*', 'So sleepy...', 'Nap time...'],
  Audio: [],
  timingConfigs: {
    Normal:       { messageDurationMinutes: 0.1,  messageIntervalMinutes: 0.25 },
    Hungry:       { messageDurationMinutes: 0.15, messageIntervalMinutes: 0.2 },
    Unhappy:      { messageDurationMinutes: 0.1,  messageIntervalMinutes: 0.2 },
    Dirty:        { messageDurationMinutes: 0.1,  messageIntervalMinutes: 0.2 },
    'Low Energy': { messageDurationMinutes: 0.15, messageIntervalMinutes: 0.35 },
    Audio:        { messageDurationMinutes: 0.1,  messageIntervalMinutes: 0.1 },
  },
};

export const DEFAULT_SIMULATOR_CONFIG = (moduleName: string) => ({
  module_name: moduleName,
  title: moduleName === 'Inventory'
    ? 'How can I help you today?'
    : `${moduleName} Simulator`,
  subtitle: moduleName === 'Inventory'
    ? 'Ask a question or try one of the suggestions below to test the AI responses.'
    : `Ask a question or try one of the suggestions below to test the ${moduleName} AI.`,
  prompts: moduleName === 'Inventory'
    ? [
        { text: 'Check expiring stock',  iconName: 'Zap' },
        { text: 'Total inventory value', iconName: 'ShieldCheck' },
        { text: 'Low supply alerts',     iconName: 'AlertCircle' },
        { text: 'Usage analytics',       iconName: 'BarChart3' },
      ]
    : [
        { text: 'How does it work?', iconName: 'Zap' },
        { text: 'Show examples',     iconName: 'Lightbulb' },
        { text: 'Best practices',    iconName: 'Star' },
        { text: 'Get help',          iconName: 'Info' },
      ],
  dialog_steps: [
    moduleName === 'Inventory'
      ? "👋 Hi there! I'm your AI assistant.\nI'm here to help you explore and understand all the features available."
      : `👋 Hi there! I'm your AI assistant for ${moduleName}.\nI'm here to help you explore and understand all the features available.`,
    "I can guide you through different apps like Inventory, Appointment, and more.\nYou can ask me questions or use the simulator to test responses.",
    "Ready to get started? 🚀\nGo ahead and ask me anything!",
  ],
  post_login_dialog_steps: ["Welcome back! 👋", 'How can I help you today?'],
});

// ─── Seed helpers ─────────────────────────────────────────────────────────────

/** Ensure a user's rows exist; call once on first login. */
export async function seedUserDefaults(userId: string): Promise<void> {
  // 1. Responses
  const { count } = await supabase
    .from('aiboard_responses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((count ?? 0) === 0) {
    for (const r of DEFAULT_RESPONSES) {
      const { data: responseData, error: respError } = await supabase.from('aiboard_responses').insert({
        user_id:    userId,
        intent:     r.intent,
        response:   r.response,
        status:     r.status,
      }).select().single();

      if (responseData) {
        if (r.keywords && r.keywords.length > 0) {
          await supabase.from('aiboard_response_keywords').insert(
            r.keywords.map(kw => ({ response_id: responseData.id, keyword: kw }))
          );
        }
        if (r.targetApp && r.targetApp.length > 0) {
          await supabase.from('aiboard_response_target_apps').insert(
            r.targetApp.map(app => ({ response_id: responseData.id, app_name: app }))
          );
        }
      }
    }
  }

  // 2. Simulator configs
  const { count: simCount } = await supabase
    .from('aiboard_simulator_configs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((simCount ?? 0) === 0) {
    for (const m of MODULES) {
      const cfg = DEFAULT_SIMULATOR_CONFIG(m);
      const { data: simData } = await supabase.from('aiboard_simulator_configs').insert({
        user_id: userId,
        module_name: cfg.module_name,
        title: cfg.title,
        subtitle: cfg.subtitle,
      }).select().single();

      if (simData) {
        if (cfg.prompts && cfg.prompts.length > 0) {
          await supabase.from('aiboard_simulator_prompts').insert(
            cfg.prompts.map((p, i) => ({ config_id: simData.id, text: p.text, icon_name: p.iconName, sort_order: i }))
          );
        }
        if (cfg.dialog_steps && cfg.dialog_steps.length > 0) {
          await supabase.from('aiboard_simulator_dialog_steps').insert(
            cfg.dialog_steps.map((s, i) => ({ config_id: simData.id, step_text: s, is_post_login: false, sort_order: i }))
          );
        }
        if (cfg.post_login_dialog_steps && cfg.post_login_dialog_steps.length > 0) {
          await supabase.from('aiboard_simulator_dialog_steps').insert(
            cfg.post_login_dialog_steps.map((s, i) => ({ config_id: simData.id, step_text: s, is_post_login: true, sort_order: i }))
          );
        }
      }
    }
  }

  // 3. Meow config
  const { count: meowCount } = await supabase
    .from('aiboard_meow_configs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((meowCount ?? 0) === 0) {
    const { data: meowData } = await supabase.from('aiboard_meow_configs').insert({
      user_id: userId
    }).select().single();

    if (meowData) {
      const cfg = DEFAULT_MEOW_CONFIG;
      const states = ['Normal', 'Hungry', 'Unhappy', 'Dirty', 'Low Energy', 'Audio'] as const;
      
      const messagesToInsert: any[] = [];
      const timingsToInsert: any[] = [];

      for (const state of states) {
        const msgs = cfg[state] as string[];
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

        const timing = cfg.timingConfigs[state];
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
  }

  // 4. Pricing Currencies
  const { count: currenciesCount } = await supabase
    .from('aiboard_pricing_currencies')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((currenciesCount ?? 0) === 0) {
    const { CURRENCIES } = await import('../store/pricingData');
    const currencyInserts = Object.values(CURRENCIES).map(c => ({
      user_id: userId,
      currency_code: c.code,
      rate: c.rate
    }));
    if (currencyInserts.length > 0) {
      await supabase.from('aiboard_pricing_currencies').insert(currencyInserts);
    }
  }

  // 5. Pricing Items
  const { count: itemsCount } = await supabase
    .from('aiboard_pricing_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if ((itemsCount ?? 0) === 0) {
    const { INITIAL_ITEMS } = await import('../store/pricingData');
    const itemInserts = INITIAL_ITEMS.map(item => ({
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
    if (itemInserts.length > 0) {
      await supabase.from('aiboard_pricing_items').insert(itemInserts);
    }
  }
}
