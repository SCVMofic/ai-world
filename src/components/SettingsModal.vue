<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore, BUILTIN_PRESETS } from '@/stores/settings'
import {
  X,
  Monitor,
  Plus,
  Download,
  Upload,
  Trash2,
  Type,
  Palette,
  Globe,
  ShieldAlert,
  Check,
  Save,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const settings = useSettingsStore()
const s = settings.state // Ref<AppSettings>
const { t, locale } = useI18n()

const activeTab = ref<'theme' | 'system'>('theme')

// --- Language ---
const changeLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('user-locale', lang)
}

// --- Preset Management ---
const presetName = ref('')
const showPresetInput = ref(false)

const applyPreset = (id: string) => {
  settings.loadPreset(id)
}

const handleSavePreset = () => {
  if (!presetName.value) return
  settings.saveAsPreset(presetName.value)
  showPresetInput.value = false
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
  <Transition name="modal">
    <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
      <div class="settings-modal glass-panel">
        <!-- Header / Tabs -->
        <div class="modal-header">
          <div class="tabs">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'theme' }"
              @click="activeTab = 'theme'"
            >
              <Palette :size="16" /> {{ t('settings.tabs.theme') }}
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'system' }"
              @click="activeTab = 'system'"
            >
              <ShieldAlert :size="16" /> {{ t('settings.tabs.system') }}
            </button>
          </div>

          <div class="actions">
            <!-- IO Buttons -->
            <button class="icon-btn" @click="handleExport" :title="t('settings.export_tooltip')">
              <Download :size="18" />
            </button>
            <button class="icon-btn" @click="handleImport" :title="t('settings.import_tooltip')">
              <Upload :size="18" />
            </button>
            <div class="divider-v"></div>
            <button class="icon-btn close-btn" @click="emit('close')"><X :size="20" /></button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="modal-content">
          <!-- === THEME TAB === -->
          <div v-show="activeTab === 'theme'" class="tab-content">
            <!-- Presets -->
            <div class="section">
              <div class="section-top">
                <h3><Monitor :size="16" /> {{ t('settings.presets') }}</h3>

                <div v-if="!showPresetInput" class="actions-right">
                  <button class="small-btn primary" @click="showPresetInput = true">
                    <Plus :size="14" /> {{ t('settings.new') }}
                  </button>
                </div>
                <div v-else class="preview-save-row">
                  <input
                    v-model="presetName"
                    :placeholder="t('settings.preset_name_placeholder')"
                    class="mini-input"
                  />
                  <button class="icon-btn-mini success" @click="handleSavePreset">
                    <Save :size="14" />
                  </button>
                  <button class="icon-btn-mini" @click="showPresetInput = false">
                    <X :size="14" />
                  </button>
                </div>
              </div>

              <div class="preset-grid">
                <button
                  v-for="p in BUILTIN_PRESETS"
                  :key="p.id"
                  class="preset-card builtin"
                  :class="{ active: s.themePreset === p.id }"
                  @click="applyPreset(p.id)"
                >
                  {{ p.name }}
                </button>
                <div
                  v-for="p in settings.customPresets"
                  :key="p.id"
                  class="preset-card custom"
                  :class="{ active: s.themePreset === p.id }"
                  @click="applyPreset(p.id)"
                >
                  <span>{{ p.name }}</span>
                  <button class="card-delete" @click.stop="deleteCustomPreset(p.id)">
                    <Trash2 :size="12" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Typography -->
            <div class="section">
              <h3><Type :size="16" /> {{ t('settings.typography') }}</h3>
              <div class="grid-2">
                <div class="field">
                  <label>{{ t('settings.title_font') }}</label>
                  <select v-model="s.titleFontFamily" class="select-input">
                    <optgroup label="Built-in">
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Orbitron', sans-serif">Orbitron</option>
                      <option value="'Megrim', sans-serif">Megrim</option>
                      <option value="'Ma Shan Zheng', cursive">Ma Shan Zheng</option>
                      <option value="'Cinzel Decorative', serif">Cinzel</option>
                      <option value="'Rye', serif">Rye</option>
                    </optgroup>
                    <optgroup label="Custom" v-if="settings.customFonts.length">
                      <option
                        v-for="f in settings.customFonts"
                        :key="f"
                        :value="`'${f}', sans-serif`"
                      >
                        {{ f }}
                      </option>
                    </optgroup>
                  </select>
                </div>
                <div class="field">
                  <label>{{ t('settings.body_font') }}</label>
                  <select v-model="s.bodyFontFamily" class="select-input">
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Rajdhani', sans-serif">Rajdhani</option>
                    <option value="'Noto Serif SC', serif">Noto Serif SC</option>
                    <option value="'Courier Prime', monospace">Courier Prime</option>
                  </select>
                </div>
              </div>
              <div class="add-row">
                <input
                  v-model="newFontName"
                  :placeholder="t('settings.add_font_placeholder')"
                  class="mini-input"
                />
                <button class="small-btn outline" @click="handleAddFont">
                  {{ t('settings.add') }}
                </button>
              </div>
            </div>

            <!-- Colors -->
            <div class="section">
              <h3><Palette :size="16" /> {{ t('settings.colors_backdrop') }}</h3>
              <div class="color-row">
                <div class="color-field">
                  <input type="color" v-model="s.colors.primary" :title="t('settings.accent')" />
                </div>
                <div class="color-field">
                  <input type="color" v-model="s.colors.textPrimary" :title="t('settings.text')" />
                </div>
                <div class="color-field">
                  <input
                    type="color"
                    v-model="s.colors.textSecondary"
                    :title="t('settings.subtext')"
                  />
                </div>
                <div class="color-field">
                  <input type="color" v-model="s.colors.bgPrimary" :title="t('settings.bg_main')" />
                </div>
                <div class="color-field">
                  <input
                    type="color"
                    v-model="s.colors.bgSecondary"
                    :title="t('settings.bg_panel')"
                  />
                </div>
              </div>
              <div class="range-row">
                <label
                  >{{ t('settings.glass_opacity') }} ({{
                    (s.glassOpacity * 100).toFixed(0)
                  }}%)</label
                >
                <input
                  type="range"
                  v-model.number="s.glassOpacity"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                />
              </div>
            </div>
          </div>

          <!-- === SYSTEM TAB === -->
          <div v-show="activeTab === 'system'" class="tab-content">
            <!-- NSFW Toggle -->
            <div class="setting-card danger-zone">
              <div class="card-info">
                <h4><ShieldAlert :size="20" /> {{ t('settings.nsfw.title') }}</h4>
                <p>{{ t('settings.nsfw.desc') }}</p>
                <span class="warning-text">{{ t('settings.nsfw.warning') }}</span>
              </div>
              <div class="card-control">
                <label class="switch">
                  <input type="checkbox" v-model="s.nsfwEnabled" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <!-- Language (Inside System Tab as well, optional but user asked for Top Right mostly) -->
            <div class="setting-card">
              <div class="card-info">
                <h4><Globe :size="20" /> {{ t('settings.language') }}</h4>
                <p>UI Language / 界面语言</p>
              </div>
              <div class="card-control">
                <div class="btn-group">
                  <button
                    class="group-btn"
                    :class="{ active: locale === 'en' }"
                    @click="changeLang('en')"
                  >
                    EN
                  </button>
                  <button
                    class="group-btn"
                    :class="{ active: locale === 'zh' }"
                    @click="changeLang('zh')"
                  >
                    中
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Imports IO Modal -->
      <div v-if="showIOModal" class="io-dialog">
        <div class="io-content glass-panel-dark">
          <h3>{{ t('settings.manage_json') }}</h3>
          <textarea v-model="ioJson" class="code-area"></textarea>
          <div class="io-actions">
            <button class="ghost-btn" @click="showIOModal = false">{{ t('common.close') }}</button>
            <button class="primary-btn" @click="handleImport">
              {{ t('settings.apply_import') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .settings-modal,
.modal-leave-to .settings-modal {
  transform: scale(0.95);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-modal {
  width: 600px;
  height: 700px;
  max-height: 90vh;
  background: var(--glass-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease;
  color: var(--text-primary);
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  gap: 1rem;
  height: 100%;
}
.tab-btn {
  background: none;
  border: none;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0 0.5rem;
}
.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}
.tab-btn:hover {
  color: var(--text-primary);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}
.close-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
.divider-v {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 5px;
}

/* Content */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
}
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 5px;
}
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.section-top h3 {
  border: none;
  margin: 0;
  padding: 0;
}

/* Preset Grid */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.preset-card {
  padding: 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  color: var(--text-primary);
  cursor: pointer;
  text-align: center;
  font-size: 0.85rem;
  position: relative;
  transition: all 0.2s;
}
.preset-card:hover {
  transform: translateY(-2px);
  background: rgba(0, 0, 0, 0.3);
}
.preset-card.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color), 0.15);
  color: var(--primary-color);
  font-weight: bold;
}
.card-delete {
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  color: #ef4444;
  opacity: 0;
  cursor: pointer;
}
.preset-card:hover .card-delete {
  opacity: 1;
}

