/**
 * Safe Audio Utility
 * Provides defensive methods to play audio and handle browser-specific promise rejections.
 */

const audioPool = new Map();

export const playAudio = async (url) => {
  try {
    // Reuse audio objects to avoid excessive memory usage
    let audio = audioPool.get(url);
    if (!audio) {
      audio = new Audio(url);
      audioPool.set(url, audio);
    }

    // Reset to start if it was already playing or paused
    audio.currentTime = 0;

    // Browser policy requires user interaction before audio can play.
    // Wrap in try-catch to handle rejections gracefully.
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      await playPromise;
    }
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      console.warn("Audio playback blocked: Browser requires user interaction first.");
    } else if (error.name === 'AbortError') {
      console.warn("Audio playback interrupted by a pause() call or source change.");
    } else {
      console.error("Audio playback error:", error);
    }
  }
};

export const stopAudio = (url) => {
  const audio = audioPool.get(url);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};
