import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Background Assets Imports
import bgCyberpunk from '@/assets/images/backgrounds/home_bg_cyberpunk.png'
import bgXianxia from '@/assets/images/backgrounds/home_bg_xianxia.png'
import bgFantasy from '@/assets/images/backgrounds/home_bg_fantasy.png'
import bgSteampunk from '@/assets/images/backgrounds/home_bg_steampunk.png'

export type ThemePresetType =
  | 'simple'
  | 'xianxia'
  | 'fantasy'
  | 'steampunk'
  | 'cyberpunk'
  | 'custom'

export interface AppSettings {
  themePreset: ThemePresetType // Name/ID of current preset
  // Detailed styling
  titleFontFamily: string // Separate font for Titles
  bodyFontFamily: string // Standard UI font
  colors: {
    primary: string
    textPrimary: string
    textSecondary: string
    bgPrimary: string
    bgSecondary: string
  }
  uiScale: number
  glassOpacity: number
  backgroundImage: string | null
  nsfwEnabled: boolean
}

export interface PresetDef {
  id: string
  name: string
  isBuiltIn: boolean
  data: Partial<AppSettings>
}

// Built-in Presets
export const BUILTIN_PRESETS: Record<string, PresetDef> = {
  simple: {
    id: 'simple',
    name: 'Minimalist',
    isBuiltIn: true,
    data: {
      titleFontFamily: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      colors: {
        primary: '#0f172a',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        bgPrimary: '#f8fafc',
        bgSecondary: '#ffffff',
      },
      glassOpacity: 0.9,
      backgroundImage: null,
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon City',
    isBuiltIn: true,
    data: {
      titleFontFamily: "'Megrim', sans-serif", // Artistic
      bodyFontFamily: "'Rajdhani', sans-serif",
      colors: {
        primary: '#0ea5e9',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        bgPrimary: '#0f172a',
        bgSecondary: '#1e293b',
      },
      glassOpacity: 0.6,
      backgroundImage: bgCyberpunk,
    },
  },
  xianxia: {
    id: 'xianxia',
    name: 'Cloud Realm',
    isBuiltIn: true,
    data: {
      titleFontFamily: "'Ma Shan Zheng', cursive", // Calligraphy
      bodyFontFamily: "'Noto Serif SC', serif",
      colors: {
        primary: '#14b8a6',
        textPrimary: '#f0fdfa',
        textSecondary: '#ccfbf1',
        bgPrimary: '#115e59',
        bgSecondary: '#134e4a',
      },
      glassOpacity: 0.7,
      backgroundImage: bgXianxia,
    },
  },
  fantasy: {
    id: 'fantasy',
    name: 'High Kingdom',
    isBuiltIn: true,
    data: {
      titleFontFamily: "'Cinzel Decorative', serif", // Decorative
      bodyFontFamily: "'Cinzel', serif",
      colors: {
        primary: '#eab308',
        textPrimary: '#fffbeb',
        textSecondary: '#fcd34d',
        bgPrimary: '#451a03',
        bgSecondary: '#78350f',
      },
      glassOpacity: 0.75,
      backgroundImage: bgFantasy,
    },
  },
  steampunk: {
    id: 'steampunk',
    name: 'Brass Works',
    isBuiltIn: true,
    data: {
      titleFontFamily: "'Rye', serif", // Western/Industrial
      bodyFontFamily: "'Courier Prime', monospace",
      colors: {
        primary: '#f97316',
        textPrimary: '#fff7ed',
        textSecondary: '#fdba74',
        bgPrimary: '#431407',
        bgSecondary: '#7c2d12',
      },
      glassOpacity: 0.8,
      backgroundImage: bgSteampunk,
    },
  },
}

export const useSettingsStore = defineStore('settings', () => {
  // --- STATE ---

  // 1. Current Active Settings
  const savedState = localStorage.getItem('app-settings')
  const defaultState: AppSettings = {
    themePreset: 'simple',
    titleFontFamily: BUILTIN_PRESETS.simple.data.titleFontFamily!,
    bodyFontFamily: BUILTIN_PRESETS.simple.data.bodyFontFamily!,
    colors: { ...BUILTIN_PRESETS.simple.data.colors! },
    uiScale: 1.0,
    glassOpacity: 0.9,
    backgroundImage: null,
    nsfwEnabled: false,
  }
  const state = ref<AppSettings>(
    savedState ? { ...defaultState, ...JSON.parse(savedState) } : defaultState,
  )

  // 2. Custom Presets
  const savedPresets = localStorage.getItem('user-presets')
  const customPresets = ref<PresetDef[]>(savedPresets ? JSON.parse(savedPresets) : [])

  // 3. Custom Fonts (Loaded from Google)
  const savedFonts = localStorage.getItem('user-fonts')
  const customFonts = ref<string[]>(savedFonts ? JSON.parse(savedFonts) : [])

  // --- ACTIONS ---

  // Apply CSS Vars
  const applyTheme = () => {
    const root = document.documentElement
    const s = state.value

    root.style.setProperty('--font-family-title', s.titleFontFamily)
    root.style.setProperty('--font-family-body', s.bodyFontFamily)
    // Backward compat for 'font-family' generic
    root.style.setProperty('--font-family', s.bodyFontFamily)

    root.style.setProperty('--primary-color', s.colors.primary)
    root.style.setProperty('--text-primary', s.colors.textPrimary)
    root.style.setProperty('--text-secondary', s.colors.textSecondary)
    root.style.setProperty('--bg-primary', s.colors.bgPrimary)
    root.style.setProperty('--bg-secondary', s.colors.bgSecondary)

    const rgb = hexToRgb(s.colors.bgSecondary)
    if (rgb) {
      root.style.setProperty('--glass-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${s.glassOpacity})`)
    }
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Load a Preset (Built-in or Custom)
  function loadPreset(id: string) {
    // Check built-ins first
    let preset = BUILTIN_PRESETS[id]

    // Check customs
    if (!preset) {
      const custom = customPresets.value.find((p) => p.id === id)
      if (custom) preset = custom
    }

    if (!preset) return

    // Apply values
    state.value.themePreset = id as ThemePresetType // Allow loose typing for custom IDs
    if (preset.data.titleFontFamily) state.value.titleFontFamily = preset.data.titleFontFamily
    if (preset.data.bodyFontFamily) state.value.bodyFontFamily = preset.data.bodyFontFamily
    if (preset.data.colors) state.value.colors = { ...preset.data.colors }
    if (preset.data.glassOpacity) state.value.glassOpacity = preset.data.glassOpacity
    state.value.backgroundImage = preset.data.backgroundImage ?? null
  }

  // Save Current State as New Preset
  function saveAsPreset(name: string) {
    const id = 'custom_' + Date.now()
    const newPreset: PresetDef = {
      id,
      name,
      isBuiltIn: false,
      data: {
        titleFontFamily: state.value.titleFontFamily,
        bodyFontFamily: state.value.bodyFontFamily,
        colors: { ...state.value.colors },
        glassOpacity: state.value.glassOpacity,
        backgroundImage: state.value.backgroundImage,
        // UI Scale and NSFW usually not part of visual theme preset, but can be
      },
    }
    customPresets.value.push(newPreset)
    saveCustomPresets()
  }

  function deletePreset(id: string) {
    const idx = customPresets.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      customPresets.value.splice(idx, 1)
      saveCustomPresets()
    }
  }

  function saveCustomPresets() {
    localStorage.setItem('user-presets', JSON.stringify(customPresets.value))
  }

  // Import Font
  function addFont(fontName: string) {
    // Format: "Family Name" -> encode for URL
    if (customFonts.value.includes(fontName)) return

    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    customFonts.value.push(fontName)
    localStorage.setItem('user-fonts', JSON.stringify(customFonts.value))
  }

  // Re-inject custom fonts on load
  function loadCustomFonts() {
    customFonts.value.forEach((fontName) => {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    })
  }

  // Exports
  function exportPresetsJSON() {
    return JSON.stringify(customPresets.value, null, 2)
  }

  function importPresetsJSON(json: string) {
    try {
      const data = JSON.parse(json)
      if (Array.isArray(data)) {
        customPresets.value.push(...data)
        saveCustomPresets()
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  // --- INIT ---
  watch(
    state,
    (newVal) => {
      localStorage.setItem('app-settings', JSON.stringify(newVal))
      applyTheme()
    },
    { deep: true },
  )

  loadCustomFonts()
  applyTheme()

  return {
    state,
    customPresets,
    customFonts,
    BUILTIN_PRESETS,

    loadPreset,
    saveAsPreset,
    deletePreset,
    addFont,

    exportPresetsJSON,
    importPresetsJSON,
  }
})
