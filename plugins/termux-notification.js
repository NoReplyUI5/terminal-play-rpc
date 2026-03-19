/**
 * Termux Media Notification Plugin
 * Updates the Termux media notification with current track info and playback status.
 * Only active on Android/Termux environments.
 */
const { exec } = require("child_process");
const path = require("path");

module.exports = {
  name: "termux-notification",
  init(player) {
    const isAndroid =
      process.platform === "android" ||
      (process.env.PREFIX && process.env.PREFIX.includes("com.termux"));

    if (!isAndroid) return;

    let notificationDebounceTimer = null;

    let lastTrack = "";
    let lastState = "";

    const updateMediaNotification = (st) => {
      const currentTrack = st.file || "";
      const currentState = `${st.paused}-${st.playing}`;

      // Only update if track or play/pause state changed
      if (currentTrack === lastTrack && currentState === lastState) return;

      lastTrack = currentTrack;
      lastState = currentState;

      if (notificationDebounceTimer) clearTimeout(notificationDebounceTimer);

      notificationDebounceTimer = setTimeout(() => {
        const title = (st.title || "Unknown Title").replace(/"/g, '\\"');
        const artist = (st.artist || "Unknown Artist").replace(/"/g, '\\"');
        const status = st.paused ? "Paused" : "Playing";

        // control.js is in the project root
        const controlPath = path.join(__dirname, "..", "control.js");
        const nodeBin = process.execPath;

        const command = [
          `termux-notification`,
          `--title "${title}"`,
          `--content "${artist} (${status})"`,
          `--type media`,
          `--id tplay-player`,
          `--media-pause "${nodeBin} ${controlPath} pause"`,
          `--media-play "${nodeBin} ${controlPath} play"`,
          `--media-next "${nodeBin} ${controlPath} next"`,
          `--media-previous "${nodeBin} ${controlPath} prev"`,
        ].join(" ");

        exec(command, (error) => {
          // Silently fail if termux-api is not installed or other issues
        });
      }, 100);
    };

    const clearMediaNotification = () => {
      if (notificationDebounceTimer) {
        clearTimeout(notificationDebounceTimer);
        notificationDebounceTimer = null;
      }
      exec("termux-notification-remove tplay-player");
    };

    player.on("update", () => updateMediaNotification(player.st));
    player.on("exit", clearMediaNotification);

    // Clear any existing notification on startup
    clearMediaNotification();
  },
};
