<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore, BUILTIN_PRESETS } from '@/stores/settings' // Removed ThemePresetType
import {
  ArrowLeft,
  Monitor,
  Plus,
  Download,
  Upload,
  Trash2,
  Type,
  Palette,
  Globe,
} from 'lucide-vue-next' // Added Globe
import { useI18n } from 'vue-i18n'

const router = useRouter()
const settings = useSettingsStore()
const s = settings.state
const { t, locale } = useI18n()

const handleBack = () => router.push('/')

// --- Language ---
const currentLang = ref(locale.value)
watch(currentLang, (val) => {
  locale.value = val
  localStorage.setItem('user-locale', val)
})

// --- Preset Management ---
const presetName = ref('')
const showPresetModal = ref(false)

const applyPreset = (id: string) => {
  settings.loadPreset(id)
}

const handleSavePreset = () => {
  if (!presetName.value) return
  settings.saveAsPreset(presetName.value)
  showPresetModal.value = false
  presetName.value = ''
}

const deleteCustomPreset = (id: string) => {
  if (confirm(t('settings.delete_confirm'))) {
    settings.deletePreset(id)
  }
}

// --- Font Management ---
const newFontName = ref('')
const handleAddFont = () => {
  if (newFontName.value) {
    settings.addFont(newFontName.value)
    newFontName.value = ''
  }
}

// --- Import/Export ---
const showIOModal = ref(false)
const ioJson = ref('')

const handleExport = () => {
  ioJson.value = settings.exportPresetsJSON()
  showIOModal.value = true
}
const handleImport = () => {
  if (settings.importPresetsJSON(ioJson.value)) {
    alert(t('settings.imported_success'))
    showIOModal.value = false
  } else {
    alert(t('settings.invalid_json'))
  }
}
</script>

