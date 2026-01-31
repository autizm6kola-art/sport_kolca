
import { supabase } from './supabaseClient';

const STORAGE_PREFIX = "sport_kolca_";
const USE_SUPABASE = false;

// --- localStorage implementation ---

const localStorageImpl = {
  clearAllAnswers: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  getTaskKey: (id) => `${STORAGE_PREFIX}task_answer_${id}`,

  isTaskCorrect: (id) => {
    return localStorage.getItem(localStorageImpl.getTaskKey(id)) === 'true';
  },

  saveCorrectAnswer: (id) => {
    localStorage.setItem(localStorageImpl.getTaskKey(id), 'true');
  },

  migrateOldProgress: () => {
    const keys = Object.keys(localStorage);
    const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

    oldProgressKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data?.answeredTasks) {
          Object.keys(data.answeredTasks).forEach((taskId) => {
            localStorageImpl.saveCorrectAnswer(taskId);
          });
        }
      } catch (e) {
        console.error("Ошибка миграции:", key, e);
      }
    });
  },

  clearAnswersByIds: (ids) => {
    ids.forEach((id) => {
      localStorage.removeItem(localStorageImpl.getTaskKey(id));
      localStorage.removeItem(`${STORAGE_PREFIX}answer_text_${id}`);
      localStorage.removeItem(`${STORAGE_PREFIX}task_inputs_${id}`);

      let i = 0;
      while (true) {
        const key = `${STORAGE_PREFIX}input_correct_${id}_${i}`;
        if (!localStorage.getItem(key)) break;
        localStorage.removeItem(key);
        i++;
      }
    });
  },

  // ---------- BACKUP / RESTORE ----------

  exportProgress: () => {
    const data = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    });

    return data;
  },

  importProgress: (data) => {
    if (!data || typeof data !== 'object') return;

    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(key, value);
      }
    });
  },
};

// --- Supabase (на будущее, не трогаем) ---

const supabaseImpl = {
  clearAllAnswers: async (userId) => {
    await supabase.from('answers').delete().eq('user_id', userId);
  },
};

// --- Switch implementation ---

const storage = USE_SUPABASE ? supabaseImpl : localStorageImpl;

// --- Exports ---

export const clearAllAnswers = () => storage.clearAllAnswers();
export const isTaskCorrect = (id) => storage.isTaskCorrect(id);
export const saveCorrectAnswer = (id) => storage.saveCorrectAnswer(id);
export const migrateOldProgress = () => storage.migrateOldProgress();
export const clearAnswersByIds = (ids) => storage.clearAnswersByIds(ids);
export const getTaskKey = localStorageImpl.getTaskKey;

export const exportProgress = () => storage.exportProgress();
export const importProgress = (data) => storage.importProgress(data);

export function getSavedAnswer(taskId) {
  return localStorage.getItem(`${STORAGE_PREFIX}answer_text_${taskId}`) || '';
}

export function saveAnswerText(taskId, text) {
  localStorage.setItem(`${STORAGE_PREFIX}answer_text_${taskId}`, text);
}