.preview-save-row {
  display: flex;
  gap: 5px;
}
.icon-btn-mini {
  padding: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}
.icon-btn-mini.success {
  background: var(--primary-color);
  color: var(--bg-primary);
}

/* Typography */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
}
.field label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.select-input,
.mini-input {
  width: 100%;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-radius: 4px;
  outline: none;
  font-size: 0.9rem;
}
.add-row {
  display: flex;
  gap: 5px;
}

/* Colors */
.color-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
}
.color-field input {
  width: 40px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
}
.range-row {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* System Cards */
.setting-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setting-card.danger-zone {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}
.card-info h4 {
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}
.card-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.warning-text {
  display: block;
  margin-top: 5px;
  color: #f87171;
  font-size: 0.75rem;
  font-weight: bold;
}

/* Switch & Buttons */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: var(--primary-color);
}
input:checked + .slider:before {
  transform: translateX(20px);
}

.btn-group {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 2px;
}
.group-btn {
  padding: 5px 12px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}
.group-btn.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.small-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
}
.primary {
  background: var(--primary-color);
  color: var(--bg-primary);
  font-weight: bold;
}
.outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: var(--text-secondary);
}
.outline:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

/* IO Dialog */
.io-dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.io-content {
  width: 90%;
  height: 80%;
  background: #0f172a;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--primary-color);
}
.code-area {
  flex: 1;
  background: #000;
  color: #0f0;
  font-family: monospace;
  padding: 10px;
  border: none;
  resize: none;
}
.io-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.primary-btn {
  padding: 8px 16px;
  background: var(--primary-color);
  color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
.ghost-btn {
  padding: 8px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
}
</style>