<template>
  <div class="settings-container">
    <div class="glass-panel">
      <!-- Header -->
      <div class="header">
        <button class="icon-btn" @click="handleBack">
          <ArrowLeft :size="24" />
        </button>
        <h2>{{ t('settings.title') }}</h2>

        <div class="header-actions">
          <button
            class="small-btn outline"
            @click="handleExport"
            :title="t('settings.export_tooltip')"
          >
            <Download :size="16" />
          </button>
          <button
            class="small-btn outline"
            @click="handleImport"
            :title="t('settings.import_tooltip')"
          >
            <Upload :size="16" />
          </button>
        </div>
      </div>

      <div class="scroll-content">
        <!-- LANGUAGE -->
        <div class="section">
          <h3><Globe :size="16" /> {{ t('settings.language') }}</h3>
          <div class="setting-row">
            <div class="toggle-group">
              <button
                class="toggle-option"
                :class="{ active: currentLang === 'en' }"
                @click="currentLang = 'en'"
              >
                English
              </button>
              <button
                class="toggle-option"
                :class="{ active: currentLang === 'zh' }"
                @click="currentLang = 'zh'"
              >
                中文
              </button>
            </div>
          </div>
        </div>

        <!-- PRESETS GRID -->
        <div class="section">
          <div class="section-title">
            <h3><Monitor :size="16" /> {{ t('settings.presets') }}</h3>
            <button class="small-btn primary" @click="showPresetModal = true">
              <Plus :size="14" /> {{ t('settings.new') }}
            </button>
          </div>

          <div class="preset-grid">
            <!-- Built-in -->
            <button
              v-for="p in BUILTIN_PRESETS"
              :key="p.id"
              class="preset-card builtin"
              :class="{ active: s.themePreset === p.id }"
              @click="applyPreset(p.id)"
            >
              {{ p.name }}
            </button>

            <!-- Custom -->
            <div
              v-for="p in settings.customPresets"
              :key="p.id"
              class="preset-card custom"
              :class="{ active: settings.state.value.themePreset === p.id }"
              @click="applyPreset(p.id)"
            >
              <span>{{ p.name }}</span>
              <button class="delete-btn" @click.stop="deleteCustomPreset(p.id)">
                <Trash2 :size="12" />
              </button>
            </div>
          </div>
        </div>

        <hr class="divider" />

        <!-- FINE TUNING: FONTS -->
        <div class="section">
          <h3><Type :size="16" /> {{ t('settings.typography') }}</h3>

          <div class="setting-row">
            <span>{{ t('settings.title_font') }}</span>
            <select v-model="s.titleFontFamily" class="select-input">
              <optgroup label="Built-in">
                <option value="'Inter', sans-serif">Inter (Modern)</option>
                <option value="'Orbitron', sans-serif">Orbitron (SciFi)</option>
                <option value="'Megrim', sans-serif">Megrim (Cyber)</option>
                <option value="'Ma Shan Zheng', cursive">Ma Shan Zheng (Ink)</option>
                <option value="'Cinzel Decorative', serif">Cinzel (Fantasy)</option>
                <option value="'Rye', serif">Rye (Western)</option>
              </optgroup>
              <optgroup label="Custom" v-if="settings.customFonts.length">
                <option v-for="f in settings.customFonts" :key="f" :value="`'${f}', sans-serif`">
                  {{ f }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="setting-row">
            <span>{{ t('settings.body_font') }}</span>
            <select v-model="s.bodyFontFamily" class="select-input">
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Rajdhani', sans-serif">Rajdhani</option>
              <option value="'Noto Serif SC', serif">Noto Serif SC</option>
              <option value="'Courier Prime', monospace">Courier Prime</option>
            </select>
          </div>

          <div class="setting-row import-row">
            <input
              v-model="newFontName"
              :placeholder="t('settings.add_font_placeholder')"
              class="text-input"
            />
            <button @click="handleAddFont" class="small-btn outline">
              {{ t('settings.add') }}
            </button>
          </div>
        </div>

        <!-- FINE TUNING: COLORS -->
        <div class="section">
          <h3><Palette :size="16" /> {{ t('settings.colors_backdrop') }}</h3>
          <div class="color-grid">
            <div class="color-item">
              <label>{{ t('settings.accent') }}</label>
              <input type="color" v-model="s.colors.primary" />
            </div>
            <div class="color-item">
              <label>{{ t('settings.text') }}</label>
              <input type="color" v-model="s.colors.textPrimary" />
            </div>
            <div class="color-item">
              <label>{{ t('settings.subtext') }}</label>
              <input type="color" v-model="s.colors.textSecondary" />
            </div>
            <div class="color-item">
              <label>{{ t('settings.bg_main') }}</label>
              <input type="color" v-model="s.colors.bgPrimary" />
            </div>
            <div class="color-item">
              <label>{{ t('settings.bg_panel') }}</label>
              <input type="color" v-model="s.colors.bgSecondary" />
            </div>
          </div>

          <div class="setting-row" style="margin-top: 15px">
            <span>{{ t('settings.glass_opacity') }}</span>
            <input type="range" v-model.number="s.glassOpacity" min="0.1" max="1.0" step="0.05" />
          </div>
        </div>
      </div>
    </div>

    <!-- SAVE PRESET MODAL -->
    <div v-if="showPresetModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ t('settings.save_preset_title') }}</h3>
        <input
          v-model="presetName"
          :placeholder="t('settings.preset_name_placeholder')"
          class="text-input"
          style="width: 100%"
        />
        <div class="modal-actions">
          <button class="ghost-btn" @click="showPresetModal = false">
            {{ t('settings.cancel') }}
          </button>
          <button class="primary-btn" @click="handleSavePreset">{{ t('settings.save') }}</button>
        </div>
      </div>
    </div>

    <!-- IO MODAL -->
    <div v-if="showIOModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ t('settings.manage_json') }}</h3>
        <textarea v-model="ioJson" class="code-area"></textarea>
        <div class="modal-actions">
          <button class="ghost-btn" @click="showIOModal = false">{{ t('settings.close') }}</button>
          <button class="primary-btn" @click="handleImport">
            {{ t('settings.apply_import') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-primary);
  background-image: v-bind("s.backgroundImage ? `url(${s.backgroundImage})` : 'none'");
  background-size: cover;
  background-position: center;
  color: var(--text-primary);
}

.glass-panel {
  width: 500px;
  max-height: 85vh;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
.header h2 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 2px;
  flex: 1;
}
.header-actions {
  display: flex;
  gap: 5px;
}

.scroll-content {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin: 0;
}

.divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
}

/* Preset Grid */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.preset-card {
  padding: 10px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preset-card:hover {
  background: rgba(0, 0, 0, 0.25);
}
.preset-card.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color), 0.1);
  color: var(--primary-color);
  font-weight: bold;
}

.delete-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  color: #ef4444;
  opacity: 0;
  cursor: pointer;
}
.preset-card:hover .delete-btn {
  opacity: 1;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.select-input,
.text-input {
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  outline: none;
}
.select-input {
  width: 180px;
}

.import-row {
  gap: 10px;
}
.import-row input {
  flex: 1;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.color-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}
.color-item label {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
.color-item input[type='color'] {
  width: 40px;
  height: 30px;
  border: none;
  cursor: pointer;
  padding: 0;
  background: none;
  border-radius: 4px;
}

.toggle-group {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 2px;
}
.toggle-option {
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
}
.toggle-option.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.code-area {
  width: 100%;
  height: 150px;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  resize: vertical;
}

/* Buttons */
.small-btn {
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
}
.primary {
  background: var(--primary-color);
  color: var(--bg-primary);
  font-weight: bold;
}
.outline {
  background: transparent;
  border: 1px solid var(--text-secondary);
  color: var(--text-primary);
}
.ghost-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px 12px;
}
.primary-btn {
  padding: 6px 16px;
  background: var(--primary-color);
  color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.icon-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
}
</style>
