/**
 * Example Plugin: Lyrics Toggle
 * Toggles lyrics display with CTRL+L
 */

module.exports = {
  name: "lyrics-toggle",
  init(player) {
    player.on("key", (ch, byte) => {
      // CTRL+L is 12 (form feed)
      if (byte === 12) {
        player.st.hideLyrics = !player.st.hideLyrics;
        // Trigger a redraw by force resizing (clears old lines correctly)
        player.ui.onResize(player.st);
      }
    });
  },
};
